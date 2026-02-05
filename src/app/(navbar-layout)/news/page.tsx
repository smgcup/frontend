import React from 'react';
import NewsView from '@/domains/news/NewsView';
import { getNewsPageData } from '@/domains/news/ssr/getNewsPageData';

// ISR: Revalidate every 10 minutes
export const revalidate = 600;

const NewsPage = async () => {
  const { news } = await getNewsPageData();
  return <NewsView news={news} />;
};

export default NewsPage;
