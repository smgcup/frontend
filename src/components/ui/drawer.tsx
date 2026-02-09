'use client';

import * as React from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

function Drawer({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/60 backdrop-blur-xs',
        'data-open:animate-in data-open:fade-in-0',
        'data-closed:animate-out data-closed:fade-out-0',
        'duration-200',
        className,
      )}
      {...props}
    />
  );
}

type DrawerSide = 'bottom' | 'right';

function DrawerContent({
  className,
  children,
  side = 'bottom',
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { side?: DrawerSide }) {
  return (
    <DialogPrimitive.Portal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          'fixed z-50 duration-300',
          side === 'bottom' && [
            'inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl',
            'data-open:animate-in data-open:slide-in-from-bottom data-open:fade-in-0',
            'data-closed:animate-out data-closed:slide-out-to-bottom data-closed:fade-out-0',
          ],
          side === 'right' && [
            'right-0 top-0 bottom-0 w-full max-w-md rounded-l-2xl',
            'data-open:animate-in data-open:slide-in-from-right data-open:fade-in-0',
            'data-closed:animate-out data-closed:slide-out-to-right data-closed:fade-out-0',
          ],
          className,
        )}
        {...props}
      >
        {side === 'bottom' && (
          <div className="flex justify-center pt-3 pb-1 bg-[#0a0014]">
            <div className="h-1 w-10 rounded-full bg-white/30" />
          </div>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title data-slot="drawer-title" className={cn('text-base font-medium', className)} {...props} />
  );
}

function DrawerDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="drawer-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export { Drawer, DrawerTrigger, DrawerClose, DrawerContent, DrawerOverlay, DrawerTitle, DrawerDescription };
