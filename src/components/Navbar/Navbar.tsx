"use client";

import { useState, useEffect, useRef } from "react";
import { Book, Menu, Sunset, Trees, User, X, Zap } from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from 'next/image';

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}

interface NavbarProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    menu?: MenuItem[];
    auth?: {
        login: {
            title: string;
            url: string;
        };
        profile?: {
            url: string;
        };
    };
    isLoggedIn?: boolean;
}

const Navbar = ({
    logo = {
        url: "/",
        src: "https://github.com/BorisAngelov23/smgCLFinalProject/blob/master/static_files/images/favicon.png?raw=true",
        alt: "logo",
        title: "Smg Champions League",
    },
    menu = [
        { title: "Home", url: "#" },
        {
            title: "Products",
            url: "#",
            items: [
                {
                    title: "Blog",
                    description: "The latest industry news, updates, and info",
                    icon: <Book className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Company",
                    description: "Our mission is to innovate and empower the world",
                    icon: <Trees className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Careers",
                    description: "Browse job listing and discover our workspace",
                    icon: <Sunset className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Support",
                    description:
                        "Get in touch with our support team or visit our community forums",
                    icon: <Zap className="size-5 shrink-0" />,
                    url: "#",
                },
            ],
        },
        {
            title: "Resources",
            url: "#",
            items: [
                {
                    title: "Help Center",
                    description: "Get all the answers you need right here",
                    icon: <Zap className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Contact Us",
                    description: "We are here to help you with any questions you have",
                    icon: <Sunset className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Status",
                    description: "Check the current status of our services and APIs",
                    icon: <Trees className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Terms of Service",
                    description: "Our terms and conditions for using our services",
                    icon: <Book className="size-5 shrink-0" />,
                    url: "#",
                },
            ],
        },
        {
            title: "Pricing",
            url: "#",
        },
        {
            title: "Blog",
            url: "#",
        },
    ],
    auth = {
        login: { title: "Login", url: "#" },
        profile: { url: "#" },
    },
    isLoggedIn = false,
}: NavbarProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 100) {
                // Scrolling down
                if (currentScrollY > lastScrollY.current) {
                    setIsScrolled(true);
                }
                // Scrolling up
                else if (currentScrollY < lastScrollY.current) {
                    setIsScrolled(false);
                }
            } else {
                // At the top, always show full navbar
                setIsScrolled(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className={`sticky top-0 z-50 bg-background transition-all duration-300 ${isScrolled ? "py-4 shadow-md" : "py-4"}`}>
            <div className="w-screen px-10">
                {/* Desktop Menu */}
                <nav className="hidden items-center lg:flex">
                    <div className="flex flex-1 items-center">
                        {/* Logo */}
                        <a href={logo.url} className="flex items-center gap-2">
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={isScrolled ? 50 : 70}
                                height={isScrolled ? 50 : 70}
                                className="transition-all duration-300"
                            />
                            <span className={`font-semibold tracking-tighter transition-all duration-300 ${isScrolled ? "text-base" : "text-lg"}`}>
                                {logo.title}
                            </span>
                        </a>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {menu.map((item) => renderMenuItem(item))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div className="flex flex-1 items-center justify-end gap-2">
                        {isLoggedIn ? (
                            <Button asChild size="icon">
                                <a href={auth.profile?.url || "#"}>
                                    <User className="size-5" />
                                </a>
                            </Button>
                        ) : (
                            <Button asChild size="sm">
                                <a href={auth.login.url}>{auth.login.title}</a>
                            </Button>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div className="relative block lg:hidden">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <a href={logo.url} className="flex items-center gap-2">
                            <Image src={logo.src} alt={logo.alt} width={50} height={50} />
                        </a>
                        <div className="flex items-center gap-2">
                            {isLoggedIn ? (
                                <Button asChild size="icon">
                                    <a href={auth.profile?.url || "#"}>
                                        <User className="size-5" />
                                    </a>
                                </Button>
                            ) : (
                                <Button asChild size="sm">
                                    <a href={auth.login.url}>{auth.login.title}</a>
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="icon"
                                className="relative"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <Menu className={`size-4 transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                                <X className={`absolute size-4 transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
                            </Button>
                        </div>
                    </div>
                    {/* Expandable Menu */}
                    <div
                        className={`absolute left-0 right-0 top-full z-50 overflow-hidden transition-all duration-300 ease-in-out border-t bg-background shadow-lg -mx-10 px-10 mt-3 ${isMenuOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                            }`}
                    >
                        <nav className="flex flex-col py-6">
                            <Accordion
                                type="single"
                                collapsible
                                className="flex w-full flex-col gap-1"
                            >
                                {menu.map((item) => renderMobileMenuItem(item))}
                            </Accordion>
                        </nav>
                    </div>
                </div>
            </div>
        </section>
    );
};

const renderMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-popover text-popover-foreground">
                    {item.items.map((subItem) => (
                        <NavigationMenuLink asChild key={subItem.title} className="w-80">
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
            <AccordionItem key={item.title} value={item.title} className="border-b-0">
                <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="pb-2 pt-1">
                    <div className="flex flex-col gap-1 pl-4">
                        {item.items.map((subItem) => (
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
                <div className="text-muted-foreground shrink-0">{item.icon}</div>
            )}
            <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{item.title}</div>
                {item.description && (
                    <p className="text-muted-foreground text-xs leading-snug mt-0.5">
                        {item.description}
                    </p>
                )}
            </div>
        </a>
    );
};

export default Navbar;
