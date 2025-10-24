'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPosts, deletePost as deletePostAPI } from '@/lib/api';
import { Post } from '@/lib/types';
import Pagination from '@/components/Pagination';
import Alert from '@/components/Alert';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getPosts(currentPage, postsPerPage);
        setPosts(response.data);
        setTotalPages(response.meta.totalPages);
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await deletePostAPI(id);
      setDeleteSuccess('Post deleted successfully');
      // Refresh the posts list
      const response = await getPosts(currentPage, postsPerPage);
      setPosts(response.data);
    } catch (err) {
      console.error('Error deleting post:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  return (
    <div>
      {deleteError && <Alert message={deleteError} type="error" onClose={() => setDeleteError(null)} />}
      {deleteSuccess && <Alert message={deleteSuccess} type="success" onClose={() => setDeleteSuccess(null)} />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link href="/posts/new" className="btn btn-primary">Create New Post</Link>
      </div>
      
      {posts.length === 0 ? (
        <div className="hero min-h-[50vh] bg-base-200 rounded-box">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold">No Posts Yet</h1>
              <p className="py-6">Be the first to create a post!</p>
              <Link href="/posts/new" className="btn btn-primary">Create Post</Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post.id} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <h2 className="card-title">{post.title}</h2>
                  <p className="text-gray-500 text-sm mb-2">
                    By {post.author?.name || 'Unknown'} on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="line-clamp-3">{post.content}</p>
                  <div className="card-actions justify-end mt-4">
                    <Link href={`/posts/${post.id}`} className="btn btn-primary btn-sm">View</Link>
                    <Link href={`/posts/${post.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                    <button 
                      onClick={() => handleDelete(post.id)} 
                      className="btn btn-error btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}