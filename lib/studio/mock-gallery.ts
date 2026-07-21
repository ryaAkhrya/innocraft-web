export type StudioGalleryItem = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
};

export type StudioGalleryData = {
  items: StudioGalleryItem[];
};

export const defaultStudioGalleryData: StudioGalleryData = {
  items: [],
};