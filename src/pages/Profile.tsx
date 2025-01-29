import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { Briefcase, MapPin, Calendar } from 'lucide-react';

interface Profile {
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  created_at: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  company: string;
  role: string;
  created_at: string;
}

export function Profile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!username) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileData) {
        setProfile(profileData);

        const { data: postsData } = await supabase
          .from('posts')
          .select('*')
          .eq('author_id', profileData.id)
          .order('created_at', { ascending: false });

        if (postsData) {
          setPosts(postsData);
        }
      }

      setLoading(false);
    }

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        <div className="px-6 py-4 sm:px-8 sm:py-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5">
              <div className="flex-shrink-0">
                <img
                  className="mx-auto h-20 w-20 rounded-full border-4 border-white -mt-16"
                  src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}`}
                  alt={profile.username}
                />
              </div>
              <div className="mt-4 sm:mt-0 text-center sm:text-left">
                <p className="text-xl font-bold text-gray-900 sm:flex sm:items-center">
                  {profile.full_name || profile.username}
                </p>
                <p className="text-sm text-gray-500">@{profile.username}</p>
              </div>
            </div>
          </div>
          {profile.bio && (
            <div className="mt-6 text-sm text-gray-700">{profile.bio}</div>
          )}
          <div className="mt-6 flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Experiences</h2>
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <Briefcase className="h-4 w-4" />
                <span>{post.role}</span>
                <span>•</span>
                <span>{post.company}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-700">{post.content}</p>
              <div className="mt-4 text-sm text-gray-500">
                Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </div>
            </article>
          ))}
          {posts.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No work experiences shared yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}