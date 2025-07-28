import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  // Handle input changes for all form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission (page reload)

    // Basic validation using browser's alert
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject || !formData.message.trim()) {
      alert('Please fill in all required fields (Name, Email, Subject, Message).');
      return;
    }

    // Basic email format validation
    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    if (!isValidEmail(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Construct the email body with user's input
    const emailBody = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'N/A'}

Message:
${formData.message}
    `.trim(); // .trim() removes leading/trailing whitespace

    // Encode subject and body for URL safety (important for mailto links)
    const encodedSubject = encodeURIComponent(`Inquiry from Website: ${formData.subject}`);
    const encodedBody = encodeURIComponent(emailBody);

    // Construct the mailto link with the company email as recipient
    const mailtoLink = `mailto:alburaqindus2000@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

    // Open the user's default email client in a new tab/window
    window.open(mailtoLink, '_blank');

    // Optionally, clear the form fields after opening the email client
    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
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
                    Al Buraq Industries<br />
                    ShahAlam Market<br />
                    Lahore, Pakistan
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
                {/* WhatsApp Link */}
                <a
                  href="tel:+923164623026"
                  className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
                  title="WhatsApp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                {/* Facebook Link */}
                <a
                  href="https://www.facebook.com/profile.php?id=61559106203161/"
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
                    Full Name
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
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Your phone number (optional)"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
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
                  Subject
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="order-information">Order Information</option>
                  <option value="bulk-order">Bulk Order</option>
                  <option value="general-question">General Question</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
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

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Send Message {/* Changed button text back to "Send Message" */}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;