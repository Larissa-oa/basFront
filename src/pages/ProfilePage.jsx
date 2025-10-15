import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdDelete, MdEdit, MdRestaurant, MdLogout } from "react-icons/md";
import { scrollToTop } from "../utils/scrollToTop";
import API_BASE_URL from "../config/api.js";
import "./PageStyles/ProfilePage.css";

const ProfilePage = () => {
  const { user, loading, logout, setUser } = useContext(AuthContext);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");

  const navigate = useNavigate();

  // Initial setup - only runs once when user is available
  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
  }, [user]);

  // Fetch favorites - only runs when user ID changes
  useEffect(() => {
    if (!user?._id) return;

    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const recipesRes = await axios.get(`${API_BASE_URL}/auth/favorites/recipes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFavoriteRecipes(Array.isArray(recipesRes.data) ? recipesRes.data : []);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Failed to load favorites.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchFavorites();
  }, [user?._id]);

  const handleDeleteFavorite = async (id) => {
    if (!window.confirm("Remove this from favorites?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/auth/favorites/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavoriteRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting favorite:", err);
      alert("Failed to remove favorite.");
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setName(user.name || "");
    }
    setIsEditing((prev) => !prev);
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_BASE_URL}/auth/${user._id}`,
        { name: name.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update user context with new data
      setUser({
        ...user,
        name: res.data.name
      });
      
      setIsEditing(false);
      alert("Profile updated successfully!");
      
    } catch (err) {
      console.error("Profile update error:", err);
      
      if (err.response?.status === 403) {
        alert("You don't have permission to update this profile.");
      } else if (err.response?.status === 400) {
        alert(err.response.data.message || "Invalid data provided.");
      } else {
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFavoriteClick = (id) => {
    scrollToTop();
    navigate(`/recipes/${id}`);
  };

  if (loading || loadingData) return <p className="nx-loading-state">Loading...</p>;
  if (!user) return <p className="nx-no-user-state">You must be logged in to view your profile.</p>;

  return (
    <main className="profile-page">
      {/* Header Section */}
      <section className="profile-header">
        <div className="profile-header-content">
          <div className="profile-header-top">
            {isEditing ? (
              <div className="profile-edit-actions">
                <button onClick={handleSaveProfile} className="profile-btn profile-btn-save">
                  Save Changes
                </button>
                <button onClick={handleEditToggle} className="profile-btn profile-btn-cancel">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="profile-actions">
                <button onClick={handleEditToggle} className="profile-icon-btn" aria-label="Edit Profile">
                  <MdEdit />
                </button>
                <button onClick={handleLogout} className="profile-icon-btn profile-logout-btn" aria-label="Logout">
                  <MdLogout />
                </button>
              </div>
            )}
          </div>

          <div className="profile-user-info">
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="profile-name-input"
                autoFocus
                maxLength={50}
                placeholder="Your name"
              />
            ) : (
              <>
                <h1 className="profile-greeting">Hello,</h1>
                <h2 className="profile-name">{user.name}</h2>
              </>
            )}
            <p className="profile-email">{user.email}</p>
          </div>
        </div>
      </section>

      {/* Favorites Section */}
      <section className="profile-favorites-section">
        <div className="profile-container">
          <div className="profile-section-header">
            <div className="profile-section-title-wrapper">
              <MdRestaurant className="profile-section-icon" />
              <h3 className="profile-section-title">Saved Recipes</h3>
            </div>
            <span className="profile-count-badge">{favoriteRecipes.length}</span>
          </div>
          
          {favoriteRecipes.length > 0 ? (
            <div className="profile-recipes-grid">
              {favoriteRecipes.map((recipe) => (
                <article key={recipe._id} className="profile-recipe-card">
                  <div 
                    className="profile-recipe-image-wrapper"
                    onClick={() => handleFavoriteClick(recipe._id)}
                  >
                    {recipe.headerImage ? (
                      <img
                        src={recipe.headerImage.startsWith('http') ? recipe.headerImage : `${API_BASE_URL}${recipe.headerImage}`}
                        alt={recipe.title}
                        className="profile-recipe-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="profile-recipe-placeholder">
                      <MdRestaurant />
                    </div>
                  </div>
                  
                  <div className="profile-recipe-content">
                    <h4 className="profile-recipe-title">{recipe.title}</h4>
                    {(recipe.prepTime || recipe.cookTime) && (
                      <div className="profile-recipe-meta">
                        {recipe.prepTime && <span>{recipe.prepTime} min prep</span>}
                        {recipe.prepTime && recipe.cookTime && <span className="meta-dot">·</span>}
                        {recipe.cookTime && <span>{recipe.cookTime} min cook</span>}
                      </div>
                    )}
                  </div>
                  
                  <button
                    className="profile-remove-btn"
                    onClick={() => handleDeleteFavorite(recipe._id)}
                    aria-label={`Remove ${recipe.title} from favorites`}
                  >
                    <MdDelete />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="profile-empty-state">
              <div className="empty-icon-wrapper">
                <MdRestaurant className="empty-icon" />
              </div>
              <p className="empty-message">No saved recipes yet</p>
              <p className="empty-submessage">Start building your collection</p>
              <button 
                className="profile-btn profile-btn-primary"
                onClick={() => {
                  scrollToTop();
                  navigate('/recipes');
                }}
              >
                Explore Recipes
              </button>
            </div>
          )}
        </div>
      </section>

      {error && <div className="profile-error">{error}</div>}
    </main>
  );
};

export default ProfilePage;