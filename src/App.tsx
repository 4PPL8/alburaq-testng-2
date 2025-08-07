import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Breadcrumb from './components/Breadcrumb';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify'; // <--- Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // <--- Import toastify CSS

// Lazy load page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center bg-white p-8 rounded-xl shadow-md border border-gray-200 max-w-md w-full animate-fadeIn">
      <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-t-2 border-primary-500 mx-auto mb-6"></div>
      <h2 className="text-xl font-medium text-gray-800 mb-3">Loading...</h2>
      <p className="text-gray-600">Please wait while we load the page</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  
  // Pages where footer should not be displayed
  const noFooterPages = ['/login', '/register', '/admin-login', '/admin/login'];
  const shouldShowFooter = !noFooterPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Breadcrumb />
      <main className="min-h-screen">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:category" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
      {shouldShowFooter && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Router>
          <AppContent />
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;