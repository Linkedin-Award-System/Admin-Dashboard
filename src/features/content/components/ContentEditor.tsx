import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { contentSchema, validateImageUrls, type ContentSchemaType } from '../schemas/content-schema';
import { useUpdateContent } from '../hooks/use-content';
import { useState, useEffect, type RefObject } from 'react';
import { Plus, Trash2, GripVertical, Save, AlertCircle, Info, Calendar, Heart, HelpCircle } from 'lucide-react';

interface ContentEditorProps {
  initialData?: ContentSchemaType;
  activeSection: 'hero' | 'about' | 'timeline' | 'sponsors' | 'guide';
  onSuccess?: () => void;
  submitRef?: RefObject<HTMLButtonElement | null>;
}

export const ContentEditor = ({ initialData, activeSection, onSuccess, submitRef }: ContentEditorProps) => {
  const [imageValidationErrors, setImageValidationErrors] = useState<string[]>([]);
  const [isValidatingImages, setIsValidatingImages] = useState(false);
  const updateContent = useUpdateContent();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<ContentSchemaType>({
    resolver: zodResolver(contentSchema),
    defaultValues: initialData,
  });

  // Field Arrays for complex sections
  const { fields: timelineFields, append: appendEvent, remove: removeEvent } = useFieldArray({
    control,
    name: "timeline.events"
  });

  const { fields: sponsorFields, append: appendSponsor, remove: removeSponsor } = useFieldArray({
    control,
    name: "sponsors.logos"
  });

  const { fields: guideFields, append: appendGuide, remove: removeGuide } = useFieldArray({
    control,
    name: "guide.sections"
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ContentSchemaType) => {
    setIsValidatingImages(true);
    setImageValidationErrors([]);
    
    // We only validate hero image for now in this helper
    const imageValidation = await validateImageUrls(data);
    setIsValidatingImages(false);
    
    if (!imageValidation.valid) {
      setImageValidationErrors(imageValidation.errors);
      return;
    }

    try {
      await updateContent.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Dynamic Section Rendering */}
      <div className="min-h-[400px]">
        {activeSection === 'hero' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                <Save size={20} />
              </div>
              <h2 className="text-xl font-bold text-text-primary">Hero Configuration</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="hero-heading" className="text-xs font-black uppercase tracking-wider text-text-tertiary">Main Heading</Label>
                <Input
                  id="hero-heading"
                  {...register('hero.heading')}
                  placeholder="Enter high-impact heading"
                  className="rounded-xl border-border-light focus:ring-primary-500"
                />
                {errors.hero?.heading && (
                  <p className="text-xs font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.hero.heading.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="hero-image" className="text-xs font-black uppercase tracking-wider text-text-tertiary">Background/Feature Image URL</Label>
                <Input
                  id="hero-image"
                  {...register('hero.imageUrl')}
                  placeholder="https://images.unsplash.com/..."
                  className="rounded-xl border-border-light focus:ring-primary-500"
                />
                {errors.hero?.imageUrl && (
                  <p className="text-xs font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.hero.imageUrl.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 space-y-3">
                <Label htmlFor="hero-subheading" className="text-xs font-black uppercase tracking-wider text-text-tertiary">Subheading / Description</Label>
                <textarea
                  id="hero-subheading"
                  {...register('hero.subheading')}
                  placeholder="Enter supporting messaging..."
                  className="w-full min-h-[120px] p-4 rounded-xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm"
                />
                {errors.hero?.subheading && (
                  <p className="text-xs font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.hero.subheading.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Info size={20} />
              </div>
              <h2 className="text-xl font-bold text-text-primary">About the Awards</h2>
            </div>

            <div className="space-y-3">
              <Label htmlFor="about-text" className="text-xs font-black uppercase tracking-wider text-text-tertiary">Detailed Narrative (HTML Supported)</Label>
              <textarea
                id="about-text"
                {...register('about.text')}
                placeholder="Write the award's mission, values, and impact story..."
                className="w-full min-h-[400px] p-6 rounded-2xl border border-border-light focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm leading-relaxed"
              />
              <div className="flex items-center gap-2 text-xs text-text-tertiary font-bold bg-bg-tertiary p-3 rounded-xl border border-border-light">
                <AlertCircle size={14} className="text-blue-500" />
                Advanced users: You can use HTML tags (&lt;strong&gt;, &lt;br&gt;, &lt;ul&gt;) for custom layout control.
              </div>
              {errors.about?.text && (
                <p className="text-xs font-bold text-red-500">{errors.about.text.message}</p>
              )}
            </div>
          </div>
        )}

        {activeSection === 'timeline' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                  <Calendar size={20} />
                </div>
                <h2 className="text-xl font-bold text-text-primary">Award Roadmap</h2>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299' }}
                className="hover:bg-primary-50 transition-all duration-200"
                onClick={() => appendEvent({ date: '', title: '', description: '' })}
              >
                <Plus size={16} /> Add Event
              </Button>
            </div>

            <div className="space-y-3 mb-8">
              <Label className="text-xs font-black uppercase tracking-wider text-text-tertiary">Timeline Header</Label>
              <Input
                {...register('timeline.heading')}
                placeholder="e.g., Road to Victory 2024"
                className="rounded-xl border-border-light"
              />
            </div>

            <div className="space-y-4">
              {timelineFields.map((field, index) => (
                <div key={field.id} className="group flex items-start gap-4 bg-white p-6 rounded-2xl border border-border-light shadow-soft-sm hover:shadow-soft transition-all duration-300">
                  <div className="mt-2 text-text-quaternary cursor-grab group-active:cursor-grabbing">
                    <GripVertical size={20} />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-wider text-text-tertiary">Date Label</Label>
                      <Input 
                        {...register(`timeline.events.${index}.date`)} 
                        placeholder="Jan 15, 2024"
                        className="rounded-lg text-xs"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-wider text-text-tertiary">Event Title</Label>
                      <Input 
                        {...register(`timeline.events.${index}.title`)} 
                        placeholder="Submission Deadline"
                        className="rounded-lg text-xs font-bold"
                      />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-wider text-text-tertiary">Brief Description</Label>
                      <textarea
                        {...register(`timeline.events.${index}.description`)}
                        placeholder="Tell participants what happens at this stage..."
                        className="w-full min-h-[60px] p-3 rounded-lg border border-border-light focus:outline-none focus:ring-1 focus:ring-primary-500 text-xs font-medium"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEvent(index)}
                    className="mt-2 p-2 text-text-quaternary hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'sponsors' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
                  <Heart size={20} />
                </div>
                <h2 className="text-xl font-bold text-text-primary">Our Partners</h2>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299' }}
                className="hover:bg-primary-50 transition-all duration-200"
                onClick={() => appendSponsor({ name: '', imageUrl: '', url: '' })}
              >
                <Plus size={16} /> Add Sponsor
              </Button>
            </div>

            <div className="space-y-3 mb-8">
              <Label className="text-xs font-black uppercase tracking-wider text-text-tertiary">Sponsorship Heading</Label>
              <Input
                {...register('sponsors.heading')}
                placeholder="e.g., Proudly Supported By"
                className="rounded-xl border-border-light"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sponsorFields.map((field, index) => (
                <div key={field.id} className="bg-white p-5 rounded-2xl border border-border-light shadow-soft-sm hover:shadow-soft transition-all duration-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-primary-600 uppercase tracking-tighter bg-primary-50 px-2 py-0.5 rounded">Partner #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeSponsor(index)}
                      className="text-text-quaternary hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-wider text-text-tertiary">Organization Name</Label>
                      <Input {...register(`sponsors.logos.${index}.name`)} placeholder="Company Name" className="rounded-lg h-9 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-wider text-text-tertiary">Logo URL</Label>
                      <Input {...register(`sponsors.logos.${index}.imageUrl`)} placeholder="https://..." className="rounded-lg h-9 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-wider text-text-tertiary">Website Link (Optional)</Label>
                      <Input {...register(`sponsors.logos.${index}.url`)} placeholder="https://..." className="rounded-lg h-9 text-xs" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'guide' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                  <HelpCircle size={20} />
                </div>
                <h2 className="text-xl font-bold text-text-primary">Participation Guide</h2>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                style={{ backgroundColor: '#ffffff', color: '#085299', border: '2px solid #085299' }}
                className="hover:bg-primary-50 transition-all duration-200"
                onClick={() => appendGuide({ title: '', content: '' })}
              >
                <Plus size={16} /> Add Step
              </Button>
            </div>

            <div className="space-y-3 mb-8">
              <Label className="text-xs font-black uppercase tracking-wider text-text-tertiary">Guide Master Heading</Label>
              <Input
                {...register('guide.heading')}
                placeholder="e.g., How to Participate"
                className="rounded-xl border-border-light"
              />
            </div>

            <div className="space-y-6">
              {guideFields.map((field, index) => (
                <div key={field.id} className="bg-bg-tertiary/40 border-l-4 border-emerald-500 p-6 rounded-r-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-text-primary">Section {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeGuide(index)}
                      className="text-text-quaternary hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-text-tertiary">Heading / Title</Label>
                    <Input {...register(`guide.sections.${index}.title`)} placeholder="e.g., Eligibility Criteria" className="rounded-xl bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-text-tertiary">Body Content</Label>
                    <textarea
                      {...register(`guide.sections.${index}.content`)}
                      placeholder="Explain the details clearly..."
                      className="w-full min-h-[100px] p-4 rounded-xl border border-border-light focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm font-medium bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Persistence Controls */}
      <div className="pt-8 border-t border-border-light flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          {isDirty ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl text-amber-700 text-xs font-bold ring-1 ring-amber-200 animate-pulse">
              <Save size={14} /> Unsaved changes in draft
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl text-emerald-700 text-xs font-bold ring-1 ring-emerald-200">
              <Save size={14} /> Content is up to date
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {imageValidationErrors.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 mr-4">
              <AlertCircle size={16} /> Asset Validation Failed
            </div>
          )}
          <Button
            type="submit"
            ref={submitRef}
            variant="default"
            size="lg"
            style={{ backgroundColor: '#085299', color: '#ffffff' }}
            disabled={!isDirty || updateContent.isPending || isValidatingImages}
            loading={updateContent.isPending || isValidatingImages}
          >
            {isValidatingImages ? 'Validating Assets...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
};
