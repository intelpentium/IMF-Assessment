import { Context } from 'hono';
import { postRepository } from '../repositories/post';

export const listPosts = async (c: Context) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');

    if (page < 1 || limit < 1 || limit > 100) {
      return c.json({ 
        error: { 
          code: 'INVALID_PAGINATION', 
          message: 'Invalid pagination parameters' 
        } 
      }, 400);
    }

    const { posts, total } = await postRepository.findAll({
      page,
      limit,
      includeAuthor: true,
    });

    const totalPages = Math.ceil(total / limit);

    return c.json({
      data: posts,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('List posts error:', error);
    return c.json({ 
      error: { 
        code: 'LIST_POSTS_ERROR', 
        message: 'Failed to retrieve posts' 
      } 
    }, 500);
  }
};

export const getPost = async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    
    if (isNaN(id) || id < 1) {
      return c.json({ 
        error: { 
          code: 'INVALID_ID', 
          message: 'Invalid post ID' 
        } 
      }, 400);
    }

    const post = await postRepository.findById(id, { includeAuthor: true });
    
    if (!post) {
      return c.json({ 
        error: { 
          code: 'POST_NOT_FOUND', 
          message: 'Post not found' 
        } 
      }, 404);
    }

    return c.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    return c.json({ 
      error: { 
        code: 'GET_POST_ERROR', 
        message: 'Failed to retrieve post' 
      } 
    }, 500);
  }
};

export const createPost = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const { title, content } = await c.req.json();
    
    const newPost = await postRepository.create({
      title,
      content,
      authorId: userId,
    });

    return c.json(newPost, 201);
  } catch (error) {
    console.error('Create post error:', error);
    return c.json({ 
      error: { 
        code: 'CREATE_POST_ERROR', 
        message: 'Failed to create post' 
      } 
    }, 500);
  }
};

export const updatePost = async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    const userId = c.get('userId');
    const { title, content } = await c.req.json();
    
    if (isNaN(id) || id < 1) {
      return c.json({ 
        error: { 
          code: 'INVALID_ID', 
          message: 'Invalid post ID' 
        } 
      }, 400);
    }

    const post = await postRepository.findById(id);
    if (!post) {
      return c.json({ 
        error: { 
          code: 'POST_NOT_FOUND', 
          message: 'Post not found' 
        } 
      }, 404);
    }

    if (post.authorId !== userId) {
      return c.json({ 
        error: { 
          code: 'FORBIDDEN', 
          message: 'You can only update your own posts' 
        } 
      }, 403);
    }

    const updatedPost = await postRepository.update(id, {
      title,
      content,
    });

    return c.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    return c.json({ 
      error: { 
        code: 'UPDATE_POST_ERROR', 
        message: 'Failed to update post' 
      } 
    }, 500);
  }
};

export const deletePost = async (c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    const userId = c.get('userId');
    
    if (isNaN(id) || id < 1) {
      return c.json({ 
        error: { 
          code: 'INVALID_ID', 
          message: 'Invalid post ID' 
        } 
      }, 400);
    }

    const post = await postRepository.findById(id);
    if (!post) {
      return c.json({ 
        error: { 
          code: 'POST_NOT_FOUND', 
          message: 'Post not found' 
        } 
      }, 404);
    }

    if (post.authorId !== userId) {
      return c.json({ 
        error: { 
          code: 'FORBIDDEN', 
          message: 'You can only delete your own posts' 
        } 
      }, 403);
    }

    await postRepository.delete(id);
    return c.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    return c.json({ 
      error: { 
        code: 'DELETE_POST_ERROR', 
        message: 'Failed to delete post' 
      } 
    }, 500);
  }
};