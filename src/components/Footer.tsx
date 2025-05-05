import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-sm mt-auto py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-0">
            &copy; {currentYear} DCF Calculator. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-4">
            <a 
              href="https://github.com/leeshaun/dcf-calculator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="View project on GitHub"
            >
              GitHub
            </a>
            <a 
              href="#" // Replace with actual link if About page exists
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="About this project"
            >
              About
            </a>
            <a 
              href="#" // Replace with actual link if Disclaimer page exists
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="Disclaimer information"
            >
              Disclaimer
            </a>
          </div>
        </div>
        <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-500">
          Data powered by Financial Modeling Prep API. Not financial advice.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 