import { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import {
  ContentEditor,
  ImageManager,
  ContentPreview,
  VersionHistory,
  useCurrentContent,
  type LandingContent,
  type ContentFormData,
} from '@/features/content';

export const ContentPage = () => {
  const { data: currentContent, isLoading } = useCurrentContent();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'history' | 'images'>('edit');
  const [previewData, setPreviewData] = useState<ContentFormData | null>(null);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <p className="text-gray-500">Loading content...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Landing Page Content Management</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Edit and manage the content displayed on the public-facing landing page
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-8 min-w-max">
            <button
              onClick={() => setActiveTab('edit')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                activeTab === 'edit'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeTab === 'edit' ? 'page' : undefined}
            >
              Edit Content
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                activeTab === 'preview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeTab === 'preview' ? 'page' : undefined}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                activeTab === 'images'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeTab === 'images' ? 'page' : undefined}
            >
              Image Manager
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeTab === 'history' ? 'page' : undefined}
            >
              Version History
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-4 sm:mt-6">
          {activeTab === 'edit' && (
            <ContentEditor
              initialData={currentContent?.content}
              onSuccess={() => {
                setActiveTab('history');
              }}
            />
          )}

          {activeTab === 'preview' && (
            <div>
              {previewData ? (
                <ContentPreview content={previewData} />
              ) : currentContent ? (
                <ContentPreview content={currentContent.content} />
              ) : (
                <p className="text-gray-500">No content available to preview</p>
              )}
            </div>
          )}

          {activeTab === 'images' && <ImageManager />}

          {activeTab === 'history' && (
            <VersionHistory
              onVersionSelect={(version: LandingContent) => {
                setPreviewData(version.content);
                setActiveTab('preview');
              }}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ContentPage;
