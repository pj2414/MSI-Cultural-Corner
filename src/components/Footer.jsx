import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} The Cultural Corner. All rights reserved.
            </div>

            {/* Developer Credit */}
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Designed and developed with</span>
              <Heart size={14} className="text-red-500 fill-current" />
              <span>by</span>
              <span className="text-white font-semibold hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                Pj
              </span>
            </div>

            {/* Legal Links */}
          
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;