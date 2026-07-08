import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import ScrollToHash from './components/layout/ScrollToHash.jsx';
import HomePage from './pages/HomePage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminGate from './components/admin/AdminGate.jsx';

function App() {
  useEffect(() => {
    // Clear session on page load/refresh (redirecting admin back to request page)
    sessionStorage.removeItem('isAdmin');
  }, []);

  return (
    <Routes>
      {/* Admin dashboard — rendered WITHOUT the main site Layout (no navbar/footer) */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminGate>
            <AdminDashboardPage />
          </AdminGate>
        }
      />

      {/* All public pages — wrapped in the main site Layout */}
      <Route
        path="*"
        element={
          <Layout>
            <ScrollToHash />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;