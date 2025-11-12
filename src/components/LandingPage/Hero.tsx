"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Trophy, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import goalIcon from '../../../public/goal-icon.svg';
import matchIcon from '../../../public/match-icon.svg';
import teamIcon from '../../../public/team-icon.svg';

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
            {/* Background Image - Optional */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://raw.githubusercontent.com/BorisAngelov23/smgCLFinalProject/refs/heads/master/static_files/images/smgcl.jpg"
                    alt="Tournament Background"
                    fill
                    className="object-cover opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />
            </div>

            <div className="relative z-10 container mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
                <div className="mx-auto max-w-3xl text-center">
                    {/* Main Heading */}
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        <span className="block">Smg Champions</span>
                        <span className="block text-primary">League</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                        Experience the excitement of inter-class football competition.
                        Follow your favorite teams, track matches, and celebrate the champions.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button asChild size="lg" className="w-full sm:w-auto">
                            <Link href="/matches">
                                View Matches
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                            <Link href="/teams">
                                Explore News
                            </Link>
                        </Button>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
                        <div className="flex flex-col items-center">
                            <div className="mb-2 rounded-full bg-primary/10 p-3">
                                {/* <Trophy className="h-8 w-8 text-primary" /> */}
                                <Image src={teamIcon} alt="Team Icon" width={32} height={32} />
                            </div>
                            <div className="text-3xl font-bold">12</div>
                            <div className="text-sm text-muted-foreground">Teams Competing</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="mb-2 rounded-full bg-primary/10 p-3">
                                <Image src={matchIcon} alt="Match Icon" width={40} height={40} />
                            </div>
                            <div className="text-3xl font-bold">48</div>
                            <div className="text-sm text-muted-foreground">Matches Played</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="mb-2 rounded-full bg-primary/10 p-3">
                                <Image src={goalIcon} alt="Goal Icon" width={32} height={32} />
                            </div>
                            <div className="text-3xl font-bold">156</div>
                            <div className="text-sm text-muted-foreground">Goals Scored</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;