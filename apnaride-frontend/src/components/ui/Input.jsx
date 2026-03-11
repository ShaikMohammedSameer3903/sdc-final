import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(
  (
    {
      label,
      error,
      description,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = '',
      containerClassName = '',
      labelClassName = '',
      errorClassName = '',
      descriptionClassName = '',
      ...props
    },
    ref
  ) => {
    const inputId = props.id || React.useId();
    const errorId = `${inputId}-error`;
    const descriptionId = `${inputId}-description`;

    const inputBaseClasses =
      'flex h-11 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 text-sm ring-offset-white dark:ring-offset-neutral-900 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200';

    const inputWithIconClasses = LeftIcon ? 'pl-10' : '';
    const inputWithRightIconClasses = RightIcon ? 'pr-10' : '';
    const inputWithErrorClasses = error ? 'border-red-500 dark:border-red-400' : '';

    const inputClass = `${inputBaseClasses} ${inputWithIconClasses} ${inputWithRightIconClasses} ${inputWithErrorClasses} ${className}`;

    return (
      <div className={`space-y-2 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium text-neutral-700 dark:text-neutral-300 ${labelClassName}`}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LeftIcon className="h-5 w-5 text-neutral-400" />
            </div>
          )}

          <motion.input
            id={inputId}
            ref={ref}
            className={inputClass}
            aria-invalid={!!error}
            aria-describedby={`${error ? errorId : ''} ${description ? descriptionId : ''}`}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />

          {RightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <RightIcon className="h-5 w-5 text-neutral-400" />
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className={`mt-1 text-sm text-red-600 dark:text-red-400 ${errorClassName}`}
          >
            {error}
          </p>
        )}

        {description && !error && (
          <p
            id={descriptionId}
            className={`mt-1 text-sm text-neutral-500 dark:text-neutral-400 ${descriptionClassName}`}
          >
            {description}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
