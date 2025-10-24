'use client';

import { useState, useEffect } from 'react';
import { getPost } from '@/lib/api';
import PostForm from '@/components/PostForm';
import { Post } from '@/lib/types';
import Alert from '@/components/Alert';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postId = parseInt(params.id);
        if (isNaN(postId)) {
          setError('Invalid post ID');
          return;
        }

        const postData = await getPost(postId);
        setPost(postData);
        setError(null);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  if (!post) {
    return <Alert message="Post not found" type="error" />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <PostForm post={post} postId={post.id} isEdit={true} />
    </div>
  );
}