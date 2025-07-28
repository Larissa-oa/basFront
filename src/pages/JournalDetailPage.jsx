import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaPen, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import { AuthContext } from '../Context/AuthContext';
import API_BASE_URL from '../config/api.js';
import './PageStyles/JournalDetailPage.css';

const JournalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    const fetchJournal = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/journals/${id}`);
        setJournal(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching journal:', err);
        setError(err.response?.data?.message || 'Failed to load journal');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJournal();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this journal?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/journals/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Journal deleted successfully!');
        navigate('/journals'); 
      } catch (err) {
        console.error('Error deleting journal:', err);
        alert('Failed to delete journal. Please try again.');
      }
    }
  };

  const handleEdit = () => {
    navigate(`/journals/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/journals'); 
  };

  const nextImage = () => {
    if (journal?.images && journal.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % journal.images.length);
    }
  };

  const prevImage = () => {
    if (journal?.images && journal.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + journal.images.length) % journal.images.length);
    }
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="journal-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading journal...</p>
        </div>
      </div>
    );
  }

 
  if (error) {
    return (
      <div className="journal-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleBack} className="back-button">
            <FaArrowLeft className="back-icon" />
            Back to Journals
          </button>
        </div>
      </div>
    );
  }


  if (!journal) {
    return (
      <div className="journal-container">
        <div className="error-container">
          <h2>Journal Not Found</h2>
          <p>The journal you're looking for doesn't exist.</p>
          <button onClick={handleBack} className="back-button">
            <FaArrowLeft className="back-icon" />
            Back to Journals
          </button>
        </div>
      </div>
    );
  }

  const imagesPerView = 3;
  const maxIndex = Math.max(0, (journal.images?.length || 0) - imagesPerView);

  return (
    <div className="journal-container">

      {/* Main Content */}
      <main className="main-content">
        <div className="content-grid">
          {/* Left Column - Main Image */}
          <div className="main-image-section">
            <div className="main-image-container">
              {journal.mainImage ? (
                <img
                  src={journal.mainImage.startsWith('http') 
                    ? journal.mainImage 
                    : `${API_BASE_URL}${journal.mainImage}`}
                  alt={journal.title}
                  className="main-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="no-image-placeholder" style={{ display: journal.mainImage ? 'none' : 'flex' }}>
                <span>No image available</span>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="content-section">
            <div className="content-inner">
              {/* Title and Date */}
              <div className="title-section">
                 <button onClick={handleBack} className="back-button">
             ← Back to Journals
            </button>
                <h1 className="journal-title">
                  {journal.title}
                </h1>
                
                <div className="meta-info">
                  <span>{formatDate(journal.createdAt)}</span>
                  {journal.updatedAt && journal.updatedAt !== journal.createdAt && (
                    <span>Updated {formatDate(journal.updatedAt)}</span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="text-content">
                {journal.text ? (
                  journal.text.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-paragraph">
                        {paragraph}
                      </p>
                    )
                  ))
                ) : (
                  <p className="no-content">No content available.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Behind the Process Gallery */}
        {journal.images && journal.images.length > 0 && (
          <div className="journal-process-images">
            <h3>Behind the process</h3>
            <div className="process-images-gallery">
              {journal.images.map((image, index) => (
                <img 
                  key={index} 
                  src={image.startsWith('http') ? image : `${API_BASE_URL}${image}`} 
                  alt={`Process image ${index + 1}`} 
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JournalDetailPage;