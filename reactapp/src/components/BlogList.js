import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as blogPostService from '../api/blogPostService';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await blogPostService.getAllPosts();
      setPosts(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Fetch error');
      // Set empty posts array so UI still renders
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const result = await blogPostService.deletePost(id);
        setMessage(result.message);
        loadPosts();
        setError('');
      } catch (err) {
        setError(err.message || 'Delete error occurred');
        setMessage('');
      }
    }
  };

  if (loading) return <div className="container"><div className="loading fade-in">✨ Loading amazing content...</div></div>;
  
  if (error && posts.length === 0) {
    return (
      <div className="container fade-in">
        <div className="header">
          <h1>📝 Blog Hub</h1>
        </div>
        <div className="card">
          <div className="error">
            🚫 {error}
          </div>
          <p>Please make sure the Spring Boot backend is running on port 8080.</p>
          <Link to="/posts/new" className="btn">
            ✍️ Create New Post
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div className="header floating">
        <h1>📝 Blog Hub</h1>
        <p>Share your thoughts with the world</p>
      </div>
      
      {message && <div className="success">✅ {message}</div>}
      {error && <div className="error">🚫 {error}</div>}
      
      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <button className="btn">
          <Link to="/posts/new" style={{textDecoration: 'none', color: 'inherit'}}>
            ✍️ Create New Post
          </Link>
        </button>
      </div>
      
      {posts.length === 0 ? (
        <div className="card" style={{textAlign: 'center'}}>
          <h3>🌟 No posts available!</h3>
          <p>Be the first to share something amazing.</p>
        </div>
      ) : (
        <div className="post-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card slide-up">
              <h2 style={{marginBottom: '15px', color: '#333'}}>
                <Link to={`/posts/${post.id}`} style={{textDecoration: 'none', color: '#667eea'}}>
                  {post.title}
                </Link>
              </h2>
              <p style={{color: '#666', marginBottom: '15px', fontSize: '14px'}}>
                By {post.author} on {new Date(post.createdAt).toLocaleString()}
              </p>
              <p style={{color: '#777', marginBottom: '20px', lineHeight: '1.5'}}>
                {post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}
              </p>
              <div>
                <Link to={`/posts/${post.id}/edit`} className="btn">
                  ✏️ Edit
                </Link>
                <button onClick={() => handleDelete(post.id)} className="btn btn-danger">
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;