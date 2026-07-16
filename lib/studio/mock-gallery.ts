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
  items: [
    {
      id: "g1",
      imageUrl: "/gallery/gallery-1.jpg",
      title: "Workshop Class",
      description: "Suasana belajar addon secara offline.",
    },
    {
      id: "g2",
      imageUrl: "/gallery/gallery-2.jpg",
      title: "Mentor Session",
      description: "Mentor membimbing anak step-by-step.",
    },
    {
      id: "g3",
      imageUrl: "/gallery/gallery-3.jpg",
      title: "Project Showcase",
      description: "Anak mempresentasikan hasil project.",
    },
  ],
};

