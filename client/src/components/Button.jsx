import React from 'react';

const Button = ({
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon = null
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white',
    secondary: 'bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-800 hover:to-slate-700 text-white',
    outline: 'border border-violet-500/50 text-violet-300 hover:bg-violet-500/10'
  };

  const sizes = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2.5 px-6 text-base'
  };

  return (
    <button
      className={`
        ${variants[variant]} ${sizes[size]} ${className}
        font-semibold rounded-lg
        transition-all duration-200 transform hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        shadow-lg hover:shadow-xl border-0 focus:outline-none focus:ring-2 focus:ring-violet-500/50
        ${fullWidth ? 'w-full' : ''}
        flex items-center justify-center gap-2
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;