import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

const EditProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function getProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`id, first_name, last_name, is_admin, user_id`)
          .eq('user_id', user.id)
          .limit(1)

        setProfile(data[0]);
      } catch (error) {
        alert(error.message);
      }
    }

    getProfile();
  }, [user]);



  async function updateProfile(e) {
    e.preventDefault();

    const updates = {
      id: profile.id,
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={updateProfile} className="bg-white p-8 rounded-lg shadow-md space-y-4">
          <div className="mb-2">
            <input
                type="text"
                value={profile?.first_name}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                placeholder="First name"
                className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          <div className="mb-2">
            <input
                type="text"
                value={profile?.last_name}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                placeholder="Last name"
                className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
          {user?.is_admin && (
              <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={profile?.is_admin}
                    onChange={(e) => setProfile({ ...profile, is_admin: e.target.checked })}
                    className="h-5 w-5 text-blue-600 rounded"
                />
                <label className="font-medium text-gray-700" htmlFor="is_admin">Is Admin</label>
              </div>
          )}
          <div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
  );
};

export default EditProfile;
