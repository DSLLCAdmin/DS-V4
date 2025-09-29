// Mock Radix UI Slot implementation for button component
// Preemptive mock to prevent Radix UI dependencies
import * as React from 'react';

export interface SlotProps {
  children: any;
  [key: string]: any;
}

export const Slot = React.forwardRef<any, SlotProps>(({ children, ...props }, forwardedRef) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref: forwardedRef,
    } as any);
  }
  return React.createElement(React.Fragment, { ...props, ref: forwardedRef }, children);
});

Slot.displayName = 'Slot';
