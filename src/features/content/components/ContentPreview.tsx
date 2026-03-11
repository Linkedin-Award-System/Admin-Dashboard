import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { ContentFormData } from '../types';

interface ContentPreviewProps {
  content: ContentFormData;
}

export const ContentPreview = ({ content }: ContentPreviewProps) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-12">
            {/* Hero Section Preview */}
            <section className="relative">
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  {content.hero.heading || 'Hero Heading'}
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {content.hero.subheading || 'Hero Subheading'}
                </p>
                {content.hero.imageUrl && (
                  <div className="mt-8">
                    <img
                      src={content.hero.imageUrl}
                      alt="Hero"
                      className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect fill="%23ddd" width="800" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* About Section Preview */}
            <section className="bg-gray-50 p-8 rounded-lg">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">About</h2>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: content.about.text || '<p>About text will appear here</p>',
                  }}
                />
              </div>
            </section>

            {/* Categories Section Preview */}
            <section>
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {content.categories.heading || 'Categories Heading'}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {content.categories.description || 'Categories description'}
                </p>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>

      {/* Preview Note */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This is a preview of how the content will appear on the public landing page.
          The actual styling may vary slightly based on the public site's design.
        </p>
      </div>
    </div>
  );
};
