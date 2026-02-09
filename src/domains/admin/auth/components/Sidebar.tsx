'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarItem = {
  title: string;
  url: string;
  icon?: React.ReactNode;
};

type SidebarProps = {
  items?: SidebarItem[];
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const Sidebar = ({ items = [], isOpen = false, onOpenChange }: SidebarProps) => {
  const pathname = usePathname();

  const logoUrl =
    'https://github.com/BorisAngelov23/smgCLFinalProject/blob/master/static_files/images/favicon.png?raw=true';

  const setOpen = (open: boolean) => onOpenChange?.(open);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  if (pathname === '/admin/login') {
    return null;
  }
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed left-0 right-0 bottom-0 top-14 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 lg:top-0 top-14 lg:h-full h-[calc(100%-3.5rem)] bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-2 px-6 py-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Image
              src={logoUrl}
              alt="SMG Cup Championship Logo"
              width={50}
              height={50}
              className="transition-all duration-300"
            />
            <span className="font-semibold tracking-tighter transition-all duration-300 text-lg text-sidebar-foreground">
              SMG Cup
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const isActive = pathname === item.url;
              return (
                <li key={item.title}>
                  <Link
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                  >
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
