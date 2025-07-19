import React from 'react';

type IconProps = {
  className?: string;
};

export const RedoIcon: React.FC<IconProps> = ({ className }) => (
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
    <path d="m15 14 5-5-5-5" />
    <path d="M19 9H8.5a5.5 5.5 0 0 0-5.5 5.5v0a5.5 5.5 0 0 0 5.5 5.5H9" />
  </svg>
);