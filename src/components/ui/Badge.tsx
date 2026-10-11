import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'silver' | 'outline' | 'demo';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'purple',
  className = '',
}) => {
  const variantStyles = {
    purple: 'bg-purple-950/40 text-[#D8B4FE] border border-purple-500/30',
    silver: 'bg-white/5 text-[#C7C9D1] border border-white/10',
    outline: 'bg-transparent text-[#B5B0C2] border border-purple-500/20',
    demo: 'bg-amber-950/30 text-amber-300 border border-amber-500/30 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs transition-colors ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
