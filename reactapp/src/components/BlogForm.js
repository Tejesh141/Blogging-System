import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as blogPostService from '../api/blogPostService';

const BlogForm = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadPost();
    }
  }, [mode, id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await blogPostService.getPostById(id);
      setFormData({
        title: data.title,
        content: data.content,
        author: data.author
      });
      setError('');
    } catch (err) {
      setError(err.message || 'Error loading post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value.trim()) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.content.trim()) errors.content = 'Content is required';
    if (!formData.author.trim()) errors.author = 'Author is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (mode === 'create') {
        await blogPostService.createPost(formData);
        setMessage('Blog post created successfully!');
      } else {
        await blogPostService.updatePost(id, formData);
        setMessage('Blog post updated successfully!');
      }
      setError('');
    } catch (err) {
      setError(err.message || `${mode === 'create' ? 'Required fields missing' : 'API validation error on update'}`);
      setMessage('');
    }
  };

  if (loading) return <div className="container"><div className="loading fade-in">✨ Loading...</div></div>;

  return (
    <div className="container fade-in">
      <div className="card">
        <div style={{marginBottom: '30px'}}>
          <Link to="/" className="btn" style={{fontSize: '14px'}}>
            ← Back to Posts
          </Link>
        </div>
        
        <h1 style={{color: '#333', marginBottom: '30px', textAlign: 'center'}}>
          {mode === 'create' ? '✍️ Create New Post' : '✏️ Edit Post'}
        </h1>
        
        {error && <div className="error">🚫 {error}</div>}
        {message && <div className="success">✅ {message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">📝 Title</label>
            <input
              type="text"
              id="title"
              name="title"
              data-testid="title-input"
              className="input"
              placeholder="Enter an engaging title..."
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {validationErrors.title && <div className="error" style={{fontSize: '14px', padding: '8px'}}>{validationErrors.title}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="content">📜 Content</label>
            <textarea
              id="content"
              name="content"
              data-testid="content-input"
              className="input textarea"
              placeholder="Share your thoughts and ideas..."
              value={formData.content}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {validationErrors.content && <div className="error" style={{fontSize: '14px', padding: '8px'}}>{validationErrors.content}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="author">👤 Author</label>
            <input
              type="text"
              id="author"
              name="author"
              data-testid="author-input"
              className="input"
              placeholder="Your name..."
              value={formData.author}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {validationErrors.author && <div className="error" style={{fontSize: '14px', padding: '8px'}}>{validationErrors.author}</div>}
          </div>
          
          <div style={{textAlign: 'center', marginTop: '30px'}}>
            <button type="submit" className="btn" style={{fontSize: '18px', padding: '15px 40px'}}>
              {mode === 'create' ? '✨ Create Post' : '💾 Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;