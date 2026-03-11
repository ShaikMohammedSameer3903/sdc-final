import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const iconVariants = {
  default: {
    iconClass: 'fa-regular fa-file-lines',
    className: 'text-primary-500',
  },
  search: {
    iconClass: 'fa-solid fa-magnifying-glass',
    className: 'text-blue-500',
  },
  error: {
    iconClass: 'fa-solid fa-circle-exclamation',
    className: 'text-red-500',
  },
  sad: {
    iconClass: 'fa-regular fa-face-frown-open',
    className: 'text-amber-500',
  },
};

const EmptyState = ({
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  icon = 'default',
  action,
  actionText = 'Add New',
  className = '',
  iconClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  actionClassName = '',
}) => {
  const variant = typeof icon === 'string' ? iconVariants[icon] || iconVariants.default : null;
  const iconColorClass = variant?.className || 'text-primary-500';
  const iconClass = typeof icon === 'string' ? variant.iconClass : icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <div
        className={`flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/30 mb-6 ${iconColorClass} ${iconClassName}`}
      >
        {typeof iconClass === 'string' ? (
          <i className={`${iconClass} text-3xl`} aria-hidden="true" />
        ) : (
          iconClass
        )}
      </div>
      
      <h3 className={`text-xl font-medium text-neutral-900 dark:text-white mb-2 ${titleClassName}`}>
        {title}
      </h3>
      
      <p className={`text-neutral-500 dark:text-neutral-400 max-w-md mb-6 ${descriptionClassName}`}>
        {description}
      </p>
      
      {action && (
        <div className={actionClassName}>
          <Button
            onClick={action}
            variant="primary"
            className="min-w-[120px]"
          >
            {actionText}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
