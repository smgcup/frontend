'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logoPng from '@/public/favicon.png';
import {
  Button,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '../ui/';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

type MenuItem = {
  title: string;
  url?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
};

const logoUrl = logoPng;

const menu: MenuItem[] = [
  { title: 'Home', url: '/' },
  { title: 'Matches', url: '/matches' },
  {
    title: 'Standings',
    items: [
      { title: 'Player Standings', url: '/player-standings' },
      { title: 'Team Standings', url: '/team-standings' },
    ],
  },
  { title: 'News', url: '/news' },
  { title: 'Games', url: '/games' },
  { title: 'Rules', url: '/rules' },
];

function normalizePath(path: string) {
  // Handle empty or null paths
  if (!path) return '/';
  // Root path stays as root
  if (path === '/') return '/';
  // Remove one or more trailing slashes using regex
  return path.replace(/\/+$/, '');
}

function isActivePath(itemUrl: string, pathname: string) {
  const url = normalizePath(itemUrl);
  const path = normalizePath(pathname);

  if (url === '/') return path === '/';

  return path === url || path.startsWith(`${url}/`);
}

function isMenuItemActive(item: MenuItem, pathname: string): boolean {
  if (item.url && isActivePath(item.url, pathname)) return true;
  if (!item.items?.length) return false;
  return item.items.some((subItem) => isMenuItemActive(subItem, pathname));
}

const SubMenuLink = ({
  item,
  isActive,
  onNavigate,
}: {
  item: MenuItem;
  isActive: boolean;
  onNavigate?: () => void;
}) => {
  // SubMenuLink is only used for sub-items, which always have URLs
  if (!item.url) {
    throw new Error(`SubMenuLink requires a URL for item: ${item.title}`);
  }
  return (
    <Link
      className={cn(
        'flex select-none flex-row gap-3 rounded-md px-3 py-2 leading-none no-underline outline-none transition-colors',
        'text-sm font-medium text-foreground',
        'hover:bg-muted hover:text-accent-foreground',
        isActive && 'bg-muted/50 text-accent-foreground',
      )}
      href={item.url}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.icon && <div className="text-muted-foreground shrink-0">{item.icon}</div>}
      <div className="flex-1">{item.title}</div>
    </Link>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [mobileAccordionValue, setMobileAccordionValue] = useState<string | undefined>(undefined);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  const activeMobileAccordionValue = menu.find((item) => item.items?.length && isMenuItemActive(item, pathname))?.title;

  useEffect(() => {
    setMobileAccordionValue(activeMobileAccordionValue);
  }, [activeMobileAccordionValue]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const renderMenuItem = (item: MenuItem) => {
    const isActive = isMenuItemActive(item, pathname);

    // If item has nested items, render as dropdown menu
    if (item.items) {
      return (
        <NavigationMenuItem key={item.title}>
          <NavigationMenuTrigger
            className={cn(isActive && 'lg:underline lg:underline-offset-4 lg:decoration-primary lg:decoration-2')}
          >
            {item.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-popover text-popover-foreground min-w-[200px] w-auto z-50">
            <div className="flex flex-col gap-1 p-1">
              {item.items.map((subItem) => (
                <NavigationMenuLink asChild key={subItem.title}>
                  <SubMenuLink item={subItem} isActive={isMenuItemActive(subItem, pathname)} />
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    }

    // Render as simple navigation link for items without sub-items
    // Items without sub-items should always have URLs
    if (!item.url) {
      throw new Error(`Menu item "${item.title}" without sub-items must have a URL`);
    }
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuLink asChild>
          <Link
            href={item.url}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
              isActive && 'underline underline-offset-4 decoration-primary decoration-2',
            )}
          >
            {item.title}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  };

  const renderMobileMenuItem = (item: MenuItem) => {
    const isActive = isMenuItemActive(item, pathname);
    const isOpen = mobileAccordionValue === item.title;

    // If item has nested items, render as custom accordion item
    if (item.items) {
      return (
        <div key={item.title} className="border-b-0">
          <button
            onClick={() => setMobileAccordionValue(isOpen ? undefined : item.title)}
            className="w-full flex items-center justify-between py-3 text-base font-medium px-3 rounded-md transition-colors hover:text-primary"
            aria-expanded={isOpen}
          >
            <span>{item.title}</span>
            <ChevronDown className={cn('size-4 transition-transform duration-200 ease-out', isOpen && 'rotate-180')} />
          </button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-300 ease-out',
              isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
            )}
            style={{
              transitionProperty: 'max-height, opacity',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="flex flex-col gap-1 pl-4 pb-2 pt-1">
              {item.items.map((subItem) => (
                <SubMenuLink
                  key={subItem.title}
                  item={subItem}
                  isActive={isMenuItemActive(subItem, pathname)}
                  onNavigate={() => setIsMenuOpen(false)}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Render as simple link for items without sub-items
    // Items without sub-items should always have URLs
    if (!item.url) {
      throw new Error(`Menu item "${item.title}" without sub-items must have a URL`);
    }
    return (
      <Link
        key={item.title}
        href={item.url}
        onClick={() => setIsMenuOpen(false)}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'block py-3 text-base font-medium text-foreground transition-colors hover:text-primary rounded-md px-3',
          isActive && 'underline underline-offset-4 decoration-primary decoration-2',
        )}
      >
        {item.title}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-background transition-all duration-300 py-2 lg:py-4">
      <div className="w-screen px-6">
        {/* Desktop navigation */}
        <nav className="hidden lg:flex">
          <div className="flex flex-1 items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logoUrl}
                alt="SMG Cup Championship Logo"
                width={70}
                height={70}
                className="transition-all duration-300"
              />
              <span className="font-semibold tracking-tighter transition-all duration-300 text-lg">
                SMG Champions League
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <NavigationMenu viewport={false} delayDuration={0}>
              <NavigationMenuList>{menu.map((item) => renderMenuItem(item))}</NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">{/* We leave this empty for now */}</div>
        </nav>

        {/* Mobile navigation */}
        <div ref={mobileNavRef} className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src={logoUrl} alt="SMG Cup Championship Logo" width={50} height={50} />
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="relative h-10 w-10 -mr-3"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu
                  className={`size-5.5 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                  }`}
                />
                <X
                  className={`absolute size-5.5 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                  }`}
                />
              </Button>
            </div>
          </div>
          <div
            className={`absolute left-0 right-0 top-full z-50 overflow-hidden transition-all duration-300 ease-in-out border-t bg-background shadow-lg px-10 ${
              isMenuOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <nav className="flex flex-col pt-4 pb-6 gap-1">{menu.map((item) => renderMobileMenuItem(item))}</nav>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
