import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const baseUrl = process.env.NEXT_PUBLIC_HOST_URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [signUpError, setSignUpError] = useState('')
  const [signInError, setSignInError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const { data } = supabase.auth.getSession()
    const session = data?.session
    const user = session?.user ?? null
    setUser(user)
    setLoading(false)

    if (user) {
      checkAdminStatus(user);
    }

    const { subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null
        setUser(user)
        if (user) {
          checkAdminStatus(user);
        }
      });

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const checkAdminStatus = async (currentUser) => {
    if (currentUser) {
      const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', currentUser.id)
          .limit(1)

      if (error) {
        console.error('Error checking admin status: ', error);
        return;
      }

      setIsAdmin(profile[0]?.is_admin ?? false);
    }
  };

  const signIn = async ({ email, password, redirectTo }) => {
    try {
      setLoading(true)
      const { data: { user}, error } = await supabase.auth.signInWithPassword({ email, password })
      user ? await checkAdminStatus(user) : null
      if (!user || error) {
        setSignInError('There was an error signing in, please check your email and password.')
      }
      if (!error && redirectTo) {
        await router.push(redirectTo);
      }
    } catch (error) {
      return error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async ({ email, password, firstName, lastName, redirectTo }) => {
    try {
      setLoading(true);
      // sign up user
      const { data, error } = await supabase.auth.signUp({ email, password })
      const user = data?.user


      // add user profile
      // If the sign up was successful, create a profile for this user
      if (user) {
        const { data, error: insertError } = await supabase
          .from('profiles')
          .insert([{ user_id: user.id, first_name: firstName, last_name: lastName, is_admin: false }])
      }

      if (!error && redirectTo) {
        await router.push(redirectTo);
      }
    } catch (error) {
      setSignUpError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
    } catch (error) {
      alert(error.message)
    }
  }

  const forgotPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: baseUrl + 'update-password',
      });
      if (error) {
        console.error(error.message)
        return `Error sending password reset email: ${error.message}`

        // Display an error message to the user
      } else {
        // Display a success message to the user
      }
    } catch (error) {
      console.error(error)
      return `An unexpected error occurred: ${error}`

      // Display an error message to the user
    }
  }

  const value = {
    user,
    isAdmin,
    loading,
    signIn,
    signInError,
    signUp,
    signUpError,
    signOut,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext)
}