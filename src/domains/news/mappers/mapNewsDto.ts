import type { NewsCreate, NewsUpdate } from '@/domains/news/contracts';
import type { CreateNewsDto, UpdateNewsDto } from '@/graphql';

export const mapNewsCreateToDto = (input: NewsCreate): CreateNewsDto => {
  return {
    title: input.title,
    content: input.content,
    imageUrl: input.imageUrl,
    category: input.category,
  };
};

export const mapNewsUpdateToDto = (input: NewsUpdate): UpdateNewsDto => {
  return {
    title: input.title,
    content: input.content,
    imageUrl: input.imageUrl,
    category: input.category,
  };
};


