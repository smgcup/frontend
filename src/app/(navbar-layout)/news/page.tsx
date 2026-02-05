import React from 'react';
import NewsView from '@/domains/news/NewsView';
import { getNewsPageData } from '@/domains/news/ssr/getNewsPageData';

const page = async () => {
  const { news, error } = await getNewsPageData();

  return <NewsView news={news} />;
};

export default page;
