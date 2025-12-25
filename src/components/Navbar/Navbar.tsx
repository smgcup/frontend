'use client';
import Image from 'next/image';
import Link from 'next/link';
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
import { useState } from 'react';

type MenuItem = {
	title: string;
	url: string;
	description?: string;
	icon?: React.ReactNode;
	items?: MenuItem[];
};

const menu: MenuItem[] = [
	{ title: 'Home', url: '/' },
	{ title: 'Matches', url: '/matches' },
	{ title: 'Player Standings', url: '/players' },
	{ title: 'News', url: '/news' },
];

const renderMenuItem = (item: MenuItem) => {
	if (item.items) {
		return (
			<NavigationMenuItem key={item.title}>
				<NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
				<NavigationMenuContent className="bg-popover text-popover-foreground">
					{item.items.map(subItem => (
						<NavigationMenuLink
							asChild
							key={subItem.title}
							className="w-80"
						>
							<SubMenuLink item={subItem} />
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
				className="bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
			>
				{item.title}
			</NavigationMenuLink>
		</NavigationMenuItem>
	);
};

const renderMobileMenuItem = (item: MenuItem) => {
	if (item.items) {
		return (
			<AccordionItem
				key={item.title}
				value={item.title}
				className="border-b-0"
			>
				<AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
					{item.title}
				</AccordionTrigger>
				<AccordionContent className="pb-2 pt-1">
					<div className="flex flex-col gap-1 pl-4">
						{item.items.map(subItem => (
							<SubMenuLink key={subItem.title} item={subItem} />
						))}
					</div>
				</AccordionContent>
			</AccordionItem>
		);
	}

	return (
		<a
			key={item.title}
			href={item.url}
			className="block py-3 text-base font-medium text-foreground transition-colors hover:text-primary"
		>
			{item.title}
		</a>
	);
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
	return (
		<a
			className="hover:bg-muted hover:text-accent-foreground flex select-none flex-row gap-3 rounded-md px-3 py-2 leading-none no-underline outline-none transition-colors"
			href={item.url}
		>
			{item.icon && (
				<div className="text-muted-foreground shrink-0">
					{item.icon}
				</div>
			)}
			<div className="flex-1">
				<div className="text-sm font-medium text-foreground">
					{item.title}
				</div>
				{item.description && (
					<p className="text-muted-foreground text-xs leading-snug mt-0.5">
						{item.description}
					</p>
				)}
			</div>
		</a>
	);
};

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav className="sticky top-0 z-50 bg-background transition-all duration-300 py-4">
			<div className="w-screen px-10">
				{/* Desktop Menu */}
				<nav className="hidden items-center lg:flex">
					<div className="flex flex-1 items-center">
						{/* Logo */}
						<Link href="/" className="flex items-center gap-2">
							<Image
								src={
									'https://github.com/BorisAngelov23/smgCLFinalProject/blob/master/static_files/images/favicon.png?raw=true'
								}
								alt="SMG Cup Championship Logo"
								width={70}
								height={70}
								className="transition-all duration-300"
							/>
							<span className="font-semibold tracking-tighter transition-all duration-300 text-lg">
								SMG Cup Championship
							</span>
						</Link>
					</div>
					<div className="flex flex-1 items-center justify-center">
						<NavigationMenu>
							<NavigationMenuList>
								{menu.map(item => renderMenuItem(item))}
							</NavigationMenuList>
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
							<Image
								src={
									'https://github.com/BorisAngelov23/smgCLFinalProject/blob/master/static_files/images/favicon.png?raw=true'
								}
								alt="SMG Cup Championship Logo"
								width={50}
								height={50}
							/>
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
								className="relative"
								onClick={() => setIsMenuOpen(!isMenuOpen)}
							>
								<Menu
									className={`size-4 transition-all duration-300 ${
										isMenuOpen
											? 'opacity-0 rotate-90 scale-0'
											: 'opacity-100 rotate-0 scale-100'
									}`}
								/>
								<X
									className={`absolute size-4 transition-all duration-300 ${
										isMenuOpen
											? 'opacity-100 rotate-0 scale-100'
											: 'opacity-0 -rotate-90 scale-0'
									}`}
								/>
							</Button>
						</div>
					</div>
					{/* Expandable Menu */}
					<div
						className={`absolute left-0 right-0 top-full z-50 overflow-hidden transition-all duration-300 ease-in-out border-t bg-background shadow-lg -mx-10 px-10 mt-3 ${
							isMenuOpen
								? 'max-h-[1000px] opacity-100'
								: 'max-h-0 opacity-0 pointer-events-none'
						}`}
					>
						<nav className="flex flex-col py-6">
							<Accordion
								type="single"
								collapsible
								className="flex w-full flex-col gap-1"
							>
								{menu.map(item => renderMobileMenuItem(item))}
							</Accordion>
						</nav>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
