export type News = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  imageUrl: string;
  category: string;
};

export type NewsCreate = {
  title: string;
  content: string;
  imageUrl: string;
  category: string;
};

export type NewsUpdate = {
  title: string;
  content: string;
  imageUrl: string;
  category: string;
};
