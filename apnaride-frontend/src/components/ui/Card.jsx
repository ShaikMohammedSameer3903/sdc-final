import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
  radius = 'xl',
  shadow = 'md',
  border = true,
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  };

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-md',
    xl: 'shadow-lg',
  };

  const baseClasses = `overflow-hidden transition-all duration-200 ${
    border ? 'border border-neutral-200 dark:border-neutral-800' : 'border-0'
  } ${paddingClasses[padding]} ${radiusClasses[radius]} ${
    shadowClasses[shadow]
  } ${hoverable ? 'hover:shadow-lg dark:hover:shadow-neutral-800/50' : ''} ${
    className || ''
  }`;

  return (
    <motion.div
      className={baseClasses}
      whileHover={hoverable ? { y: -2 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const CardHeader = ({ className = '', children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 pb-0 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = '', children }) => (
  <h3
    className={`text-xl font-semibold leading-none tracking-tight ${className}`}
  >
    {children}
  </h3>
);

const CardDescription = ({ className = '', children }) => (
  <p className={`text-sm text-neutral-500 dark:text-neutral-400 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ className = '', children }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardFooter = ({ className = '', children }) => (
  <div
    className={`flex items-center p-6 pt-0 ${className}`}
  >
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
