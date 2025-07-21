
import React from 'react';

type IconProps = {
  className?: string;
};

export const BoundaryIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="2"
      ry="2"
      strokeDasharray="4 2"
      fill="none"
    />
  </svg>
);
