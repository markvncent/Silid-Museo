import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToHash from './components/layout/ScrollToHash';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminGate from './components/admin/AdminGate';

function App() {
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