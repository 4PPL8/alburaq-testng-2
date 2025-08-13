import React, { useState, useCallback } from 'react';
import { Plus, Edit3, Trash2, Eye, Upload, X, Check, AlertTriangle, Loader2, Github, RefreshCw } from 'lucide-react';
import { useProducts, Product } from '../contexts/ProductContext'; // Import Product interface
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify'; // Import toast (ToastContainer is in App.tsx)

// Custom Confirmation Modal component for Delete
const ConfirmDeleteModal: React.FC<{ productId: string, onConfirm: () => void, onCancel: () => void }> = ({ productId, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
      <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
      <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);


const AdminDashboard: React.FC = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    isLoading: productsLoading,
    syncStatus 
  } = useProducts();
  const { adminInfo } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'manage'>('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: '', // Main image URL (string for base64 or URL)
    features: [''],
    images: [''] // Array of additional image URLs
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      image: '',
      features: [''],
      images: ['']
    });
  };

  const handleOpenModal = (mode: 'add' | 'edit', product?: Product) => {
    setModalMode(mode);
    if (mode === 'edit' && product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description,
        image: product.image,
        features: product.features.length > 0 ? product.features : [''],
        images: product.images && product.images.length > 0 ? product.images : ['']
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handles main product image file upload and converts to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB.');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Only JPG and PNG formats are supported.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target?.result as string // Store Base64 string
        }));
      };
      reader.readAsDataURL(file); // Read file as Base64
    }
  };

  // Handles additional image file upload and converts to Base64
  const handleAdditionalImageUpload = useCallback((index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB.');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Only JPG and PNG formats are supported.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: prev.images.map((img, i) => i === index ? e.target?.result as string : img)
        }));
      };
      reader.readAsDataURL(file); // Read file as Base64
    }
  }, []);

  // Handles form submission for adding or updating a product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.name.trim() || !formData.category || !formData.description.trim() || !formData.image) {
      toast.error('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    const filteredFeatures = formData.features.filter(feature => feature.trim() !== '');
    const filteredImages = formData.images.filter(img => img.trim() !== '');
    
    const productData: Omit<Product, 'id'> = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      image: formData.image, // This now holds Base64 or direct path
      features: filteredFeatures,
      images: filteredImages
    };

    try {
      if (modalMode === 'add') {
        await addProduct(productData);
        toast.success('Product added successfully and synced to GitHub!');
      } else if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
        toast.success('Product updated successfully and synced to GitHub!');
      }
      handleCloseModal();
    } catch (error) {
      toast.error(`Failed to ${modalMode === 'add' ? 'add' : 'update'} product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
       setIsSubmitting(false);
     }
    }
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Dashboard...</h2>
          <p className="text-gray-600">Please wait while we load your data</p>
        </div>
      </div>
    );
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm) {
      setIsSubmitting(true);
      try {
        await deleteProduct(deleteConfirm);
        toast.success('Product deleted successfully and synced to GitHub!');
      } catch (error) {
        toast.error(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsSubmitting(false);
        setDeleteConfirm(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  const categoryStats = categories.map(category => ({
    name: category,
    count: products.filter(p => p.category === category).length
  }));
  const mostPopularCategory = categoryStats.length > 0
    ? categoryStats.reduce((max, cat) => cat.count > max.count ? cat : max).name
    : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* ToastContainer is now in App.tsx */}
      {deleteConfirm && (
        <ConfirmDeleteModal
          productId={deleteConfirm}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {adminInfo?.name || 'Admin'}!</p>
            </div>
            
            {/* GitHub Sync Status */}
            {syncStatus.isGitHubEnabled && (
              <div className="bg-white rounded-lg shadow-sm p-3 flex items-center space-x-3">
                <Github className="h-5 w-5 text-gray-700" />
                <div>
                  <p className="text-sm font-medium text-gray-800">GitHub Sync</p>
                  <div className="flex items-center">
                    {syncStatus.syncing ? (
                      <>
                        <RefreshCw className="h-3 w-3 text-blue-600 animate-spin mr-1" />
                        <span className="text-xs text-blue-600">Syncing...</span>
                      </>
                    ) : syncStatus.error ? (
                      <span className="text-xs text-red-600">{syncStatus.error}</span>
                    ) : syncStatus.lastSynced ? (
                      <span className="text-xs text-green-600">
                        Last synced: {syncStatus.lastSynced.toLocaleTimeString()}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Ready to sync</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Eye className="inline-block w-4 h-4 mr-2" />
              Product Overview
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === 'manage'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Edit3 className="inline-block w-4 h-4 mr-2" />
              Manage Products
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          // Overview Tab
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Products</h3>
                <p className="text-3xl font-bold text-blue-600">{products.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Categories</h3>
                <p className="text-3xl font-bold text-yellow-600">{categories.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Most Popular Category</h3>
                <p className="text-lg font-bold text-green-600">
                  {mostPopularCategory}
                </p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Category Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryStats.map((stat) => (
                  <div key={stat.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 truncate mr-2">{stat.name}</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {stat.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">All Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/128x128/E0E0E0/000000?text=Error';
                      }}
                    />
                    <h4 className="font-semibold text-gray-800 mb-1">{product.name}</h4>
                    <p className="text-xs text-blue-600 mb-2 bg-blue-50 px-2 py-1 rounded">{product.category}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Manage Tab
          <div className="space-y-6">
            {/* Add Product Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
              <button
                onClick={() => handleOpenModal('add')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg mr-4"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/E0E0E0/000000?text=X';
                              }}
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {product.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenModal('edit', product)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-full transition-colors duration-200"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className={`p-2 rounded-full transition-colors duration-200 ${
                                deleteConfirm === product.id
                                  ? 'text-red-700 bg-red-100 hover:bg-red-200'
                                  : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                              }`}
                              title={deleteConfirm === product.id ? 'Click again to confirm' : 'Delete Product'}
                            >
                              {deleteConfirm === product.id ? (
                                <AlertTriangle className="w-4 h-4" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Add/Edit Product */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Product Image *
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="url"
                          name="image"
                          value={formData.image.startsWith('data:') ? '' : formData.image}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter image URL or upload a file"
                        />
                        <div className="flex-shrink-0">
                          <label className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors duration-200 flex items-center">
                            <Upload className="w-4 h-4 mr-1" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      {formData.image && (
                        <div className="relative">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/128x128/E0E0E0/000000?text=Preview+Error';
                            }}
                          />
                          {formData.image.startsWith('data:') && (
                            <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                              New Upload
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Supported formats: JPG, PNG. Max size: 2MB
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Product Images
                    </label>
                    <div className="space-y-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="url"
                              value={image}
                              onChange={(e) => handleImageChange(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter image URL"
                            />
                            <div className="flex-shrink-0">
                              <label className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors duration-200">
                                <Upload className="w-4 h-4" />
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png"
                                  onChange={handleAdditionalImageUpload(index)}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            {formData.images.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          {image && (
                            <div className="relative">
                              <img
                                src={image}
                                alt={`Additional image ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-lg border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://placehold.co/96x96/E0E0E0/000000?text=Preview+Error';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addImage}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        + Add Another Image
                      </button>
                      <p className="text-xs text-gray-500">
                        Supported formats: JPG, PNG. Max size: 2MB
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Features
                    </label>
                    <div className="space-y-2">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter a product feature"
                          />
                          {formData.features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFeature}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        + Add Another Feature
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          {modalMode === 'add' ? 'Adding...' : 'Updating...'}
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          {modalMode === 'add' ? 'Add Product' : 'Update Product'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;