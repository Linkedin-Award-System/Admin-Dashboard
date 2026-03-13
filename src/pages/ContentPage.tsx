import { useState } from 'react';
import { Layout } from '@/shared/components/layout';
import {
  ContentEditor,
  ImageManager,
  ContentPreview,
  VersionHistory,
  useCurrentContent,
} from '@/features/content';
import { 
  Sparkles, 
  Info, 
  Calendar, 
  Heart, 
  HelpCircle,
  Eye, 
  Image as ImageIcon, 
  History as HistoryIcon, 
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/design-system/components/Button';
import { PageHeader } from '@/shared/design-system/patterns/PageHeader';

export const ContentPage = () => {
  const { data: currentContent, isLoading } = useCurrentContent();
  const [activeSection, setActiveSection] = useState<'hero' | 'about' | 'timeline' | 'sponsors' | 'guide'>('hero');
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAssets, setShowAssets] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto" />
            <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
          </div>
        </div>
      </Layout>
    );
  }

  const sections = [
    { id: 'hero', label: 'Hero', icon: Sparkles, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'about', label: 'About', icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'timeline', label: 'Timeline', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'sponsors', label: 'Sponsors', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'guide', label: 'Guide', icon: HelpCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  // Check if section has content
  const hasContent = (sectionId: string) => {
    if (!currentContent?.content) return false;
    
    switch (sectionId) {
      case 'hero':
        return !!(currentContent.content.hero?.heading && currentContent.content.hero?.subheading);
      case 'about':
        return !!(currentContent.content.about?.text);
      case 'timeline':
        return !!(currentContent.content.timeline?.events && currentContent.content.timeline.events.length > 0);
      case 'sponsors':
        return !!(currentContent.content.sponsors?.logos && currentContent.content.sponsors.logos.length > 0);
      case 'guide':
        return !!(currentContent.content.guide?.sections && currentContent.content.guide.sections.length > 0);
      default:
        return false;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 sm:px-12 py-8 sm:py-12 space-y-4 max-w-7xl">
        {/* Page Header */}
        <PageHeader
          title="Public Presence"
          subtitle="Curate and publish the landing page experience"
          actions={
            <div className="flex flex-wrap items-center gap-4">
              <Button 
                variant="secondary"
                icon={<ImageIcon size={18} />}
                onClick={() => setShowAssets(true)}
                style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299' }}
                className="hover:bg-primary-50 transition-all duration-200"
              >
                Assets
              </Button>
              <Button 
                variant="secondary"
                icon={<HistoryIcon size={18} />}
                onClick={() => setShowHistory(true)}
                style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299' }}
                className="hover:bg-primary-50 transition-all duration-200"
              >
                History
              </Button>
              <Button 
                variant="secondary"
                icon={<Eye size={18} />}
                onClick={() => setShowPreview(true)}
                style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299' }}
                className="hover:bg-primary-50 transition-all duration-200"
              >
                Live Preview
              </Button>
              <Button 
                variant="primary"
                icon={<Save size={18} />}
                style={{ backgroundColor: '#085299', color: '#ffffff' }}
              >
                Save
              </Button>
            </div>
          }
        />

        {/* Content Navigation & Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar Navigation */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const isFilled = hasContent(section.id);
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={cn(
                    "flex-1 lg:flex-none flex items-center gap-3 px-5 py-4 rounded-lg text-sm font-medium transition-all duration-200 group whitespace-nowrap border"
                  )}
                  style={
                    isActive || isFilled
                      ? { backgroundColor: '#085299', color: '#ffffff', borderColor: '#085299' }
                      : { backgroundColor: '#ffffff', color: '#374151', borderColor: '#e5e7eb' }
                  }
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-colors duration-200",
                    isActive || isFilled ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200"
                  )}>
                    <Icon size={18} className={isActive || isFilled ? "text-white" : section.color} />
                  </div>
                  {section.label}
                </button>
              );
            })}
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
              <div className="p-6">
                <ContentEditor
                  initialData={currentContent?.content}
                  activeSection={activeSection}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals/Overlays */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full h-full rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="text-primary-600" size={20} />
                <h2 className="text-lg font-semibold">Landing Page Preview</h2>
              </div>
              <Button variant="ghost" onClick={() => setShowPreview(false)}>Close Preview</Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 lg:p-12 bg-gray-50">
              <ContentPreview content={currentContent?.content as any} />
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-gray-900">
                <HistoryIcon size={20} className="text-primary-600" />
                <h2 className="text-lg font-semibold">Version Timeline</h2>
              </div>
              <Button variant="ghost" onClick={() => setShowHistory(false)}>Close</Button>
            </div>
            <VersionHistory />
          </div>
        </div>
      )}

      {showAssets && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-gray-900">
                <ImageIcon size={20} className="text-primary-600" />
                <h2 className="text-lg font-semibold">Asset Manager</h2>
              </div>
              <Button variant="ghost" onClick={() => setShowAssets(false)}>Close</Button>
            </div>
            <ImageManager />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ContentPage;
