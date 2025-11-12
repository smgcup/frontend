
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NewsArticle = {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    author?: string;
    category?: string;
    image?: string;
}

const News = () => {
    // Sample data - replace with actual data from your API
    const articles: NewsArticle[] = [
        {
            id: '1',
            title: 'Championship Finals Set for Next Week',
            excerpt: 'The tournament finals are scheduled for next week with the top four teams competing for the championship title.',
            date: '2024-01-10',
            author: 'Tournament Admin',
            category: 'Tournament',
        },
        {
            id: '2',
            title: 'Team 12A Continues Dominant Run',
            excerpt: 'Team 12A secured another victory this week, maintaining their position at the top of the league standings.',
            date: '2024-01-08',
            author: 'Sports Reporter',
            category: 'Team News',
        },
        {
            id: '3',
            title: 'Record-Breaking Goal Scored in Latest Match',
            excerpt: 'A spectacular goal was scored during yesterday\'s match, setting a new tournament record for the fastest goal.',
            date: '2024-01-05',
            author: 'Match Reporter',
            category: 'Highlights',
        },
        {
            id: '4',
            title: 'New Rules Implemented for Fair Play',
            excerpt: 'The tournament committee has announced new rules to ensure fair play and sportsmanship throughout the competition.',
            date: '2024-01-03',
            author: 'Tournament Admin',
            category: 'Announcements',
        },
    ];

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

    // Show only first 3 articles
    const displayedArticles = articles.slice(0, 3);
    const hasMoreArticles = articles.length > 3;

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-center sm:text-left">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            News
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Stay updated with the latest tournament news and updates
                        </p>
                    </div>
                    {hasMoreArticles && (
                        <div className="flex justify-center sm:justify-end">
                            <Button asChild variant="outline" size="lg">
                                <Link href="/news">
                                    View All News
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayedArticles.map((article) => (
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

                {displayedArticles.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">
                            No news articles available at the moment.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default News;

