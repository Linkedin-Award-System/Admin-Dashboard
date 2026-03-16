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
    timeline: {
      heading: string;
      events: {
        date: string;
        title: string;
        description: string;
      }[];
    };
    sponsors: {
      heading: string;
      logos: {
        name: string;
        imageUrl: string;
        url?: string;
      }[];
    };
    guide: {
      heading: string;
      sections: {
        title: string;
        content: string;
      }[];
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
  timeline: {
    heading: string;
    events: {
      date: string;
      title: string;
      description: string;
    }[];
  };
  sponsors: {
    heading: string;
    logos: {
      name: string;
      imageUrl: string;
      url?: string;
    }[];
  };
  guide: {
    heading: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
}
