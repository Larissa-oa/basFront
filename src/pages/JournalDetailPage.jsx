import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaPen, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import { AuthContext } from '../Context/AuthContext';
import './PageStyles/JournalDetailPage.css'; 

const API_BASE = "http://localhost:5005";

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
        const response = await axios.get(`${API_BASE}/journals/${id}`);
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
        await axios.delete(`${API_BASE}/journals/${id}`, {
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
                    : `${API_BASE}${journal.mainImage}`}
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
             ← Back
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

        {/* Image Carousel - Bottom Section */}
        {journal.images && journal.images.length > 0 && (
          <div className="carousel-section">
            <div className="carousel-header">
              <h2 className="carousel-title">Behind the process</h2>
            </div>

            <div className="carousel-container">
              {/* Navigation Arrows */}
              {journal.images.length > imagesPerView && (
                <div className="carousel-nav">
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="nav-button"
                  >
                    <FaChevronLeft className="nav-icon" />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex >= maxIndex}
                    className="nav-button"
                  >
                    <FaChevronRight className="nav-icon" />
                  </button>
                </div>
              )}

              {/* Carousel */}
              <div className="carousel-overflow">
                <div 
                  className="carousel-track"
                  style={{ 
                    transform: `translateX(-${(currentImageIndex / journal.images.length) * 100}%)`,
                    width: `${(journal.images.length / imagesPerView) * 100}%`
                  }}
                >
                  {journal.images.map((image, index) => (
                    <div 
                      key={index} 
                      className="carousel-slide"
                      style={{ width: `${100 / journal.images.length}%` }}
                    >
                      <div className="carousel-image-wrapper">
                        <div className="carousel-image-container">
                          <img
                            src={image.startsWith('http') 
                              ? image 
                              : `${API_BASE}${image}`}
                            alt={`Gallery image ${index + 1}`}
                            className="carousel-image"
                            onError={(e) => {
                              e.target.style.opacity = '0.5';
                              e.target.alt = 'Image failed to load';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Indicator */}
              {journal.images.length > imagesPerView && (
                <div className="progress-indicator">
                  {Array.from({ 
                    length: Math.ceil((journal.images.length - imagesPerView + 1)) 
                  }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`progress-dot ${currentImageIndex === index ? 'active' : ''}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JournalDetailPage;