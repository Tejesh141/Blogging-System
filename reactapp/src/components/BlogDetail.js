import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as blogPostService from '../api/blogPostService';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await blogPostService.getPostById(id);
      setPost(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Blog post not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const result = await blogPostService.deletePost(id);
        setMessage(result.message);
        setError('');
      } catch (err) {
        setError(err.message || 'Delete API error!');
        setMessage('');
      }
    }
  };

  if (loading) return <div className="container"><div className="loading fade-in">✨ Loading post...</div></div>;
  if (error) return <div className="container fade-in"><div className="card"><div className="error">🚫 {error}</div></div></div>;
  if (message) return <div className="container fade-in"><div className="card"><div className="success">✅ {message}</div></div></div>;

  return (
    <div className="container fade-in">
      <div className="card">
        <div style={{marginBottom: '20px'}}>
          <button className="btn" style={{fontSize: '14px'}}>
            <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
              ← Back to List
            </Link>
          </button>
        </div>
        
        <h1 style={{color: '#333', marginBottom: '20px', fontSize: '2.5rem'}}>
          {post.title}
        </h1>
        
        <div style={{color: '#666', marginBottom: '30px', fontSize: '16px', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px'}}>
          👤 <strong>{post.author}</strong> • 📅 {new Date(post.createdAt).toLocaleDateString()} • 🕰️ {new Date(post.createdAt).toLocaleTimeString()}
        </div>
        
        <div style={{lineHeight: '1.8', fontSize: '18px', color: '#444', marginBottom: '40px', whiteSpace: 'pre-wrap'}}>
          {post.content}
        </div>
        
        <div style={{borderTop: '2px solid #f0f0f0', paddingTop: '20px'}}>
          <button className="btn">
            <Link to={`/posts/${post.id}/edit`} style={{textDecoration: 'none', color: 'inherit'}}>
              ✏️ Edit
            </Link>
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;