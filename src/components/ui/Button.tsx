import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  asAnchor?: boolean;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  children,
  className = '',
  asAnchor = false,
  href,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#B45CFF] focus:ring-offset-2 focus:ring-offset-[#090711] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-4 py-1.5 gap-1.5',
    md: 'text-sm px-6 py-2.5 gap-2',
    lg: 'text-base px-8 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#8B3DFF] to-[#B45CFF] text-white hover:from-[#9B4DFF] hover:to-[#C26EFF] shadow-[0_0_20px_rgba(139,61,255,0.4)] hover:shadow-[0_0_30px_rgba(180,92,255,0.65)] hover:scale-[1.02] active:scale-[0.98]',
    secondary:
      'bg-[#140D26]/80 text-[#FFFFFF] hover:text-white border border-purple-500/30 hover:border-purple-400/60 hover:bg-[#1E1338] shadow-[0_0_12px_rgba(139,61,255,0.15)] hover:shadow-[0_0_20px_rgba(180,92,255,0.3)] hover:scale-[1.02] active:scale-[0.98]',
    outline:
      'bg-transparent text-[#C7C9D1] hover:text-white border border-purple-500/40 hover:border-purple-400 hover:bg-purple-950/20 active:scale-[0.98]',
    ghost:
      'bg-transparent text-[#B5B0C2] hover:text-white hover:bg-white/5 active:scale-[0.98]',
  };

  const combinedClass = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (asAnchor && href) {
    return (
      <a href={href} className={combinedClass}>
        {icon && iconPosition === 'left' && <span className="flex items-center">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="flex items-center">{icon}</span>}
      </a>
    );
  }

  return (
    <button className={combinedClass} {...props}>
      {icon && iconPosition === 'left' && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="flex items-center">{icon}</span>}
    </button>
  );
};
