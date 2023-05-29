import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const session = supabase.auth.getSession()
    setUser(session?.user ?? null)
    setLoading(false)

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    });

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  const signIn = async ({ email, password, redirectTo }) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      if (!error && redirectTo) {
        router.push(redirectTo);
      }
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async ({ email, password, firstName, lastName, redirectTo }) => {
    try {
      setLoading(true);
      // sign up user
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      const user = data?.user


      // add user profile
      // If the sign up was successful, create a profile for this user
      if (user) {
        const { data, error: insertError } = await supabase
          .from('profiles')
          .insert([{ user_id: user.id, first_name: firstName, last_name: lastName, is_admin: false }])

        if (insertError) throw insertError
      }

      if (!error && redirectTo) {
        router.push(redirectTo);
      }
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message)
    }
  }

  const forgotPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
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
  const value = useContext(AuthContext)

  return value
}