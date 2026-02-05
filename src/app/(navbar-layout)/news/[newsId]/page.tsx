import NewsDetailView from '@/domains/news/NewsDetailView';
import { getNewsDetail } from '@/domains/news/ssr/getNewsDetail';

// ISR: Revalidate every 10 minutes
export const revalidate = 600;

type PageProps = {
  params: Promise<{ newsId: string }>;
};

const NewsDetailPage = async ({ params }: PageProps) => {
  const { newsId } = await params;
  const { news } = await getNewsDetail(newsId);

  return <NewsDetailView news={news} />;
};

export default NewsDetailPage;
