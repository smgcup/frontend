'use client';

import React from 'react';
import Image from 'next/image';
import { Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { News } from './contracts';

type NewsDetailViewUiProps = {
  news: News | null;
};

const NewsDetailViewUi = ({ news }: NewsDetailViewUiProps) => {
  if (!news) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">News article not found</h1>
        <Link href="/" className="mt-4 inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <article className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      <h1 className="mb-4 text-4xl font-bold">{news.title}</h1>

      <div className="mb-8 flex items-center gap-2 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <time dateTime={news.createdAt}>{formatDate(news.createdAt)}</time>
      </div>

      <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
        <Image src={news.imageUrl} alt={news.title} fill className="object-cover" priority />
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown>{news.content}</ReactMarkdown>
      </div>
    </article>
  );
};

export default NewsDetailViewUi;
