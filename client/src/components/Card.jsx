// import React from 'react';

// const Card = ({ children, className = '', padding = 'p-8 lg:p-12' }) => (
//   <div
//     className={`
//       bg-white/10 backdrop-blur-3xl border border-white/20
//       rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300
//       ${padding} ${className}
//     `}
//   >
//     {children}
//   </div>
// );

// export default Card;

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