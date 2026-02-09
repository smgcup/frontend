import React from 'react';
import { News } from './contracts';
import NewsCard from './components/NewsCard';
import Link from 'next/link';
import { BackButton } from '@/components/BackButton';
type NewsViewUiProps = {
  news: News[];
};
const NewsViewUi = ({ news }: NewsViewUiProps) => {
  return (
    <section className="pb-16 pt-8 px-4 sm:px-6 lg:px-8">
      <BackButton />
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          News{' '}
          <span className="text-muted-foreground font-normal text-2xl">
            ({news.length} {news.length === 1 ? 'article' : 'articles'})
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground mb-12">
          Stay updated with the latest tournament news and announcements
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((news) => (
            <Link
              key={news.id}
              href={`/news/${news.id}`}
              className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
            >
              <NewsCard news={news} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsViewUi;
