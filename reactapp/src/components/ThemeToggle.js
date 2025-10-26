import React from 'react';

const ThemeToggle = ({ darkMode, toggleTheme }) => {
  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;