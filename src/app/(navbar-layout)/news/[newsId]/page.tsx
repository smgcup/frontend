import NewsDetailView from '@/domains/news/NewsDetailView';
import { getNewsDetail } from '@/domains/news/ssr/getNewsDetail';

type PageProps = {
	params: Promise<{ newsId: string }>;
};

const page = async ({ params }: PageProps) => {
	const { newsId } = await params;
	const { news } = await getNewsDetail(newsId);

	return <NewsDetailView news={news} />;
};

export default page;
