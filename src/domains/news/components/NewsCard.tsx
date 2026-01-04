import { ArrowRight, Clock } from 'lucide-react';
import React from 'react';
import { News } from '../contracts';
import Image from 'next/image';

const NewsCard = ({ news }: { news: News }) => {
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

	return (
		<div className="flex flex-col h-full">
			{/* Article Image Placeholder */}
			<div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-primary/5">
				<Image
					src={news.imageUrl}
					alt={news.title}
					fill
					className="object-cover"
				/>
			</div>

			<div className="flex flex-1 flex-col p-6">
				{/* Category and Date */}
				<div className="mb-3 flex items-center justify-between text-sm">
					{news.category && (
						<span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
							{news.category}
						</span>
					)}
					<div className="flex items-center gap-1 text-muted-foreground">
						<Clock className="h-3 w-3" />
						<span>{formatDate(news.createdAt)}</span>
					</div>
				</div>

				{/* Title */}
				<h3 className="mb-2 text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
					{news.title}
				</h3>

				{/* Excerpt */}
				<p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-3">
					{news.content}
				</p>

				{/* Read More */}
				<div className="mt-4 flex items-center text-sm font-medium text-primary group-hover:underline">
					Read more
					<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
				</div>
			</div>
		</div>
	);
};

export default NewsCard;
