
import React from 'react';

type IconProps = {
  className?: string;
};

export const RelationshipLineIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="2" y1="12" x2="22" y2="12"></line>
  </svg>
);

export const DashedLineIcon: React.FC<IconProps> = ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="20" y2="12" strokeDasharray="4 4"></line>
    </svg>
);