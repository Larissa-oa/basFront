import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaPen, FaPlus, FaHeart, FaSearch, FaTimes } from 'react-icons/fa';
import { scrollToTop } from '../utils/scrollToTop';
import Modal from 'react-modal';
import './PageStyles/RecipesPage.css';

Modal.setAppElement('#root');

const backendURL = 'http://localhost:5005';

const RecipePage = () => {
  const { user, loading } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Form state
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

  const [likedRecipes, setLikedRecipes] = useState(new Set());
  const [editingRecipe, setEditingRecipe] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${backendURL}/recipes`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setRecipes(res.data);
          setError(null);
        } else {
          setError('Unexpected response format.');
        }
      })
      .catch(err => {
        console.error('Error fetching recipes:', err);
        setError('Failed to fetch recipes.');
      });
  }, []);

  useEffect(() => {
    if (user?.favoriteRecipes) {
      setLikedRecipes(new Set(user.favoriteRecipes.map(id => id.toString())));
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendURL}/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(prev => prev.filter(r => r._id !== id));
      setLikedRecipes(prev => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    } catch (err) {
      console.error('Error deleting recipe:', err);
      alert('Failed to delete the recipe.');
    }
  };

  const toggleLike = async (recipeId) => {
    if (!user) {
      alert('Please login to favorite recipes.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${backendURL}/auth/favorites/recipes/${recipeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikedRecipes(new Set(res.data.favoriteRecipes.map(id => id.toString())));
    } catch (err) {
      console.error('Failed to update favorites:', err);
      alert('Failed to update favorites.');
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  // Handle header image change
  const handleHeaderImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeaderImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle process images change
  const handleProcessImagesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const currentImages = processImages || [];
    
    // Check if adding these files would exceed the limit
    if (currentImages.length + newFiles.length > 5) {
      alert(`You can only add up to 5 process images. You currently have ${currentImages.length} images.`);
      return;
    }

    // Add new files to existing images array
    const updatedImages = [...currentImages, ...newFiles];
    setProcessImages(updatedImages);

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
  const removeProcessImage = (index) => {
    const newImages = processImages.filter((_, i) => i !== index);
    const newPreviews = processImagePreviews.filter((_, i) => i !== index);
    setProcessImages(newImages);
    setProcessImagePreviews(newPreviews);
  };

  // Remove header image
  const removeHeaderImage = () => {
    setHeaderImage(null);
    setImagePreview(null);
  };

  const addIngredient = () => {
    setIngredients(prev => [...prev, '']);
  };

  const removeIngredient = (index) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  // Open modal for creating new recipe
  const openCreateModal = () => {
    setEditingRecipe(null);
    resetForm();
    setModalIsOpen(true);
  };

  // Open modal for editing existing recipe
  const openEditModal = (recipe) => {
    setEditingRecipe(recipe);
    setTitle(recipe.title || '');
    setIngredients(recipe.ingredients || ['']);
    setInstructions(recipe.instructions || '');
    setPrepTime(recipe.prepTime || '');
    setCookTime(recipe.cookTime || '');
    setServings(recipe.servings || '');
    
    // Reset images (user can upload new ones)
    setHeaderImage(null);
    setProcessImages([]);
    setImagePreview(null);
    setProcessImagePreviews([]);
    
    setModalIsOpen(true);
  };

  // Reset form fields
  const resetForm = () => {
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
  };

  // Submit handler supports both create and update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    const validIngredients = ingredients.filter(ing => ing.trim());
    if (validIngredients.length === 0) {
      alert('At least one ingredient is required.');
      return;
    }

    if (!instructions.trim()) {
      alert('Instructions are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    
    // Add ingredients
    validIngredients.forEach(ing => {
      formData.append('ingredients', ing.trim());
    });
    
    formData.append('instructions', instructions.trim());
    
    // Add optional fields only if they have values
    if (prepTime && prepTime > 0) formData.append('prepTime', parseInt(prepTime));
    if (cookTime && cookTime > 0) formData.append('cookTime', parseInt(cookTime));
    if (servings && servings > 0) formData.append('servings', parseInt(servings));

    // Add header image if selected
    if (headerImage) {
      formData.append('headerImage', headerImage);
    }

    // Add process images if selected
    if (processImages.length > 0) {
      processImages.forEach(image => {
        formData.append('processImages', image);
      });
    }

    try {
      const token = localStorage.getItem('token');

      if (editingRecipe) {
        // Update existing recipe
        const response = await axios.put(
          `${backendURL}/recipes/${editingRecipe._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update recipe in local state
        setRecipes(prev =>
          prev.map(r => (r._id === editingRecipe._id ? response.data : r))
        );
      } else {
        // Create new recipe
        const response = await axios.post(`${backendURL}/recipes`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setRecipes(prev => [response.data, ...prev]);
      }

      setModalIsOpen(false);
      resetForm();
      setEditingRecipe(null);
    } catch (err) {
      console.error('Error saving recipe:', err);
      alert('Failed to save the recipe. Please try again.');
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading recipes...</p>
    </div>
  );

  return (
    <div className="recipe-page">
      <div className="recipe-header">
        <div className="header-content">
          <h1 className="recipe-title">Recipes</h1>
          <p className="recipe-subtitle">Discover culinary inspiration</p>
        </div>
      </div>

      <div className="recipe-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search recipes..."
            className="recipe-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {user?.isAdmin && (
          <button
            className="create-recipe-btn"
            onClick={openCreateModal}
            title="Create new recipe"
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
        {filteredRecipes.length === 0 && (
          <div className="no-recipes">
            <p>No recipes found.</p>
          </div>
        )}

        <div className="recipe-grid">
          {filteredRecipes.map(recipe => (
            <article key={recipe._id} className="recipe-card">
              <div className="recipe-card-inner">
                <div className="recipe-image-container">
                  {recipe.headerImage ? (
                    <img
                      src={`${backendURL}${recipe.headerImage}`}
                      alt={recipe.title}
                      className="recipe-image"
                      onClick={() => {
                        scrollToTop();
                        navigate(`/recipes/${recipe._id}`);
                      }}
                    />
                  ) : (
                    <div 
                      className="recipe-image-placeholder"
                      onClick={() => {
                        scrollToTop();
                        navigate(`/recipes/${recipe._id}`);
                      }}
                    >
                      <span>No Image</span>
                    </div>
                  )}
                  
                  {user && (
                    <button
                      onClick={() => toggleLike(recipe._id)}
                      className={`like-btn ${likedRecipes.has(recipe._id) ? 'liked' : ''}`}
                      title={likedRecipes.has(recipe._id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <FaHeart />
                    </button>
                  )}

                  {user?.isAdmin && (
                    <div className="admin-controls">
                      <button
                        className="admin-btn edit-btn"
                        id="edit-btn"
                        onClick={() => openEditModal(recipe)}
                        title="Edit recipe"
                      >
                        <FaPen  className="icon-pen"/>
                      </button>
                      <button
                        className="admin-btn delete-btn"
                        onClick={() => handleDelete(recipe._id)}
                        title="Delete recipe"
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
                    navigate(`/recipes/${recipe._id}`);
                  }}
                >
                  <h2 className="recipe-card-title">{recipe.title}</h2>
                  <hr/>
                  
                  {(recipe.prepTime || recipe.cookTime || recipe.servings) && (
                    <div className="recipe-meta">
                      {recipe.prepTime && <span className="meta-item">Prep: {recipe.prepTime}min</span>}
                      {recipe.cookTime && <span className="meta-item">Cook: {recipe.cookTime}min</span>}
                      {recipe.servings && <span className="meta-item">Serves: {recipe.servings}</span>}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal for create/edit recipe */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          setEditingRecipe(null);
          resetForm();
        }}
        contentLabel={editingRecipe ? 'Edit Recipe' : 'Create Recipe'}
        className="recipe-modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2 className="modal-title">{editingRecipe ? 'Edit Recipe' : 'Create New Recipe'}</h2>
          <button
            className="modal-close"
            onClick={() => {
              setModalIsOpen(false);
              setEditingRecipe(null);
              resetForm();
            }}
          >
            ×
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
                placeholder="Enter recipe title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ingredients*</label>
              <div className="ingredients-container">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-row">
                    <input
                      type="text"
                      className="form-input ingredient-input"
                      value={ingredient}
                      onChange={e => handleIngredientChange(index, e.target.value)}
                      placeholder={`Ingredient ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="remove-ingredient-btn"
                      disabled={ingredients.length === 1}
                      title="Remove ingredient"
                    >
                      ×
                    </button>
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
            </div>

            <div className="form-group">
              <label className="form-label">Instructions*</label>
              <textarea
                className="form-textarea"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                rows="5"
                required
                placeholder="Enter cooking instructions"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prep Time (minutes)</label>
                <input
                  type="number"
                  className="form-input"
                  value={prepTime}
                  onChange={e => setPrepTime(e.target.value)}
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cook Time (minutes)</label>
                <input
                  type="number"
                  className="form-input"
                  value={cookTime}
                  onChange={e => setCookTime(e.target.value)}
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Servings</label>
                <input
                  type="number"
                  className="form-input"
                  value={servings}
                  onChange={e => setServings(e.target.value)}
                  min="1"
                  placeholder="1"
                />
              </div>
            </div>

            {/* Header Image Section */}
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
                  <div className="image-preview">
                    <img src={imagePreview} alt="Header preview" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={removeHeaderImage}
                      title="Remove header image"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Process Images Section */}
            <div className="form-group">
              <label className="form-label">Process Images</label>
              <p className="form-hint">Upload up to 5 images showing the cooking process</p>
              <input
                type="file"
                className="form-file-input"
                accept="image/*"
                multiple
                onChange={handleProcessImagesChange}
              />
              {processImagePreviews.length > 0 && (
                <div className="images-preview-container">
                  {processImagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview">
                      <img src={preview} alt={`Process ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeProcessImage(index)}
                        title="Remove process image"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setModalIsOpen(false);
                  setEditingRecipe(null);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingRecipe ? 'Update Recipe' : 'Create Recipe'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default RecipePage;