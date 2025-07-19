
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
    stroke="#666"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* 消しゴム本体 */}
    <rect x="4" y="8" width="16" height="8" rx="2" fill="#FFB6C1" stroke="#666" />
    {/* 金属部分 */}
    <rect x="4" y="13" width="16" height="3" fill="#C0C0C0" stroke="#666" />
    {/* 削れた部分 */}
    <path d="M8 8 L10 6 L14 6 L16 8 Z" fill="#FF91A4" stroke="#666" />
  </svg>
);