
import React from 'react';

type IconProps = {
  className?: string;
};

export const UndoIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 7v6h-6"></path>
    <path d="M3 17a9 9 0 0 0 9 3 9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-7.2 3.7"></path>
  </svg>
);