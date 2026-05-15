
import React from 'react';

const Card = ({ children, className = '', padding = 'p-4' }) => (
  <div
    className={`
      bg-slate-800/40 backdrop-blur-sm border border-slate-700/50
      rounded-lg shadow-lg hover:shadow-xl transition-all duration-300
      ${padding} ${className}
    `}
  >
    {children}
  </div>
);

export default Card;