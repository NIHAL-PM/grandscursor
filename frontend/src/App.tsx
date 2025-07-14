import { Routes, Route, Link } from 'react-router-dom';
import ContactButtons from './components/ContactButtons';
import CatalogDownload from './components/CatalogDownload';
import ContactSettingsForm from './admin/ContactSettingsForm';
import CatalogManager from './admin/CatalogManager';

export default function App() {
  return (
    <div style={{ padding: '1rem' }}>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/">Home</Link> | <Link to="/admin">Admin</Link>
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
        <Route
          path="/admin"
          element={
            <div>
              <h1>Admin Panel</h1>
              <ContactSettingsForm />
              <hr />
              <CatalogManager />
            </div>
          }
        />
      </Routes>
    </div>
  );
}