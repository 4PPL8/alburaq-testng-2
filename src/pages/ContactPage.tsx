import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckSquare, Square } from 'lucide-react';
import { toast } from 'react-toastify';
import { useProducts, Product } from '../contexts/ProductContext';

const ContactPage: React.FC = () => {
  const { products } = useProducts(); // Get products from context

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  // State for selected products
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // Stores IDs of selected products

  // State to manage the selected sending method: 'email' or 'whatsapp'
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'whatsapp'>('email'); // Default to email

  // Handle input changes for all form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
    // If subject changes, clear selected products if it's no longer a product-related subject
    if (e.target.id === 'subject') {
      if (!['product-inquiry', 'bulk-order', 'product-order'].includes(e.target.value)) {
        setSelectedProducts([]);
      }
    }
  };

  // Handle product checkbox changes
  const handleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId) // Deselect
        : [...prev, productId] // Select
    );
  };

  // Basic email format validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Determine if the product selection section should be shown
  const showProductSelection = ['product-inquiry', 'bulk-order', 'product-order'].includes(formData.subject);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission (page reload)

    // Basic validation for required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject || !formData.message.trim()) {
      toast.error('Please fill in all required fields (Full Name, Email, Subject, Message).');
      return;
    }
    if (!isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    // Validate if product selection is required but no products are selected
    if (showProductSelection && selectedProducts.length === 0) {
      toast.error('Please select at least one product for your inquiry.');
      return;
    }

    // Prepare selected product names for the message
    const selectedProductNames = products
      .filter(p => selectedProducts.includes(p.id))
      .map(p => p.name)
      .join(', ');

    // Construct the message content to be pre-filled
    const messageContent = `
Hello Al Buraq Industries,

I have an inquiry from your website.

Full Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'N/A'}
Subject: ${formData.subject}

${showProductSelection && selectedProductNames ? `Selected Products: ${selectedProductNames}\n` : ''}

Message:
${formData.message}

Thank you.
    `.trim();

    if (selectedMethod === 'email') {
      // Email (mailto) functionality
      const encodedSubject = encodeURIComponent(`Inquiry from Website: ${formData.subject}`);
      const encodedBody = encodeURIComponent(messageContent);
      const mailtoLink = `mailto:alburaqindus2000@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
      window.open(mailtoLink, '_blank');
      toast.success('Opening your email client with the pre-filled message!');
    } else { // selectedMethod === 'whatsapp'
      // WhatsApp functionality
      // Use the phone number you specified: +923164623026
      const whatsappNumber = '923164623026'; // WhatsApp link requires number without '+'
      const encodedMessage = encodeURIComponent(messageContent);
      // The wa.me link is generally reliable. Sometimes, very long messages or certain characters
      // can cause issues. Ensure message is well-formed.
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappLink, '_blank');
      toast.success('Opening WhatsApp with the pre-filled message!');
    }

    // Optionally, clear the form fields after opening the external client
    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    setSelectedProducts([]); // Clear selected products after submission
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Get in touch with Al Buraq Industries for all your product inquiries and orders
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Get in Touch</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              We're here to help you with all your product needs. Whether you have questions about our products, 
              need assistance with orders, or want to learn more about our cash on delivery service, 
              don't hesitate to reach out.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Email Address</h3>
                  <p className="text-gray-600">alburaqindus2000@gmail.com</p>
                  <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Phone Number</h3>
                  <p className="text-gray-600">+923164623026</p>
                  <p className="text-sm text-gray-500 mt-1">Available during business hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Address</h3>
                  <p className="text-gray-600">
                    Al buraq industries <br />
                    floor no 1 Madina centre<br />
                    near Japan centre<br />
                    shahalam market lahore
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Saturday: 9:00 AM - 6:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                {/* WhatsApp Link (for direct call/chat) */}
                <a
                  href="tel:+923164623026"
                  className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
                  title="WhatsApp Call"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                {/* Facebook Link - UPDATED URL */}
                <a
                  href="https://www.facebook.com/profile.php?id=61559106203161" // Updated Facebook URL
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  title="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* Instagram Link */}
                <a
                  href="https://www.instagram.com/alburaqindustries/"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors duration-200"
                  title="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.75 0 8.337 0.012 7.026 0.07A6.012 6.012 0 002.07 2.07C0.012 3.38 0 8.75 0 12c0 3.25 0.012 3.663 0.07 4.974a6.012 6.012 0 002.07 2.07c1.311 0.058 1.724 0.07 4.974 0.07h10.3c3.25 0 3.663-0.012 4.974-0.07a6.012 6.012 0 002.07-2.07c0.058-1.311 0.07-1.724 0.07-4.974s-0.012-3.663-0.07-4.974a6.012 6.012 0 00-2.07-2.07C20.612 0.012 20.199 0 17.026 0H12zm0 2.45c3.21 0 3.564 0.01 4.793 0.063a3.522 3.522 0 012.448 0.957 3.522 3.522 0 010.957 2.448c0.053 1.229 0.063 1.583 0.063 4.793s-0.01 3.564-0.063 4.793a3.522 3.522 0 01-0.957 2.448 3.522 3.522 0 01-2.448 0.957c-1.229 0.053-1.583 0.063-4.793 0.063s-3.564-0.01-4.793-0.063a3.522 3.522 0 01-2.448-0.957 3.522 3.522 0 01-0.957-2.448c-0.053-1.229-0.063-1.583-0.063-4.793s0.01-3.564 0.063-4.793a3.522 3.522 0 010.957-2.448 3.522 3.522 0 012.448-0.957c1.229-0.053 1.583-0.063 4.793-0.063zM12 7.25a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zm0 2.45a2.3 2.3 0 110 4.6 2.3 2.3 0 010-4.6zm6.5-4.05a0.95 0.95 0 100 1.9 0.95 0 000-1.9z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="product-order">Product Order</option> {/* MOVED: Product Order option to top */}
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="bulk-order">Bulk Order</option>
                  <option value="order-information">Order Information</option>
                  <option value="general-question">General Question</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Conditional Product Selection Section */}
              {showProductSelection && (
                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                  <h4 className="text-lg font-semibold text-gray-800">Select Products for Order:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                    {products.map(product => (
                      <label key={product.id} className="flex items-center space-x-2 text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors duration-150">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleProductSelection(product.id)}
                          className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500" // ADDED: h-5 w-5 for consistent size
                        />
                        <span>{product.name} ({product.category})</span>
                      </label>
                    ))}
                    {products.length === 0 && (
                      <p className="text-gray-500 col-span-full text-center">No products available for selection.</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Please provide details about your inquiry..."
                  required
                ></textarea>
              </div>

              {/* New Contact Method Selection */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('email')}
                  className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedMethod === 'email'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Mail className="w-5 h-5 mr-2" /> Send via Email
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('whatsapp')}
                  className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedMethod === 'whatsapp'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <MessageCircle className="w-5 h-5 mr-2" /> Send via WhatsApp
                </button>
              </div>

              {/* Main Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                <Send className="w-5 h-5 mr-2 inline-block" /> {selectedMethod === 'email' ? 'Open Email Client' : 'Open WhatsApp Chat'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;