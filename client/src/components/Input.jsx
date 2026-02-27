// import React from 'react';

// const Input = ({ placeholder, value, onChange, className = '', type = 'text', onKeyPress }) => (
//   <input
//     type={type}
//     className={`
//       w-full p-4 border-2 border-white/30 rounded-xl 
//       focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50
//       transition-all bg-white/10 backdrop-blur-sm text-white placeholder-white/50
//       font-semibold ${className}
//     `}
//     placeholder={placeholder}
//     value={value}
//     onChange={onChange}
//     onKeyPress={onKeyPress}
//   />
// );

// export default Input;

import React from 'react';

const Input = ({ placeholder, value, onChange, className = '', type = 'text', onKeyPress }) => (
  <input
    type={type}
    className={`
      w-full px-3 py-2 text-sm bg-white border border-slate-200 
      rounded-lg focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400/30
      transition-all text-slate-800 placeholder-slate-400 
      font-medium ${className}
    `}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyPress={onKeyPress}
  />
);

export default Input;