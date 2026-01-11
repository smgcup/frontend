'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logoPng from '@/public/favicon.png';
import {
  Button,
  NavigationMenu,
  NavigationMenuList,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '../ui/';
import { User } from 'lucide-react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type MenuItem = {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
};

const logoUrl = logoPng;

const menu: MenuItem[] = [
  { title: 'Home', url: '/' },
  { title: 'Matches', url: '/matches' },
  { title: 'Player Standings', url: '/players' },
  { title: 'News', url: '/news' },
  { title: 'Games', url: '/games' },
  { title: 'Rules', url: '/rules' },
];

function normalizePath(path: string) {
  if (!path) return '/';
  if (path === '/') return '/';
  return path.replace(/\/+$/, '');
}

function isActivePath(itemUrl: string, pathname: string) {
  const url = normalizePath(itemUrl);
  const path = normalizePath(pathname);

  // Root should only be active on root.
  if (url === '/') return path === '/';

  // Exact match or nested subpage match.
  return path === url || path.startsWith(`${url}/`);
}

function isMenuItemActive(item: MenuItem, pathname: string): boolean {
  if (isActivePath(item.url, pathname)) return true;
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
  return (
    <Link
      className={cn(
        'hover:bg-muted hover:text-accent-foreground flex select-none flex-row gap-3 rounded-md px-3 py-2 leading-none no-underline outline-none transition-colors',
        isActive && 'underline underline-offset-4 decoration-primary decoration-2',
      )}
      href={item.url}
      onClick={onNavigate}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.icon && <div className="text-muted-foreground shrink-0">{item.icon}</div>}
      <div className="flex-1">
        <div className="text-sm font-medium text-foreground">{item.title}</div>
        {item.description && <p className="text-muted-foreground text-xs leading-snug mt-0.5">{item.description}</p>}
      </div>
    </Link>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [mobileAccordionValue, setMobileAccordionValue] = useState<string | undefined>(undefined);

  const activeMobileAccordionValue = menu.find((item) => item.items?.length && isMenuItemActive(item, pathname))?.title;

  // Keep the expanded mobile section in sync with the current route.
  // (So opening the menu shows the active section + active subpage immediately.)
  useEffect(() => {
    setMobileAccordionValue(activeMobileAccordionValue);
  }, [activeMobileAccordionValue]);

  const renderMenuItem = (item: MenuItem) => {
    const isActive = isMenuItemActive(item, pathname);

    if (item.items) {
      return (
        <NavigationMenuItem key={item.title}>
          <NavigationMenuTrigger
            className={cn(isActive && 'underline underline-offset-4 decoration-primary decoration-2')}
          >
            {item.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-popover text-popover-foreground">
            {item.items.map((subItem) => (
              <NavigationMenuLink asChild key={subItem.title} className="w-80">
                <SubMenuLink item={subItem} isActive={isMenuItemActive(subItem, pathname)} />
              </NavigationMenuLink>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    }

    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuLink
          href={item.url}
          aria-current={isActive ? 'page' : undefined}
          className={cn(
            'bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
            isActive && 'underline underline-offset-4 decoration-primary decoration-2',
          )}
        >
          {item.title}
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  };

  const renderMobileMenuItem = (item: MenuItem) => {
    const isActive = isMenuItemActive(item, pathname);

    if (item.items) {
      return (
        <AccordionItem key={item.title} value={item.title} className="border-b-0">
          <AccordionTrigger
            className={cn(
              'py-3 text-base font-medium hover:no-underline px-3',
              isActive && 'underline underline-offset-4 decoration-primary decoration-2',
            )}
          >
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="pb-2 pt-1">
            <div className="flex flex-col gap-1 pl-4">
              {item.items.map((subItem) => (
                <SubMenuLink
                  key={subItem.title}
                  item={subItem}
                  isActive={isMenuItemActive(subItem, pathname)}
                  onNavigate={() => setIsMenuOpen(false)}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      );
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
    <nav className="sticky top-0 z-50 bg-background transition-all duration-300 py-4">
      <div className="w-screen px-6">
        {/* Desktop Menu */}
        <nav className="hidden items-center lg:flex">
          <div className="flex flex-1 items-center">
            {/* Logo */}
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
            <NavigationMenu>
              <NavigationMenuList>{menu.map((item) => renderMenuItem(item))}</NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            {false ? (
              <Button asChild size="lg">
                <Link href={'/profile'}>
                  <User className="size-5" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link href={'/login'}>{'Login'}</Link>
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="relative block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image src={logoUrl} alt="SMG Cup Championship Logo" width={50} height={50} />
            </Link>
            <div className="flex items-center gap-2">
              {false ? (
                <Button asChild size="icon">
                  <Link href={'/profile'}>
                    <User className="size-5" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link href={'/login'}>{'Login'}</Link>
                </Button>
              )}
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
          {/* Expandable Menu */}
          <div
            className={`absolute left-0 right-0 top-full z-50 overflow-hidden transition-all duration-300 ease-in-out border-t bg-background shadow-lg -mx-10 px-10 mt-3 ${
              isMenuOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}
          >
            <nav className="flex flex-col py-6">
              <Accordion
                type="single"
                collapsible
                value={mobileAccordionValue}
                onValueChange={(v) => setMobileAccordionValue(v || undefined)}
                className="flex w-full flex-col gap-1"
              >
                {menu.map((item) => renderMobileMenuItem(item))}
              </Accordion>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
