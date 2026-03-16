import type { ContentFormData } from '../types';
import { Calendar, HelpCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentPreviewProps {
  content: ContentFormData | undefined;
}

export const ContentPreview = ({ content }: ContentPreviewProps) => {
  if (!content) return null;

  return (
    <div className="space-y-24 bg-white rounded-[2rem] border border-border-light shadow-soft overflow-hidden pb-20">
      {/* Hero Preview */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {content.hero.imageUrl && (
          <div className="absolute inset-0">
            <img 
              src={content.hero.imageUrl} 
              alt="Hero Backdrop" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white" />
          </div>
        )}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-2xl">
            {content.hero.heading}
          </h1>
          <p className="text-xl md:text-2xl font-medium text-white/90 drop-shadow-md">
            {content.hero.subheading}
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <div className="px-8 py-4 bg-primary-600 text-white rounded-full font-black shadow-lg">Nominate Now</div>
            <div className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-black">Learn More</div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="px-8 lg:px-20 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/3">
            <h2 className="text-4xl font-black text-text-primary tracking-tight">The Vision</h2>
            <div className="h-2 w-20 bg-primary-500 rounded-full mt-4" />
          </div>
          <div className="lg:w-2/3">
            <div
              className="prose prose-lg prose-primary max-w-none text-text-secondary leading-relaxed font-medium"
              dangerouslySetInnerHTML={{
                __html: content.about.text || '<p>About narrative goes here...</p>',
              }}
            />
          </div>
        </div>
      </section>

      {/* Timeline Preview */}
      <section className="px-8 lg:px-20 bg-bg-tertiary/30 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-widest ring-1 ring-purple-100">
              <Calendar size={14} /> Roadmap
            </div>
            <h2 className="text-4xl font-black text-text-primary tracking-tight">{content.timeline.heading}</h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border-light hidden md:block" />
            
            <div className="space-y-12 relative">
              {content.timeline.events.map((event, idx) => (
                <div key={idx} className={cn(
                  "flex flex-col md:flex-row items-center gap-8",
                  idx % 2 === 0 ? "md:flex-row-reverse" : ""
                )}>
                  <div className="flex-1 md:text-right space-y-2">
                    {idx % 2 !== 0 && (
                      <div className="md:text-left space-y-2">
                         <span className="text-sm font-black text-purple-600">{event.date}</span>
                         <h3 className="text-xl font-black text-text-primary">{event.title}</h3>
                         <p className="text-sm text-text-tertiary font-medium">{event.description}</p>
                      </div>
                    )}
                    {idx % 2 === 0 && (
                      <div className="md:text-right space-y-2">
                         <span className="text-sm font-black text-purple-600">{event.date}</span>
                         <h3 className="text-xl font-black text-text-primary">{event.title}</h3>
                         <p className="text-sm text-text-tertiary font-medium">{event.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white border-4 border-purple-500 shadow-lg relative z-10 flex items-center justify-center shrink-0">
                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                  </div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Preview */}
      <section className="px-8 lg:px-20">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <h2 className="text-2xl font-black text-text-primary tracking-tight uppercase opacity-50">{content.sponsors.heading}</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {content.sponsors.logos.map((logo, idx) => (
              <img 
                key={idx} 
                src={logo.imageUrl} 
                alt={logo.name} 
                className="h-10 md:h-14 object-contain"
                title={logo.name}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Guide Preview */}
      <section className="px-8 lg:px-20 bg-bg-secondary py-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
              <HelpCircle size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-text-primary tracking-tight">{content.guide.heading}</h2>
              <p className="text-text-tertiary font-bold">Guidelines for the awards</p>
            </div>
          </div>

          <div className="grid gap-6">
            {content.guide.sections.map((section, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-border-light shadow-soft-sm hover:shadow-soft transition-all duration-300 flex gap-6">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-1" size={24} />
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-text-primary">{section.title}</h3>
                  <p className="text-text-secondary font-medium leading-relaxed">{section.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Note */}
      <footer className="px-8 lg:px-20 text-center">
        <p className="text-text-tertiary text-xs font-bold bg-bg-tertiary inline-block px-6 py-2 rounded-full border border-border-light">
          Official 2024 Creative Awards Portal Mockup
        </p>
      </footer>
    </div>
  );
};
