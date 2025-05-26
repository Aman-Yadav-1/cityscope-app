'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import PostForm from '@/components/PostForm';
import PostList from '@/components/PostList';
import PostFilter from '@/components/PostFilter';

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState({
    postType: '',
    location: ''
  });

  // If user is not authenticated and not loading, redirect to login
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Handle filter change
  const handleFilterChange = (newFilter: any) => {
    setFilter(newFilter);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
          <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {isAuthenticated && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Community Feed</h1>
          </div>
          
          <PostForm />
          
          <PostFilter onFilterChange={handleFilterChange} />
          
          <PostList filter={filter} />
        </div>
      )}
    </Layout>
  );
}
