import React from 'react';

type IconProps = {
  className?: string;
};

export const MaleIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="#f9f9f9"></rect>
  </svg>
);

export const FemaleIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" fill="#f9f9f9"></circle>
  </svg>
);

export const IndexMaleIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="#f9f9f9"></rect>
    <rect x="6" y="6" width="12" height="12" rx="1" ry="1"></rect>
  </svg>
);

export const IndexFemaleIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" fill="#f9f9f9"></circle>
    <circle cx="12" cy="12" r="5"></circle>
  </svg>
);