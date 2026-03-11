import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  isLoading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-button',
    secondary: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:ring-neutral-500',
    outline: 'border border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/50 focus:ring-neutral-500',
    ghost: 'hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:ring-neutral-500',
    link: 'text-primary-500 hover:underline underline-offset-4 focus:ring-0 p-0 h-auto',
  };

  const sizeStyles = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
    icon: 'h-11 w-11 p-0',
  };

  const buttonClass = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${
    isLoading ? 'opacity-80 cursor-wait' : ''
  }`;

  return (
    <motion.button
      className={buttonClass}
      disabled={disabled || isLoading}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {LeftIcon && !isLoading && <LeftIcon className="h-5 w-5 mr-2" />}
      {children}
      {RightIcon && <RightIcon className="h-5 w-5 ml-2" />}
    </motion.button>
  );
};

export default Button;
