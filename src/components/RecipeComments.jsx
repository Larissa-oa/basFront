import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../config/api.js';
import './ComponentsStyles/RecipeComments.css';

const RecipeComments = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);

  // Fetch comments on component mount
  useEffect(() => {
    fetchComments();
  }, [id]);

  // Update author name when user changes
  useEffect(() => {
    if (user) {
      setAuthorName(user.name || '');
    }
  }, [user]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes/${id}/comments`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // If endpoint doesn't exist or returns 404, just set empty array
      if (error.response && error.response.status === 404) {
        setComments([]);
      }
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/recipes/${id}/comments`, {
        text: newComment,
        authorName: authorName.trim(),
        authorEmail: null
      }, {
        headers: user ? { Authorization: `Bearer ${localStorage.getItem('authToken')}` } : {}
      });

      // Add the new comment to the beginning of the list
      setComments([response.data.comment, ...comments]);
      setNewComment('');
      
      if (!user) {
        setAuthorName('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/recipes/${id}/comments/${commentId}`, {
        headers: user ? { Authorization: `Bearer ${localStorage.getItem('authToken')}` } : {}
      });

      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canDeleteComment = (comment) => {
    if (!user) return false;
    return user.isAdmin || (comment.author && comment.author === user._id);
  };

  const loadMoreComments = () => {
    setVisibleCount(prev => prev + 5);
  };

  const visibleComments = comments.slice(0, visibleCount);
  const hasMoreComments = comments.length > visibleCount;

  return (
    <section className="recipe-comments">
      <div className="comments-container">
        <h3 className="comments-title">Food for thought</h3>
        
        {/* Comments List */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            <>
              {visibleComments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-author">
                      <span className="author-name">{comment.authorName}</span>
                      <span className="comment-date">{formatDate(comment.createdAt)}</span>
                    </div>
                    {canDeleteComment(comment) && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="delete-comment-btn"
                        aria-label="Delete comment"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="comment-content">
                    {comment.text}
                  </div>
                </div>
              ))}
              
              {hasMoreComments && (
                <button onClick={loadMoreComments} className="load-more-btn">
                  Load more comments
                </button>
              )}
            </>
          )}
        </div>
        
        {/* Comment Form */}
        <form className="comment-form" onSubmit={handleSubmitComment}>
          {!user && (
            <div className="form-group">
              <label htmlFor="author-name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="author-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name"
                className="form-input"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="comment-text" className="form-label">
              Comment
            </label>
            <textarea
              id="comment-text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What did you think of this recipe?"
              className="comment-textarea"
              rows="4"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-comment-btn"
            disabled={loading || !newComment.trim()}
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default RecipeComments;
