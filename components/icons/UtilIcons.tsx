
import React from 'react';

type IconProps = {
  className?: string;
};

export const MousePointerIcon: React.FC<IconProps> = ({ className }) => (
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
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
    <path d="M13 13l6 6"></path>
  </svg>
);

export const DeceasedIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18"></path>
    <path d="M6 6l12 12"></path>
  </svg>
);

export const SeparationIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="10" y1="8" x2="14" y2="16"></line>
  </svg>
);

export const DivorceIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="8" x2="12" y2="16"></line>
    <line x1="12" y1="8" x2="16" y2="16"></line>
  </svg>
);

export const EraseIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 消しゴム本体 */}
    <rect x="6" y="8" width="12" height="6" rx="1" ry="1" fill="currentColor" fillOpacity="0.1" />
    {/* 消しゴムの帯 */}
    <rect x="6" y="10" width="12" height="2" fill="currentColor" fillOpacity="0.2" />
    {/* 消しカス */}
    <circle cx="4" cy="16" r="1" fill="currentColor" fillOpacity="0.3" />
    <circle cx="7" cy="18" r="0.8" fill="currentColor" fillOpacity="0.3" />
    <circle cx="10" cy="17" r="0.6" fill="currentColor" fillOpacity="0.3" />
  </svg>
);