"use client";

import * as React from "react";
import { Drawer as VaulDrawer } from "vaul";

import { cn } from "@/lib/utils";

// Root: thin wrapper over Vaul's Drawer.Root so consumers (like SettingsPage)
// can pass snapPoints, fixed, direction, etc.
function Drawer(props: React.ComponentProps<typeof VaulDrawer.Root>) {
  return <VaulDrawer.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger(
  props: React.ComponentProps<typeof VaulDrawer.Trigger>,
) {
  return <VaulDrawer.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal(props: React.ComponentProps<typeof VaulDrawer.Portal>) {
  return <VaulDrawer.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerOverlay(
  { className, ...props }: React.ComponentProps<
    typeof VaulDrawer.Overlay
  >,
) {
  return (
    <VaulDrawer.Overlay
      data-slot="drawer-overlay"
      className={cn("fixed inset-0 z-50 bg-black/25 backdrop-blur-sm", className)}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Content>) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <VaulDrawer.Content
        data-slot="drawer-content"
        className={cn(
          // Bottom sheet style, capped height; callers can override with h-[..] etc.
          "fixed bottom-0 left-0 right-0 z-50 flex max-h-[82vh] flex-col rounded-t-[10px] bg-background text-base",
          className,
        )}
        {...props}
      >
        {/* Handle */}
        <div className="mx-auto mt-2 mb-1 h-1 w-[80px] rounded-full bg-muted" />
        {/* Scrollable inner content area */}
        <div className="mx-auto w-full max-w-md overflow-y-auto px-4 pb-4 pt-1">
          {children}
        </div>
      </VaulDrawer.Content>
    </DrawerPortal>
  );
}

function DrawerTitle(
  { className, ...props }: React.ComponentProps<typeof VaulDrawer.Title>,
) {
  return (
    <VaulDrawer.Title
      data-slot="drawer-title"
      className={cn("mt-4 text-base font-medium text-foreground", className)}
      {...props}
    />
  );
}

function DrawerDescription(
  { className, ...props }: React.ComponentProps<
    typeof VaulDrawer.Description
  >,
) {
  return (
    <VaulDrawer.Description
      data-slot="drawer-description"
      className={cn("mt-2 text-base text-muted-foreground", className)}
      {...props}
    />
  );
}

function DrawerClose(
  props: React.ComponentProps<typeof VaulDrawer.Close>,
) {
  return <VaulDrawer.Close data-slot="drawer-close" {...props} />;
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
}

