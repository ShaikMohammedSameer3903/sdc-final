import React from 'react';

const Skeleton = ({
  className = '',
  variant = 'rectangle',
  height,
  width,
  circle = false,
  animation = 'pulse',
  ...props
}) => {
  const baseClasses = 'bg-neutral-200 dark:bg-neutral-800 rounded-lg';
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 bg-[length:200%_100%] animate-wave',
  };

  const variantClasses = {
    text: 'h-4',
    title: 'h-6 w-3/4',
    heading: 'h-8 w-2/3',
    button: 'h-10 w-24',
    input: 'h-10 w-full',
    avatar: 'rounded-full h-10 w-10',
    card: 'h-40 w-full',
    rectangle: 'h-24 w-full',
  };

  const shapeClass = circle ? 'rounded-full' : 'rounded-lg';
  
  const style = {};
  if (height) style.height = height;
  if (width) style.width = width;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${shapeClass} ${className}`}
      style={style}
      {...props}
    />
  );
};

export const SkeletonGroup = ({
  count = 1,
  className = '',
  itemClassName = '',
  children,
  ...props
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={itemClassName} {...props} />
      ))}
    </div>
  );
};

export default Skeleton;
