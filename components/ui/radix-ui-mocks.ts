// Comprehensive Radix UI Mock Implementations
// Prevents all Radix UI dependency failures in admin dashboards

import * as React from 'react';
import { cn } from '@/lib/utils';

// Mock Slot component for button variants
export const Slot = React.forwardRef<any, any>(({ children, ...props }, forwardedRef) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ...children.props,
      ref: forwardedRef,
    });
  }
  return React.createElement(React.Fragment, { ...props, ref: forwardedRef }, children);
});

// Mock Dialog components
export const Dialog = React.forwardRef<HTMLDivElement, any>((props, ref) => (
  <div ref={ref} {...props} />
));

export const DialogTrigger = React.forwardRef<HTMLButtonElement, any>((props, ref) => (
  <button ref={ref} {...props} />
));

export const DialogContent = React.forwardRef<HTMLDivElement, any>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('fixed inset-0 z-50 flex items-center justify-center', className)}
    {...props}
  />
));

export const DialogHeader = ({ className, ...props }: any) => (
  <div className={cn('p-6', className)} {...props} />
);

export const DialogFooter = ({ className, ...props }: any) => (
  <div className={cn('p-6', className)} {...props} />
);

export const DialogTitle = React.forwardRef<HTMLHeadingElement, any>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
));

export const DialogDescription = React.forwardRef<HTMLParagraphElement, any>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));

// Mock Dropdown components
export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, any>((props, ref) => (
  <button ref={ref} {...props} />
));

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, any>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('absolute right-0 mt-2 bg-white shadow-lg rounded-md', className)}
    {...props}
  />
));

export const DropdownMenuItem = React.forwardRef<HTMLDivElement, any>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer', className)}
    {...props}
  />
));

// Mock Label component
export const Label = React.forwardRef<HTMLLabelElement, any>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn('text-sm font-medium', className)} {...props} />
));

export const LabelRoot = Label;

// Mock Popover components
export const PopoverTrigger = React.forwardRef<HTMLButtonElement, any>((props, ref) => (
  <button ref={ref} {...props} />
));

export const PopoverContent = React.forwardRef<HTMLDivElement, any>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('bg-white p-3 shadow-lg rounded-md', className)}
    {...props}
  />
));
