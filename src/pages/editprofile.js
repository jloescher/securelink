import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabaseClient';

const EditProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function getProfile() {
      try {
        const { profile, error } = await supabase
          .from('profiles')
          .select(`first_name, last_name, is_admin`)
          .eq('user_id', user.id)
          .limit(1)

        if (error) throw error;
        setProfile(profile);
      } catch (error) {
        alert(error.message);
      }
    }

    getProfile();
  }, [user]);



  async function updateProfile(e) {
    e.preventDefault();

    const updates = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      is_admin: user.is_admin ? profile.is_admin : undefined,
      user_id: user.id,
      updated_at: new Date(),
    }

    let { error } = await supabase.from('profiles').upsert(updates, { returning: 'minimal' })

    if (error) {
      alert(error.message);
    } else {
      alert('Profile updated!');
    }
  }

  return (
    <form onSubmit={updateProfile}>
      <input
        type="text"
        value={profile.first_name}
        onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
        placeholder="First name"
      />
      <input
        type="text"
        value={profile.last_name}
        onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
        placeholder="Last name"
      />
      {user?.is_admin && (
        <label>
          <input
            type="checkbox"
            checked={profile.is_admin}
            onChange={(e) => setProfile({ ...profile, is_admin: e.target.checked })}
          />
          Is Admin
        </label>
      )}
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default EditProfilePage;
