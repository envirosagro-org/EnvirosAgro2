import React from 'react';

export const SycamoreLogo = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4,44 C4,44 4,32.74 13.6,27.2C23.2,21.66 26,17.2 26,10C26,2.8 20.4,4 20.4,4M44,44C44,44 44,32.74 34.4,27.2C24.8,21.66 22,17.2 22,10C22,2.8 27.6,4 27.6,4M34.4,27.2C34.4,27.2 41.6,23.36 41.6,18.4C41.6,13.44 38,13.6 38,13.6M13.6,27.2C13.6,27.2 6.4,23.36 6.4,18.4C6.4,13.44 10,13.6 10,13.6"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SycamoreLogo;