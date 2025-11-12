"use client";

import React, { useMemo } from 'react';
import {
    Clock,
    BookOpen,
    ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface NewsArticle {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    author?: string;
    category?: string;
    image?: string;
}

// Sample data - replace with actual API call
const sampleArticles: NewsArticle[] = [
    {
        id: '1',
        title: 'Championship Finals Set for Next Week',
        excerpt: 'The tournament finals are scheduled for next week with the top four teams competing for the championship title. The semi-finals concluded yesterday with exciting matches that went into overtime.',
        date: '2024-01-10',
        author: 'Tournament Admin',
        category: 'Tournament',
    },
    {
        id: '2',
        title: 'Team 12A Continues Dominant Run',
        excerpt: 'Team 12A secured another victory this week, maintaining their position at the top of the league standings. Their consistent performance has been impressive throughout the season.',
        date: '2024-01-08',
        author: 'Sports Reporter',
        category: 'Team News',
    },
    {
        id: '3',
        title: 'Record-Breaking Goal Scored in Latest Match',
        excerpt: 'A spectacular goal was scored during yesterday\'s match, setting a new tournament record for the fastest goal. The player achieved this feat in just 12 seconds after kickoff.',
        date: '2024-01-05',
        author: 'Match Reporter',
        category: 'Highlights',
    },
    {
        id: '4',
        title: 'New Rules Implemented for Fair Play',
        excerpt: 'The tournament committee has announced new rules to ensure fair play and sportsmanship throughout the competition. These changes will take effect starting next season.',
        date: '2024-01-03',
        author: 'Tournament Admin',
        category: 'Announcements',
    },
    {
        id: '5',
        title: 'Player of the Month Award Announced',
        excerpt: 'The Player of the Month award for December has been announced. This prestigious award recognizes outstanding performance and sportsmanship.',
        date: '2024-01-01',
        author: 'Tournament Admin',
        category: 'Awards',
    },
    {
        id: '6',
        title: 'Injury Update: Key Players Return',
        excerpt: 'Several key players who were sidelined with injuries have been cleared to return to action. This will significantly impact the upcoming matches.',
        date: '2023-12-28',
        author: 'Sports Reporter',
        category: 'Team News',
    },
    {
        id: '7',
        title: 'Match Highlights: Best Goals of the Week',
        excerpt: 'Watch the compilation of the best goals scored this week. From long-range strikes to team plays, these moments showcase the skill and talent in the tournament.',
        date: '2023-12-25',
        author: 'Match Reporter',
        category: 'Highlights',
    },
    {
        id: '8',
        title: 'Tournament Schedule Updated',
        excerpt: 'Due to weather conditions, several matches have been rescheduled. Please check the updated schedule for the latest match times and venues.',
        date: '2023-12-22',
        author: 'Tournament Admin',
        category: 'Announcements',
    },
    {
        id: '9',
        title: 'Team 11A Stages Comeback Victory',
        excerpt: 'In a thrilling match, Team 11A came from behind to secure a dramatic victory. The match was decided in the final minutes with a stunning goal.',
        date: '2023-12-20',
        author: 'Sports Reporter',
        category: 'Team News',
    },
    {
        id: '10',
        title: 'Coaching Workshop Scheduled',
        excerpt: 'A coaching workshop will be held next month to help coaches improve their strategies and techniques. All team coaches are encouraged to attend.',
        date: '2023-12-18',
        author: 'Tournament Admin',
        category: 'Announcements',
    },
    {
        id: '11',
        title: 'Top Scorer Race Heats Up',
        excerpt: 'The race for the top scorer title is intensifying as the season progresses. Multiple players are in contention for this prestigious award.',
        date: '2023-12-15',
        author: 'Sports Reporter',
        category: 'Tournament',
    },
    {
        id: '12',
        title: 'Fan Attendance Reaches New High',
        excerpt: 'This season has seen record-breaking fan attendance at matches. The growing support from the community has been incredible.',
        date: '2023-12-12',
        author: 'Match Reporter',
        category: 'Tournament',
    },
];

const AllNews = () => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        }
    };

    // Sort articles by date (newest first)
    const sortedArticles = useMemo(() => {
        return [...sampleArticles].sort((a, b) => {
            const aDate = new Date(a.date).getTime();
            const bDate = new Date(b.date).getTime();
            return bDate - aDate;
        });
    }, []);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← Back to Home
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary">
                            <BookOpen className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">News</h1>
                            <p className="mt-2 text-lg text-muted-foreground">
                                Stay updated with the latest tournament news and updates
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Articles Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sortedArticles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/news/${article.id}`}
                            className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="flex flex-col h-full">
                                {/* Article Image Placeholder */}
                                <div className="h-48 w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                    <div className="text-4xl font-bold text-primary/30">
                                        {article.title.charAt(0)}
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col p-6">
                                    {/* Category and Date */}
                                    <div className="mb-3 flex items-center justify-between text-sm">
                                        {article.category && (
                                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                                {article.category}
                                            </span>
                                        )}
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>{formatDate(article.date)}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="mb-2 text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-3">
                                        {article.excerpt}
                                    </p>

                                    {/* Author */}
                                    {article.author && (
                                        <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>By {article.author}</span>
                                        </div>
                                    )}

                                    {/* Read More */}
                                    <div className="mt-4 flex items-center text-sm font-medium text-primary group-hover:underline">
                                        Read more
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {sortedArticles.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">
                            No news articles available at the moment.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllNews;

