import React from 'react';
import NewsViewUi from './NewsViewUi';
import { News } from './contracts';
type NewsViewProps = {
	news: News[];
};
const NewsView = ({ news }: NewsViewProps) => {
	return <NewsViewUi news={news} />;
};

export default NewsView;
