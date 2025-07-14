import { Routes, Route, Link } from 'react-router-dom';
import ContactButtons from './components/ContactButtons';
import CatalogDownload from './components/CatalogDownload';
import ContactSettingsForm from './admin/ContactSettingsForm';
import CatalogManager from './admin/CatalogManager';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { logout, token } = useAuth();
  return (
    <div style={{ padding: '1rem' }}>
      <nav className="mb-4 flex gap-4">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <Link to="/admin" className="text-blue-600 hover:underline">Admin</Link>
        {token && (
          <button onClick={logout} className="text-red-600 hover:underline ml-auto">Logout</button>
        )}
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Grand Foods</h1>
              <ContactButtons />
              <div style={{ margin: '1rem 0' }}>
                <CatalogDownload />
              </div>
            </div>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <div>
                <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
                <ContactSettingsForm />
                <hr className="my-6" />
                <CatalogManager />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}