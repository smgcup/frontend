'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import logoPng from '@/public/favicon.png';
import { cn } from '@/lib/utils';

const menuSections = [
  {
    title: 'Quick Links',
    links: [
      { title: 'Home', url: '/' },
      { title: 'Matches', url: '/matches' },
      { title: 'News', url: '/news' },
      { title: 'Games', url: '/games' },
    ],
  },
  {
    title: 'Standings',
    links: [
      { title: 'Player Standings', url: '/player-standings' },
      { title: 'Team Standings', url: '/team-standings' },
    ],
  },
  {
    title: 'Information',
    links: [{ title: 'Rules', url: '/rules' }],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={logoPng}
                  alt="SMG Cup Championship Logo"
                  width={50}
                  height={50}
                  className="transition-transform hover:scale-105"
                />
                <span className="font-semibold tracking-tight text-base">SMG Champions League</span>
              </Link>
            </div>

            {/* Menu Sections */}
            {menuSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="font-semibold text-sm text-foreground">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.url}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline underline-offset-4"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social Media Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-foreground">Follow Us</h3>
              <div className="flex gap-3">
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center justify-center size-10 rounded-md bg-primary/10 text-primary',
                    'hover:bg-primary hover:text-primary-foreground transition-all duration-200',
                    'hover:scale-110',
                  )}
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="size-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Standard */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] gap-8 items-start">
            {/* Brand Section */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src={logoPng}
                  alt="SMG Cup Championship Logo"
                  width={50}
                  height={50}
                  className="transition-transform hover:scale-105"
                />
                <span className="font-semibold tracking-tight text-lg">SMG Champions League</span>
              </Link>
            </div>

            {/* Menu Sections */}
            {menuSections.map((section) => (
              <div key={section.title} className="space-y-4 min-w-[140px]">
                <h3 className="font-semibold text-sm text-foreground">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.url}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline underline-offset-4"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social Media Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-foreground">Follow Us</h3>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center justify-center size-10 rounded-md bg-primary/10 text-primary',
                  'hover:bg-primary hover:text-primary-foreground transition-all duration-200',
                  'hover:scale-110',
                )}
                aria-label="Follow us on Instagram"
              >
                <Instagram className="size-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© {currentYear} SMG Champions League. All rights reserved.</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              Made with{' '}
              <span className="text-red-500 animate-pulse inline-block" aria-label="love">
                ♥
              </span>{' '}
              by{' '}
              <span className="font-medium text-foreground">
                <Link href="https://linkedin.com/in/christian-penev" target="_blank" rel="noopener noreferrer">
                  Christian Penev
                </Link>
              </span>{' '}
              X{' '}
              <span className="font-medium text-foreground">
                <Link href="https://linkedin.com/in/anton-yankov" target="_blank" rel="noopener noreferrer">
                  Anton Yankov
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
