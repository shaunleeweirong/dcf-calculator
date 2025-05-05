import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import Button from './Button';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'DCF Calculator' }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <Button
          onClick={toggleDarkMode}
          variant="outline"
          size="small"
          className="p-2 rounded-full"
          ariaLabel={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          icon={
            isDarkMode ? (
              <SunIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )
          }
        >
          <span className="sr-only">Toggle Theme</span>
        </Button>
      </div>
    </header>
  );
};

export default Header; 