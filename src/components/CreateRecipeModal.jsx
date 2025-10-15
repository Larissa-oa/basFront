import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { uploadToCloudinary } from '../config/cloudinary.js';
import API_BASE_URL from '../config/api.js';
import axios from 'axios';
import './ComponentsStyles/CreateRecipeModal.css';

const CreateRecipeModal = ({ isOpen, onClose, onRecipeCreated }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [headerImage, setHeaderImage] = useState(null);
  const [processImages, setProcessImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [processImagePreviews, setProcessImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_PROCESS_IMAGES = 5;

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
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProcessImagesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const currentImages = processImages || [];
    
    if (currentImages.length + newFiles.length > MAX_PROCESS_IMAGES) {
      alert(`You can only add up to ${MAX_PROCESS_IMAGES} process images. You currently have ${currentImages.length} images.`);
      return;
    }

    const updatedImages = [...currentImages, ...newFiles];
    setProcessImages(updatedImages);

    const newPreviews = [...processImagePreviews];
    
    newFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews[currentImages.length + index] = e.target.result;
        setProcessImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeProcessImage = (index) => {
    const newImages = processImages.filter((_, i) => i !== index);
    const newPreviews = processImagePreviews.filter((_, i) => i !== index);
    setProcessImages(newImages);
    setProcessImagePreviews(newPreviews);
  };

  const removeHeaderImage = () => {
    setHeaderImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    if (!instructions.trim()) {
      alert('Instructions are required.');
      return;
    }

    setIsSubmitting(true);

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
          setIsSubmitting(false);
          return;
        }
      }

      if (processImages.length > 0) {
        try {
          const uploadPromises = processImages.map(image => uploadToCloudinary(image));
          processImageUrls = await Promise.all(uploadPromises);
        } catch (error) {
          console.error('Error uploading process images:', error);
          alert('Failed to upload process images. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      const validIngredients = ingredients.filter(ing => ing.trim());

      const recipeData = {
        title: title,
        ingredients: validIngredients,
        instructions: instructions,
        headerImage: headerImageUrl,
        processImages: processImageUrls
      };

      if (prepTime) recipeData.prepTime = prepTime;
      if (cookTime) recipeData.cookTime = cookTime;
      if (servings) recipeData.servings = servings;

      const response = await axios.post(`${API_BASE_URL}/recipes`, recipeData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Reset form
      setTitle('');
      setIngredients(['']);
      setInstructions('');
      setPrepTime('');
      setCookTime('');
      setServings('');
      setHeaderImage(null);
      setProcessImages([]);
      setImagePreview(null);
      setProcessImagePreviews([]);

      onRecipeCreated(response.data);
      onClose();
    } catch (err) {
      console.error('Error saving recipe:', err);
      alert('Failed to save the recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-recipe-overlay" onClick={onClose}>
      <div className="create-recipe-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        
        <h2 className="modal-title">Create New Recipe</h2>
        
        <form onSubmit={handleSubmit} className="create-recipe-form">
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
            <label className="form-label">Ingredients (optional)</label>
            <p className="form-hint">Add ingredients for recipes, or leave empty for journal entries</p>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-input-group">
                <input
                  type="text"
                  className="form-input"
                  value={ingredient}
                  onChange={e => handleIngredientChange(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
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
            <p className="form-hint">Write detailed instructions for recipes, or describe your experience for journal entries</p>
            <textarea
              className="form-textarea"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              rows="8"
              placeholder="Write your recipe instructions or journal entry here..."
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
            {imagePreview && (
              <div className="image-preview-container">
                <img 
                  src={imagePreview} 
                  alt="Header image preview" 
                  className="image-preview"
                />
                <button
                  type="button"
                  onClick={removeHeaderImage}
                  className="remove-image-btn"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Process Images ({processImages.length}/{MAX_PROCESS_IMAGES})
            </label>
            <p className="form-hint">Upload up to {MAX_PROCESS_IMAGES} images showing the cooking process</p>
            <input
              type="file"
              className="form-file-input"
              accept="image/*"
              multiple
              onChange={handleProcessImagesChange}
            />
            
            {processImagePreviews.length > 0 && (
              <div className="images-preview-container">
                <p className="form-hint">
                  {processImagePreviews.length} image{processImagePreviews.length > 1 ? 's' : ''} selected
                </p>
                <div className="images-grid">
                  {processImagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-container">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="image-preview"
                      />
                      <button
                        type="button"
                        onClick={() => removeProcessImage(index)}
                        className="remove-image-btn"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipeModal;
