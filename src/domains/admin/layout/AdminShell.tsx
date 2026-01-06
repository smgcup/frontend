'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui';
import Sidebar from '@/domains/admin/auth/components/Sidebar';
import { Menu } from 'lucide-react';

export type AdminNavItem = {
  title: string;
  url: string;
  icon?: React.ReactNode;
};

type AdminShellProps = {
  items: AdminNavItem[];
  children: React.ReactNode;
};

function getActiveTitle(items: AdminNavItem[], pathname: string) {
  const sorted = [...items].sort((a, b) => b.url.length - a.url.length);

  for (const item of sorted) {
    if (item.url === '/admin') {
      if (pathname === '/admin') return item.title;
      continue;
    }
    if (pathname === item.url || pathname.startsWith(`${item.url}/`)) return item.title;
  }

  return 'Admin';
}

export default function AdminShell({ items, children }: AdminShellProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const prevPathnameRef = useRef(pathname);

  const activeTitle = useMemo(() => getActiveTitle(items, pathname), [items, pathname]);

  // Close drawer on navigation
  useEffect(() => {
    if (!isMobileOpen) return;
    // Only close when the route actually changes (not when opening the drawer)
    if (prevPathnameRef.current === pathname) return;
    const timeoutId = window.setTimeout(() => setIsMobileOpen(false), 0);
    return () => window.clearTimeout(timeoutId);
  }, [pathname, isMobileOpen]);

  // Track the latest route for the "close on navigation" behavior
  useEffect(() => {
    prevPathnameRef.current = pathname;
  }, [pathname]);

  // Scroll lock when drawer is open (mobile)
  useEffect(() => {
    if (!isMobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 lg:hidden border-b bg-background/80 backdrop-blur-sm">
        <div
          className="h-14 px-4 flex items-center gap-3"
          onClick={() => {
            setIsMobileOpen(false);
          }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileOpen((v) => !v);
            }}
            aria-label={isMobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isMobileOpen}
          >
            <Menu className="size-4" />
          </Button>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{activeTitle}</p>
            <p className="text-xs text-muted-foreground truncate">Admin</p>
          </div>
        </div>
      </header>

      <Sidebar items={items} isOpen={isMobileOpen} onOpenChange={setIsMobileOpen} />

      <main className="lg:ml-64 min-h-screen">
        <div className="pt-16 lg:pt-6 px-4 lg:px-6 py-6">{children}</div>
      </main>
    </>
  );
}
