import NewsDetailViewUi from './NewsDetailViewUi';
import { News } from './contracts';

type NewsDetailViewProps = {
	news: News | null;
};

const NewsDetailView = ({ news }: NewsDetailViewProps) => {
	return <NewsDetailViewUi news={news} />;
};

export default NewsDetailView;
