'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

type SidebarItem = {
  title: string;
  url: string;
  icon?: React.ReactNode;
};

type SidebarProps = {
  items?: SidebarItem[];
};

const Sidebar = ({ items = [] }: SidebarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const logoUrl =
    'https://github.com/BorisAngelov23/smgCLFinalProject/blob/master/static_files/images/favicon.png?raw=true';

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 lg:hidden" onClick={toggleMobileMenu}>
        <Menu
          className={`size-4 transition-all duration-300 ${
            isMobileOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <X
          className={`absolute size-4 transition-all duration-300 ${
            isMobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-2 px-6 py-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
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
                    onClick={closeMobileMenu}
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
