import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  content: string;
  company: string;
  role: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={post.profiles.avatar_url || `https://ui-avatars.com/api/?name=${post.profiles.username}`}
              alt={post.profiles.username}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <Link to={`/profile/${post.profiles.username}`} className="font-medium text-gray-900 hover:underline">
                {post.profiles.username}
              </Link>
              <p className="text-sm text-gray-500">
                {post.role} at {post.company}
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
          <p className="text-gray-700 mb-4">{post.content}</p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex space-x-4">
              <button className="flex items-center space-x-1 hover:text-blue-600">
                <ThumbsUp className="h-4 w-4" />
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-600">
                <MessageSquare className="h-4 w-4" />
                <span>Comment</span>
              </button>
            </div>
            <time>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</time>
          </div>
        </article>
      ))}
    </div>
  );
}