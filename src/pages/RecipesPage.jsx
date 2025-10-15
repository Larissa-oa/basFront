import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaPen, FaPlus, FaHeart, FaSearch, FaTimes } from 'react-icons/fa';
import { scrollToTop } from '../utils/scrollToTop';
import CreateRecipeModal from '../components/CreateRecipeModal';
import API_BASE_URL from '../config/api.js';
import './PageStyles/RecipesPage.css';

const RecipePage = () => {
  const { user, loading } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [likedRecipes, setLikedRecipes] = useState(new Set());
  const [editingRecipe, setEditingRecipe] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/recipes`)
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
      await axios.delete(`${API_BASE_URL}/recipes/${id}`, {
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
      const res = await axios.patch(`${API_BASE_URL}/auth/favorites/recipes/${recipeId}`, {}, {
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

  // Sort recipes based on selected option
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    
    switch (sortBy) {
      case 'newest':
        return dateB - dateA; // Newest first
      case 'oldest':
        return dateA - dateB; // Oldest first
      default:
        return dateB - dateA; // Default to newest
    }
  });

  // Modal handlers
  const openCreateModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleRecipeCreated = (newRecipe) => {
    setRecipes(prev => [newRecipe, ...prev]);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading recipes...</p>
    </div>
  );

  return (
    <div className="recipe-page">
      <div className="main-content-wrapper">
      <div className="recipe-header">
        <div className="header-content">
          <h1 className="recipe-title">Journals</h1>
          <p className="recipe-subtitle">Here you will find our thoughts, experiments and stories behind Flore. Explorre all.</p>
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
        
        <div className="sort-container">
          <label htmlFor="sort-select" className="sort-label">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {user?.isAdmin && (
          <button
            className="create-recipe-btn"
            onClick={openCreateModal}
            title="Create new recipe"
            aria-label="Create new recipe"
          >
            <FaPlus />
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {sortedRecipes.length === 0 ? (
          <div className="no-recipes">
            <p>No recipes found.</p>
          </div>
      ) : (
        <div className="recipe-grid">
          {sortedRecipes.map(recipe => (
            <article key={recipe._id} className="recipe-card">
              <div className="recipe-card-inner">
                <div className="recipe-image-container">
                  {recipe.headerImage ? (
                    <img
                      src={recipe.headerImage.startsWith('http') ? recipe.headerImage : `${API_BASE_URL}${recipe.headerImage}`}
                      alt={recipe.title}
                      className="recipe-image"
                      onClick={() => {
                        scrollToTop();
                        navigate(`/recipes/${recipe._id}`);
                      }}
                    />
                  ) : (
                    <div className="recipe-image-placeholder">
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="recipe-content">
                  <h3 className="recipe-card-title">{recipe.title}</h3>

                  <div className="recipe-meta">
                    {recipe.prepTime && <span>Prep: {recipe.prepTime}min</span>}
                    {recipe.cookTime && <span>Cook: {recipe.cookTime}min</span>}
                    {recipe.servings && <span>Serves: {recipe.servings}</span>}
                  </div>
                  
                  <div className="recipe-actions">
                    <button
                      className={`like-btn ${likedRecipes.has(recipe._id) ? 'liked' : ''}`}
                      onClick={() => toggleLike(recipe._id)}
                      title={likedRecipes.has(recipe._id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <FaHeart />
                    </button>

                  {user?.isAdmin && (
                    <div className="admin-controls">
                      <button
                          className="admin-btn edit"
                          onClick={() => {
                            scrollToTop();
                            navigate(`/recipes/${recipe._id}`);
                          }}
                        title="Edit recipe"
                      >
                          <FaPen />
                      </button>
                      <button
                          className="admin-btn delete"
                        onClick={() => handleDelete(recipe._id)}
                        title="Delete recipe"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

        <CreateRecipeModal
          isOpen={modalIsOpen}
          onClose={closeModal}
          onRecipeCreated={handleRecipeCreated}
        />
      </div>
    </div>
  );
};

export default RecipePage;