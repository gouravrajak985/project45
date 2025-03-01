import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About GumClone</h3>
            <p className="text-gray-300 mb-4">
              GumClone is a platform for creators to sell digital and physical products directly to their audience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/category/E-books" className="text-gray-300 hover:text-white">E-books</Link>
              </li>
              <li>
                <Link to="/category/Courses" className="text-gray-300 hover:text-white">Courses</Link>
              </li>
              <li>
                <Link to="/category/Software" className="text-gray-300 hover:text-white">Software</Link>
              </li>
              <li>
                <Link to="/category/Templates" className="text-gray-300 hover:text-white">Templates</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Seller Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">Become a Seller</Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Seller Guidelines</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Success Stories</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">Tips & Tricks</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300 mb-2">Email: support@gumclone.com</p>
            <p className="text-gray-300 mb-2">Phone: (123) 456-7890</p>
            <p className="text-gray-300">Address: 123 Market St, San Francisco, CA 94103</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} GumClone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;