import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaPen, FaPlus, FaImage, FaTimes, FaHeart, FaSearch } from 'react-icons/fa';
import { scrollToTop } from '../utils/scrollToTop';
import API_BASE_URL from '../config/api.js';
import './PageStyles/JournalPage.css';

const JournalPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [journals, setJournals] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [editingJournal, setEditingJournal] = useState(null);

  // Add state for image previews
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Add liked journals state (similar to recipes)
  const [likedJournals, setLikedJournals] = useState(new Set());

  const navigate = useNavigate();

  const MAX_IMAGES = 10;

  useEffect(() => {
    fetchJournals();
  }, []);

  // Add useEffect to sync liked journals with user favorites
  useEffect(() => {
    if (user?.favoriteJournals) {
      setLikedJournals(new Set(user.favoriteJournals.map(id => id.toString())));
    }
  }, [user]);

  const fetchJournals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/journals`);
      if (Array.isArray(response.data)) {
        setJournals(response.data);
      } else {
        setError('Unexpected response format.');
      }
    } catch (err) {
      console.error('Error fetching journals:', err);
      setError('Failed to fetch journals.');
    }
  };

  // Add toggle like function (similar to recipes)
  const toggleLike = async (journalId) => {
    if (!user) {
      alert('Please login to favorite journals.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${API_BASE_URL}/auth/favorites/journals/${journalId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikedJournals(new Set(res.data.favoriteJournals.map(id => id.toString())));
    } catch (err) {
      console.error('Failed to update favorites:', err);
      alert('Failed to update favorites.');
    }
  };

  const openCreateModal = () => {
    setEditingJournal(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (journal) => {
    setEditingJournal(journal);
    setTitle(journal.title || '');
    setText(journal.text || '');
    setMainImage(null);
    setImages([]);
    setMainImagePreview(null);
    setImagePreviews([]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
    setEditingJournal(null);
  };

  const resetForm = () => {
    setTitle('');
    setText('');
    setMainImage(null);
    setImages([]);
    setMainImagePreview(null);
    setImagePreviews([]);
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setMainImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // FIXED: Handle multiple images properly - ADD to existing array instead of replacing
  const handleImagesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const currentImages = images || [];
    
    // Check if adding these files would exceed the limit
    if (currentImages.length + newFiles.length > MAX_IMAGES) {
      alert(`You can only add up to ${MAX_IMAGES} images. You currently have ${currentImages.length} images.`);
      return;
    }

    // Add new files to existing images array
    const updatedImages = [...currentImages, ...newFiles];
    setImages(updatedImages);

    // Create previews for new images
    const newPreviews = [...imagePreviews];
    
    newFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews[currentImages.length + index] = e.target.result;
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    // Clear the file input so the same files can be selected again if needed
    e.target.value = '';
  };

  // Add function to remove individual images
  const removeImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    const newPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Add function to remove main image
  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Title is required.');
      return;
    }

    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('title', title);
    if (text.trim()) {
      formData.append('text', text);
    }
    
    if (mainImage) {
      formData.append('mainImage', mainImage);
    }
    
    // Add all images to FormData
    if (images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }

    try {
      let response;
      if (editingJournal) {
        response = await axios.put(`${API_BASE_URL}/journals/${editingJournal._id}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        setJournals(prev => prev.map(j => j._id === editingJournal._id ? response.data : j));
      } else {
        response = await axios.post(`${API_BASE_URL}/journals`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        setJournals(prev => [response.data, ...prev]);
      }

      closeModal();
    } catch (err) {
      console.error('Error saving journal:', err);
      if (err.response?.status === 403) {
        alert('You do not have permission to create/edit journals. Admin access required.');
      } else if (err.response?.status === 401) {
        alert('Please log in to create/edit journals.');
      } else {
        alert('Failed to save the journal.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this journal entry?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/journals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournals(prev => prev.filter(j => j._id !== id));
      // Remove from liked journals if it was liked
      setLikedJournals(prev => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    } catch (err) {
      console.error('Error deleting journal:', err);
      if (err.response?.status === 403) {
        alert('You do not have permission to delete journals. Admin access required.');
      } else if (err.response?.status === 401) {
        alert('Please log in to delete journals.');
      } else {
        alert('Failed to delete the journal.');
      }
    }
  };

  const filteredJournals = journals.filter(journal =>
    journal.title && journal.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading journals...</p>
    </div>
  );

  return (
    <div className="recipe-page">
      <div className="recipe-header">
        <div className="header-content">
          <h1 className="recipe-title">FoodLab</h1>
          <p className="recipe-subtitle">Every dish begins with curiosity and the courage to experiment. It’s not about perfection. It’s about discovery, learning, and sharing moments that inspire us all. Join me on this ever-evolving journey.”s</p>
        </div>
      </div>

      <div className="recipe-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search journals by title..."
            className="recipe-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {user?.isAdmin && (
          <button
            className="create-recipe-btn"
            onClick={openCreateModal}
            title="Create new journal"
          >
            <FaPlus />
          </button>
        )}
      </div>

      {error && (
        <div className="error-container">
          <p className="error-text">{error}</p>
        </div>
      )}

      <div className="recipe-grid-container">
        {filteredJournals.length === 0 && (
          <div className="no-recipes">
            <p>No journal entries found.</p>
          </div>
        )}

        <div className="recipe-grid">
          {filteredJournals.map(journal => (
            <article key={journal._id} className="recipe-card">
              <div className="recipe-card-inner">
                <div className="recipe-image-container">
                  {journal.mainImage ? (
                    <img
                      src={`${API_BASE_URL}${journal.mainImage}`}
                      alt={journal.title}
                      className="recipe-image"
                      onClick={() => {
                        scrollToTop();
                        navigate(`/journals/${journal._id}`);
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div 
                      className="recipe-image-placeholder"
                      onClick={() => {
                        scrollToTop();
                        navigate(`/journals/${journal._id}`);
                      }}
                    >
                      <span>No Image</span>
                    </div>
                  )}
                  
                  {user && (
                    <button
                      onClick={() => toggleLike(journal._id)}
                      className={`like-btn ${likedJournals.has(journal._id) ? 'liked' : ''}`}
                      title={likedJournals.has(journal._id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <FaHeart />
                    </button>
                  )}

                  {user?.isAdmin && (
                    <div className="admin-controls">
                      <button
                        className="admin-btn edit-btn"
                        id="edit-btn"
                        onClick={() => openEditModal(journal)}
                        title="Edit journal"
                      >
                        <FaPen className="icon-pen" />
                      </button>
                      <button
                        className="admin-btn delete-btn"
                        onClick={() => handleDelete(journal._id)}
                        title="Delete journal"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>

                <div 
                  className="recipe-content"
                  onClick={() => {
                    scrollToTop();
                    navigate(`/journals/${journal._id}`);
                  }}
                >
                  <h2 className="recipe-card-title">{journal.title}</h2>
                  <hr/>
                  <div className="recipe-meta">
                    {journal.createdAt && (
                      <span className="meta-item" id="created-at">
                        Created: {new Date(journal.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Custom Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingJournal ? 'Edit Journal Entry' : 'Create New Journal Entry'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="recipe-form">
                <div className="form-group">
                  <label className="form-label">Title*</label>
                  <input
                    type="text"
                    className="form-input"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    autoFocus
                    placeholder="Enter journal title"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-textarea"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows="8"
                    placeholder="Write your journal entry here..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Main Image</label>
                  <input
                    type="file"
                    className="form-file-input"
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />
                  {mainImagePreview && (
                    <div className="image-preview-container">
                      <img 
                        src={mainImagePreview} 
                        alt="Main image preview" 
                        className="image-preview"
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={removeMainImage}
                        className="remove-image-btn"
                        style={{ 
                          position: 'absolute', 
                          top: '-8px', 
                          right: '-8px', 
                          background: '#dc3545', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '50%', 
                          width: '24px', 
                          height: '24px', 
                          cursor: 'pointer' 
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                  {mainImage && (
                    <p className="form-hint">Selected: {mainImage.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Additional Images ({images.length}/{MAX_IMAGES})
                  </label>
                  <p className="form-hint">You can add multiple images up to {MAX_IMAGES} total</p>
                  <input
                    type="file"
                    className="form-file-input"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                  />
                  
                  {/* Show current images */}
                  {images.length > 0 && (
                    <div className="images-preview-container" style={{ marginTop: '10px' }}>
                      <p className="form-hint">
                        {images.length} image{images.length > 1 ? 's' : ''} selected
                      </p>
                      <div className="images-grid" style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                        gap: '10px', 
                        marginTop: '10px' 
                      }}>
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="image-preview-container" style={{ position: 'relative' }}>
                            <img 
                              src={preview} 
                              alt={`Preview ${index + 1}`} 
                              style={{ 
                                width: '100px', 
                                height: '100px', 
                                objectFit: 'cover', 
                                borderRadius: '4px' 
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="remove-image-btn"
                              style={{ 
                                position: 'absolute', 
                                top: '-8px', 
                                right: '-8px', 
                                background: '#dc3545', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '50%', 
                                width: '20px', 
                                height: '20px', 
                                cursor: 'pointer',
                                fontSize: '10px'
                              }}
                            >
                              <FaTimes />
                            </button>
                            <div style={{ 
                              position: 'absolute', 
                              bottom: '-8px', 
                              left: '-8px', 
                              background: '#007bff', 
                              color: 'white', 
                              borderRadius: '50%', 
                              width: '20px', 
                              height: '20px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontSize: '10px' 
                            }}>
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Show "Add more" button if under limit */}
                  {images.length < MAX_IMAGES && images.length > 0 && (
                    <p className="form-hint" style={{ color: '#28a745', marginTop: '5px' }}>
                      You can add {MAX_IMAGES - images.length} more image{MAX_IMAGES - images.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingJournal ? 'Update Journal' : 'Create Journal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;