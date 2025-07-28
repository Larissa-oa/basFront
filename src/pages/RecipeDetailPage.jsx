import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import { FaTrash, FaPen, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import API_BASE_URL from '../config/api.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import './PageStyles/RecipeDetailPage.css';

Modal.setAppElement('#root');

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [headerImage, setHeaderImage] = useState(null);
  const [newProcessImages, setNewProcessImages] = useState([]);
  const [headerImagePreview, setHeaderImagePreview] = useState(null);
  const [processImagePreviews, setProcessImagePreviews] = useState([]);
  const [existingHeaderImage, setExistingHeaderImage] = useState(null);
  const [existingProcessImages, setExistingProcessImages] = useState([]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const MAX_PROCESS_IMAGES = 5;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/recipes/${id}`)
      .then(res => {
        setRecipe(res.data);
        setLoading(false);
        setCurrentImageIndex(0);
      })
      .catch(err => {
        console.error('Error fetching recipe:', err);
        setError('Recipe not found or failed to load.');
        setLoading(false);
      });
  }, [id]);

  const openEditModal = () => {
    if (!recipe) return;

    setTitle(recipe.title || '');
    setIngredients(recipe.ingredients?.length ? recipe.ingredients : ['']);
    setInstructions(recipe.instructions || '');
    setPrepTime(recipe.prepTime || '');
    setCookTime(recipe.cookTime || '');
    setServings(recipe.servings || '');
    setExistingHeaderImage(recipe.headerImage || null);
    setExistingProcessImages(recipe.processImages || []);
    setHeaderImage(null);
    setNewProcessImages([]);
    setHeaderImagePreview(null);
    setProcessImagePreviews([]);
    setModalIsOpen(true);
  };

  const addIngredient = () => setIngredients(prev => [...prev, '']);
  const removeIngredient = (index) => setIngredients(prev => prev.filter((_, i) => i !== index));
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleHeaderImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeaderImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setHeaderImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProcessImagesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const currentImages = newProcessImages || [];
    
    // Check if adding these files would exceed the limit
    if (currentImages.length + newFiles.length > MAX_PROCESS_IMAGES) {
      alert(`You can only add up to ${MAX_PROCESS_IMAGES} process images. You currently have ${currentImages.length} images.`);
      return;
    }

    // Add new files to existing images array
    const updatedImages = [...currentImages, ...newFiles];
    setNewProcessImages(updatedImages);

    // Create previews for new images
    const newPreviews = [...processImagePreviews];
    
    newFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews[currentImages.length + index] = e.target.result;
        setProcessImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    // Clear the file input so the same files can be selected again if needed
    e.target.value = '';
  };

  // Remove process image
  const removeProcessImage = (indexToRemove) => {
    const newImages = newProcessImages.filter((_, index) => index !== indexToRemove);
    const newPreviews = processImagePreviews.filter((_, index) => index !== indexToRemove);
    
    setNewProcessImages(newImages);
    setProcessImagePreviews(newPreviews);
  };

  // Remove header image
  const removeHeaderImage = () => {
    setHeaderImage(null);
    setHeaderImagePreview(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !instructions.trim() || ingredients.some(ing => !ing.trim())) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Upload images to Cloudinary first
      let headerImageUrl = null;
      let processImageUrls = [];

      if (headerImage) {
        try {
          headerImageUrl = await uploadToCloudinary(headerImage);
        } catch (error) {
          console.error('Error uploading header image:', error);
          alert('Failed to upload header image. Please try again.');
          return;
        }
      }

      if (newProcessImages.length > 0) {
        try {
          const uploadPromises = newProcessImages.map(image => uploadToCloudinary(image));
          processImageUrls = await Promise.all(uploadPromises);
        } catch (error) {
          console.error('Error uploading process images:', error);
          alert('Failed to upload process images. Please try again.');
          return;
        }
      }

      // Prepare the data to send to backend
      const recipeData = {
        title: title,
        ingredients: ingredients,
        instructions: instructions,
        headerImage: headerImageUrl,
        processImages: processImageUrls
      };

      if (prepTime) recipeData.prepTime = prepTime;
      if (cookTime) recipeData.cookTime = cookTime;
      if (servings) recipeData.servings = servings;

      const response = await axios.put(`${API_BASE_URL}/recipes/${id}`, recipeData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setRecipe(response.data);
      setModalIsOpen(false);
      setHeaderImage(null);
      setNewProcessImages([]);
      setHeaderImagePreview(null);
      setProcessImagePreviews([]);
    } catch (err) {
      console.error('Error updating recipe:', err);
      alert('Failed to update recipe.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/recipes');
    } catch (err) {
      console.error('Error deleting recipe:', err);
      alert('Failed to delete recipe.');
    }
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const imagesPerView = 3;
  const processImages = recipe?.processImages || [];
  const maxIndex = Math.max(0, processImages.length - imagesPerView);

  const nextImage = () => setCurrentImageIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
  const prevImage = () => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : 0));

  if (loading) return <p className="loading-text">Loading recipe...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!recipe) return <p className="error-text">Recipe not found.</p>;

  return (
    <article className="recipe-detail-page">
      <div className="recipe-layout">
        <div className="recipe-main-image">
          {recipe.headerImage ? (
            <img src={recipe.headerImage.startsWith('http') ? recipe.headerImage : `${API_BASE_URL}${recipe.headerImage}`} alt={recipe.title} />
          ) : (
            <div className="no-image-placeholder">No header image available</div>
          )}
        </div>

        <div className="recipe-content">
          <button className="back-btn" onClick={() => navigate('/recipes')}>← Back</button>
          <span className="recipe-title" id="recipe-title">{recipe.title}</span>

          <div className="recipe-meta">
            {recipe.prepTime && <p><strong>Prep Time:</strong> {recipe.prepTime} min</p>}
            {recipe.cookTime && <p><strong>Cook Time:</strong> {recipe.cookTime} min</p>}
            {recipe.servings && <p><strong>Servings:</strong> {recipe.servings}</p>}
          </div>

          <div className="recipe-ingredients">
            <h3>Ingredients</h3>
            <ul>{recipe.ingredients?.map((item, i) => <li key={i}>{item}</li>)}</ul>
          </div>

          <div className="recipe-instructions">
            <h3>Instructions</h3>
            {recipe.instructions
              ? recipe.instructions.split('\n').map((step, i) => <p key={i}>{step}</p>)
              : <p>No instructions available.</p>}
          </div>

          <footer className="recipe-footer">
            <small>Created: {formatDate(recipe.createdAt)}</small><br />
            {recipe.updatedAt && <small>Last updated: {formatDate(recipe.updatedAt)}</small>}
          </footer>
        </div>
      </div>

      {/* Carousel outside recipe-layout */}
      {processImages.length > 0 && (
        <div className="carousel-section">
          <div className="carousel-header">
            <h2 className="carousel-title">In the making</h2>
          </div>

          <div className="carousel-container">
            {processImages.length > imagesPerView && (
              <div className="carousel-nav">
                <button
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                  className="nav-button"
                  aria-label="Previous images"
                >
                  <FaChevronLeft className="nav-icon" />
                </button>
                <button
                  onClick={nextImage}
                  disabled={currentImageIndex >= maxIndex}
                  className="nav-button"
                  aria-label="Next images"
                >
                  <FaChevronRight className="nav-icon" />
                </button>
              </div>
            )}

            <div className="carousel-overflow">
              <div
                className="carousel-track"
                style={{
                  transform: `translateX(-${(currentImageIndex / processImages.length) * 100}%)`,
                  width: `${(processImages.length / imagesPerView) * 100}%`,
                }}
              >
                {processImages.map((img, i) => (
                  <div
                    key={i}
                    className="carousel-slide"
                    style={{ width: `${100 / processImages.length}%` }}
                  >
                    <div className="carousel-image-wrapper">
                      <div className="carousel-image-container">
                        <img
                          src={img.startsWith('http') ? img : `${API_BASE_URL}${img}`}
                          alt={`Step ${i + 1}`}
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

            {processImages.length > imagesPerView && (
              <div className="progress-indicator">
                {Array.from({ 
                  length: Math.ceil((processImages.length - imagesPerView + 1)) 
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`progress-dot ${currentImageIndex === index ? 'active' : ''}`}
                    aria-label={`Go to image set ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Edit Recipe"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Edit Recipe</h2>
        <div className="modal-content">
          <form onSubmit={handleUpdate} className="edit-recipe-form">
            <div className="form-group">
              <label className="form-label">Title*</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                autoFocus
                placeholder="Enter recipe title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ingredients*</label>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-input-group">
                  <input
                    type="text"
                    className="form-input"
                    value={ingredient}
                    onChange={e => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    required
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="remove-ingredient-btn"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="add-ingredient-btn"
              >
                + Add Ingredient
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Instructions*</label>
              <textarea
                className="form-textarea"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                rows="8"
                placeholder="Write your recipe instructions here..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prep Time (min)</label>
                <input
                  type="number"
                  className="form-input"
                  value={prepTime}
                  onChange={e => setPrepTime(e.target.value)}
                  placeholder="e.g., 15"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cook Time (min)</label>
                <input
                  type="number"
                  className="form-input"
                  value={cookTime}
                  onChange={e => setCookTime(e.target.value)}
                  placeholder="e.g., 30"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Servings</label>
                <input
                  type="number"
                  className="form-input"
                  value={servings}
                  onChange={e => setServings(e.target.value)}
                  placeholder="e.g., 4"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Header Image</label>
              <p className="form-hint">This will be the main image displayed on the recipe card</p>
              <input
                type="file"
                className="form-file-input"
                accept="image/*"
                onChange={handleHeaderImageChange}
              />
              {headerImagePreview && (
                <div className="image-preview-container">
                  <img 
                    src={headerImagePreview} 
                    alt="Header image preview" 
                    className="image-preview"
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={removeHeaderImage}
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
              {headerImage && (
                <p className="form-hint">Selected: {headerImage.name}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Process Images ({newProcessImages.length}/{MAX_PROCESS_IMAGES})
              </label>
              <p className="form-hint">Upload up to {MAX_PROCESS_IMAGES} images showing the cooking process</p>
              <input
                type="file"
                className="form-file-input"
                accept="image/*"
                multiple
                onChange={handleProcessImagesChange}
              />
              
              {/* Show current images */}
              {newProcessImages.length > 0 && (
                <div className="images-preview-container" style={{ marginTop: '10px' }}>
                  <p className="form-hint">
                    {newProcessImages.length} image{newProcessImages.length > 1 ? 's' : ''} selected
                  </p>
                  <div className="images-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                    gap: '10px', 
                    marginTop: '10px' 
                  }}>
                    {processImagePreviews.map((preview, index) => (
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
                          onClick={() => removeProcessImage(index)}
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
              {newProcessImages.length < MAX_PROCESS_IMAGES && newProcessImages.length > 0 && (
                <p className="form-hint" style={{ color: '#28a745', marginTop: '5px' }}>
                  You can add {MAX_PROCESS_IMAGES - newProcessImages.length} more image{MAX_PROCESS_IMAGES - newProcessImages.length > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setModalIsOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Recipe
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </article>
  );
};

export default RecipeDetailPage;
