'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost, Post } from '@/lib/api';

interface PostFormProps {
  post?: Post;
  postId?: number;
  isEdit?: boolean;
}

export default function PostForm({ post, postId, isEdit = false }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && postId) {
        await updatePost(postId, { title, content });
      } else {
        await createPost({ title, content });
      }
      
      router.push('/posts');
      router.refresh();
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while saving the post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-md p-6">
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered"
          required
          disabled={loading}
        />
      </div>
      
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Content</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea textarea-bordered h-40"
          required
          disabled={loading}
        ></textarea>
      </div>
      
      <div className="flex justify-end space-x-2">
        <a href={isEdit ? `/posts/${postId}` : '/posts'} className="btn btn-ghost">
          Cancel
        </a>
        <button
          type="submit"
          className={`btn ${loading ? 'btn-disabled' : 'btn-primary'}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              {isEdit ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEdit ? 'Update Post' : 'Create Post'
          )}
        </button>
      </div>
    </form>
  );
}