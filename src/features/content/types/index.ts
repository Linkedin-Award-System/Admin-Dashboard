export interface LandingContent {
  id: string;
  version: number;
  content: {
    hero: {
      heading: string;
      subheading: string;
      imageUrl: string;
    };
    about: {
      text: string;
    };
    categories: {
      heading: string;
      description: string;
    };
  };
  isPublished: boolean;
  createdAt: string;
  createdBy: string;
}

export interface ContentFormData {
  hero: {
    heading: string;
    subheading: string;
    imageUrl: string;
  };
  about: {
    text: string;
  };
  categories: {
    heading: string;
    description: string;
  };
}
