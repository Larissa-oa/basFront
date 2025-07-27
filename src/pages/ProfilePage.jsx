import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdDelete, MdEdit, MdFavorite, MdRestaurant, MdBook } from "react-icons/md";
import { scrollToTop } from "../utils/scrollToTop";
import "./PageStyles/ProfilePage.css";

const API_BASE = "http://localhost:5005";

const ProfilePage = () => {
  const { user, loading, logout, setUser } = useContext(AuthContext);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [favoriteJournals, setFavoriteJournals] = useState([]);
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
        const [recipesRes, journalsRes] = await Promise.all([
          axios.get(`${API_BASE}/auth/favorites/recipes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE}/auth/favorites/journals`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setFavoriteRecipes(Array.isArray(recipesRes.data) ? recipesRes.data : []);
        setFavoriteJournals(Array.isArray(journalsRes.data) ? journalsRes.data : []);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Failed to load favorites.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchFavorites();
  }, [user?._id]);

  const handleDeleteFavorite = async (type, id) => {
    if (!window.confirm("Remove this from favorites?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/auth/favorites/${type}s/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (type === "recipe") {
        setFavoriteRecipes((prev) => prev.filter((r) => r._id !== id));
      } else {
        setFavoriteJournals((prev) => prev.filter((j) => j._id !== id));
      }
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
        `${API_BASE}/auth/${user._id}`,
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

  const handleFavoriteClick = (type, id) => {
    scrollToTop();
    navigate(`/${type}s/${id}`);
  };

  if (loading || loadingData) return <p className="nx-loading-state">Loading...</p>;
  if (!user) return <p className="nx-no-user-state">You must be logged in to view your profile.</p>;

  return (
    <main className="nx-profile-container">
      <section className="nx-hero-section">
        <div className="nx-user-details">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="nx-name-editor"
              autoFocus
              maxLength={50}
            />
          ) : (
            <h1 className="nx-user-title">Hello, {user.name}</h1>
          )}
          <p className="nx-user-email">{user.email}</p>

          <div className="nx-action-controls">
            {isEditing ? (
              <>
                <button onClick={handleSaveProfile} className="nx-save-button">Save</button>
                <button onClick={handleEditToggle} className="nx-cancel-button">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={handleEditToggle} className="nx-edit-button" aria-label="Edit Profile">
                  <MdEdit />
                </button>
                <button onClick={logout} className="nx-logout-button">Log Out</button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="nx-collections-section">
        <div className="nx-collection-card">
          <div className="nx-collection-header">
            <MdRestaurant className="nx-collection-icon" />
            <h2>Favorite Recipes</h2>
            <span className="nx-collection-count">{favoriteRecipes.length}</span>
          </div>
          
          {favoriteRecipes.length > 0 ? (
            <div className="nx-favorites-grid">
              {favoriteRecipes.map((recipe) => (
                <div key={recipe._id} className="nx-favorite-item">
                  <div 
                    className="nx-favorite-image-container"
                    onClick={() => handleFavoriteClick("recipe", recipe._id)}
                  >
                    {recipe.headerImage ? (
                      <img
                        src={`${API_BASE}${recipe.headerImage}`}
                        alt={recipe.title}
                        className="nx-favorite-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="nx-favorite-placeholder">
                      <MdRestaurant />
                    </div>
                    <div className="nx-favorite-overlay">
                      <span>View Recipe</span>
                    </div>
                  </div>
                  
                  <div className="nx-favorite-content">
                    <h3 className="nx-favorite-title">{recipe.title}</h3>
                    {(recipe.prepTime || recipe.cookTime) && (
                      <div className="nx-favorite-meta">
                        {recipe.prepTime && <span>Prep: {recipe.prepTime}min</span>}
                        {recipe.cookTime && <span>Cook: {recipe.cookTime}min</span>}
                      </div>
                    )}
                  </div>
                  
                  <button
                    className="nx-remove-favorite"
                    onClick={() => handleDeleteFavorite("recipe", recipe._id)}
                    aria-label={`Remove ${recipe.title} from favorites`}
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="nx-empty-state">
              <MdRestaurant className="nx-empty-icon" />
              <p>No favorite recipes yet.</p>
              <button 
                className="nx-explore-button"
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

        <div className="nx-collection-card">
          <div className="nx-collection-header">
            <MdBook className="nx-collection-icon" />
            <h2>Favorite Journals</h2>
            <span className="nx-collection-count">{favoriteJournals.length}</span>
          </div>
          
          {favoriteJournals.length > 0 ? (
            <div className="nx-favorites-grid">
              {favoriteJournals.map((journal) => (
                <div key={journal._id} className="nx-favorite-item">
                  <div 
                    className="nx-favorite-image-container"
                    onClick={() => handleFavoriteClick("journal", journal._id)}
                  >
                    {journal.mainImage ? (
                      <img
                        src={`${API_BASE}${journal.mainImage}`}
                        alt={journal.title}
                        className="nx-favorite-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="nx-favorite-placeholder">
                      <MdBook />
                    </div>
                    <div className="nx-favorite-overlay">
                      <span>View Journal</span>
                    </div>
                  </div>
                  
                  <div className="nx-favorite-content">
                    <h3 className="nx-favorite-title">{journal.title}</h3>
                    {journal.createdAt && (
                      <div className="nx-favorite-meta">
                        <span>Created: {new Date(journal.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    className="nx-remove-favorite"
                    onClick={() => handleDeleteFavorite("journal", journal._id)}
                    aria-label={`Remove ${journal.title} from favorites`}
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="nx-empty-state">
              <MdBook className="nx-empty-icon" />
              <p>No favorite journals yet.</p>
              <button 
                className="nx-explore-button"
                onClick={() => {
                  scrollToTop();
                  navigate('/journals');
                }}
              >
                Explore Journals
              </button>
            </div>
          )}
        </div>
      </section>

      {error && <p className="nx-error-message">{error}</p>}
    </main>
  );
};

export default ProfilePage;