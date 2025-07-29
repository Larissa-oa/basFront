import {Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import useScrollToTop from './hooks/useScrollToTop';

import Homepage from './pages/Homepage';
import AboutPage from './pages/AboutPage';
import FlorePage from './pages/FlorePage';
import RecipesPage from './pages/RecipesPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import JournalPage from './pages/JournalPage';
import JournalDetailPage from './pages/JournalDetailPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  useScrollToTop();
  const location = useLocation();
  
  // Pages that should have background images extending behind navbar
  const pagesWithBackground = ['/', '/flore'];
  const isBackgroundPage = pagesWithBackground.includes(location.pathname);

  return (
    <div className={`app-layout ${isBackgroundPage ? 'background-page' : ''}`}>
      <Navbar />
      
      <main className={`main-content-wrapper ${isBackgroundPage ? 'background-page' : ''}`}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/flore" element={<FlorePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/journals" element={<JournalPage />} />
          <Route path="/journals/:id" element={<JournalDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Add more routes as needed */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
