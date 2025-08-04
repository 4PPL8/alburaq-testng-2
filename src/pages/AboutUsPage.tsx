import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-8 text-white"> {/* Changed background to blue gradient and text to white */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">About Us</h1> {/* Removed text-gray-800 as parent is now white text */}

        {/* Message from CEO Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden md:flex">
          {/* CEO Image Section (Left/Top) */}
          <div className="md:w-1/2 relative">
            {/* Placeholder image for the CEO */}
            <img
              src="/CEO.jpg" // Placeholder for CEO image
              alt="CEO"
              className="w-full h-full object-cover"
            />
            {/* Optional: Overlay for background graphic if desired, similar to the image */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div> */}
          </div>

          {/* Message Content Section (Right/Bottom) */}
          <div className="md:w-1/2 bg-gray-900 text-white p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-yellow-400">
              MESSAGE <span className="font-normal text-white italic">from</span> CEO
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              Wholesale marketing is the process of promoting and selling products to other businesses, such as retailers and distributors. The goal of wholesale marketing is to generate sales and build relationships with wholesale customers.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Wholesale marketing is different from retail marketing in a few key ways.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              <span className="font-semibold">First:</span> wholesale marketing targets businesses, while retail marketing targets consumers.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              <span className="font-semibold">Second:</span> wholesale marketing typically involves selling products in bulk quantities, while retail marketing involves selling products in individual units.
            </p>
            <p className="text-lg leading-relaxed mb-8">
              <span className="font-semibold">Third:</span> wholesale marketing often involves offering discounts and other incentives to wholesale customers.
            </p>
            <p className="text-2xl font-serif italic text-right text-yellow-300 mt-auto">
              Nadeem Anjum
            </p>
          </div>
        </div>

        {/* Our Vision & Mission Section */}
        {/* Changed background to white, and text to gray-800 for contrast */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mt-12 text-gray-800">
          <h3 className="text-3xl font-bold text-center mb-6">Our Vision & Mission</h3>
          <p className="text-lg leading-relaxed mb-4">
            At Al Buraq Industries, our vision is to be a leading provider of quality consumer goods, recognized for our commitment to excellence, innovation, and customer satisfaction. We aim to enrich lives by offering a diverse range of reliable and valuable products that meet the evolving needs of our communities.
          </p>
          <p className="text-lg leading-relaxed">
            Our mission is to consistently deliver superior products through meticulous sourcing, stringent quality control, and efficient distribution. We strive to foster strong relationships with our partners and customers, built on trust and mutual growth. We are dedicated to continuous improvement, ethical practices, and contributing positively to the economic landscape.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;