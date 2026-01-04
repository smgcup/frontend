import { GetNewsQuery, GetNewsByIdQuery } from '@/graphql';
import { News } from '../contracts';

export const mapNews = (news: GetNewsQuery['news'][number]): News => {
  return {
    id: news.id,
    title: news.title,
    content: news.content,
    createdAt: news.createdAt,
    imageUrl: news.imageUrl,
    category: news.category,
  };
};

export const mapNewsById = (news: GetNewsByIdQuery['newsById']): News => {
  return {
    id: news.id,
    title: news.title,
    content: news.content,
    createdAt: news.createdAt,
    imageUrl: news.imageUrl,
    category: news.category,
  };
};
