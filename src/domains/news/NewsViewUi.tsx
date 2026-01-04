import React from 'react';
import { News } from './contracts';
import NewsCard from './components/NewsCard';
import Link from 'next/link';
type NewsViewUiProps = {
	news: News[];
};
const NewsViewUi = ({ news }: NewsViewUiProps) => {
	return (
		<div className="container mx-auto max-w-7xl py-16">
			<h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-12">
				News
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{news.map(news => (
					<Link key={news.id} href={`/news/${news.id}`}>
						<NewsCard news={news} />
					</Link>
				))}
			</div>
		</div>
	);
};

export default NewsViewUi;
