import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface SharedButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

type ButtonProps = SharedButtonProps &
  (
    | ({ asAnchor: true; href: string } & Omit<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        keyof SharedButtonProps | 'href'
      >)
    | ({ asAnchor?: false; href?: never } & Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        keyof SharedButtonProps
      >)
  );

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'button--primary',
  secondary: 'button--secondary',
  outline: 'button--outline',
  ghost: 'button--ghost',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'button--sm',
  md: 'button--md',
  lg: 'button--lg',
};

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'right',
    children,
    className = '',
    asAnchor,
    href,
    ...elementProps
  } = props;

  const combinedClass = `button ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="button__icon">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="button__icon">{icon}</span>}
    </>
  );

  if (asAnchor && href) {
    return (
      <a
        {...(elementProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        href={href}
        className={combinedClass}
      >
        {content}
      </a>
    );
  }

  const buttonProps = elementProps as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      {...buttonProps}
      type={buttonProps.type ?? 'button'}
      className={combinedClass}
    >
      {content}
    </button>
  );
};
