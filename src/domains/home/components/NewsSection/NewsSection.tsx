import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { News as NewsType } from '@/domains/news/contracts';
import NewsCard from '@/domains/news/components/NewsCard';

const NewsSection = ({ news }: { news: NewsType[] }) => {
	// Show only first 3 articles
	const displayedArticles = news?.slice(0, 3);
	const hasMoreArticles = news?.length > 3;

	return (
		<section className="py-16 px-4 sm:px-6 lg:px-8">
			<div className="container mx-auto max-w-7xl">
				<div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="text-center sm:text-left">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							News
						</h2>
						<p className="mt-4 text-lg text-muted-foreground">
							Stay updated with the latest tournament news and
							updates
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
					{displayedArticles?.map(article => (
						<Link
							key={article.id}
							href={`/news/${article.id}`}
							className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
						>
							<NewsCard news={article} />
						</Link>
					))}
				</div>

				{displayedArticles?.length === 0 && (
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

export default NewsSection;
