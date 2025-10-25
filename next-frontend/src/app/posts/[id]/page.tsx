'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {getPost, Post} from '@/lib/api';
import Alert from '@/components/Alert';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postId = Number(params.id);
        if (!Number.isFinite(postId)) {
          setError('Invalid post ID');
          setLoading(false);
          return;
        }

        const postData = await getPost(postId);

        if (!postData || typeof postData !== 'object' || !('id' in postData)) {
          setError('Post not found');
          setPost(null);
        } else {
          setPost(postData as Post);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
        setPost(null);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="flex space-x-2">
          <Link href={`/posts/${post.id}/edit`} className="btn btn-primary">Edit</Link>
          <Link href="/posts" className="btn btn-ghost">Back to Posts</Link>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="text-gray-500 text-sm mb-4">
            By {post.author?.name || 'Unknown'} on {new Date(post.createdAt).toLocaleDateString()} 
            {post.updatedAt !== post.createdAt && ` (updated: ${new Date(post.updatedAt).toLocaleDateString()})`}
          </div>
          <p className="whitespace-pre-line">{post.content}</p>
        </div>
      </div>
    </div>
  );
}