import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Link as LinkIcon, X, Check, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { getSupabaseClient } from '../lib/supabase';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  helperText?: string;
  maxDimension?: number;
  aspectRatio?: 'landscape' | 'wide' | 'square' | 'auto';
  placeholderUrl?: string;
  recommendedSize?: string;
}

/**
 * Optimizes an image file on the client using HTML5 Canvas to produce
 * a lightweight, high-resolution JPEG/WebP data URL or uploads to Supabase Storage if available.
 */
async function processAndUploadImage(
  file: File,
  maxDimension = 1400
): Promise<string> {
  // 1. Read file as Image
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // 2. Compress and resize using Canvas
  const optimizedDataUrl = await new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export as optimized WebP or JPEG
      try {
        const webp = canvas.toDataURL('image/webp', 0.85);
        if (webp.startsWith('data:image/webp')) {
          resolve(webp);
          return;
        }
      } catch {
        // Fallback to JPEG
      }
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });

  // 3. Optional: Try uploading to Supabase Storage if bucket exists
  try {
    const client = getSupabaseClient();
    if (client && client.storage) {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      
      const { data, error } = await client.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data?.path) {
        const { data: publicData } = client.storage.from('images').getPublicUrl(data.path);
        if (publicData?.publicUrl) {
          return publicData.publicUrl;
        }
      }
    }
  } catch (storageErr) {
    console.info('Supabase storage fallback to optimized data URL:', storageErr);
  }

  // Fallback to the optimized data URL (safe for Supabase Postgres TEXT columns)
  return optimizedDataUrl;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label,
  helperText,
  maxDimension = 1400,
  aspectRatio = 'landscape',
  placeholderUrl,
  recommendedSize,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const resultUrl = await processAndUploadImage(file, maxDimension);
      onChange(resultUrl);
      setUrlInput(resultUrl);
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    setIsProcessing(true);
    try {
      const resultUrl = await processAndUploadImage(file, maxDimension);
      onChange(resultUrl);
      setUrlInput(resultUrl);
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUrlApply = () => {
    onChange(urlInput.trim());
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
  };

  const isDataUrl = value?.startsWith('data:');

  const aspectClass =
    aspectRatio === 'wide'
      ? 'aspect-[21/9]'
      : aspectRatio === 'square'
      ? 'aspect-square max-w-[200px]'
      : 'aspect-[16/9]';

  return (
    <div className="space-y-2.5">
      {/* Header with Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-semibold text-amber-200">
          {label}
        </label>
        <div className="flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-amber-400/20 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeMode === 'upload'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <UploadCloud className="h-3 w-3" />
            <span>رفع من الجهاز</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeMode === 'url'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <LinkIcon className="h-3 w-3" />
            <span>رابط خارجي</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Mode 1: Upload from Device */}
      {activeMode === 'upload' && (
        <div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center group ${
              isDragging
                ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
                : isProcessing
                ? 'border-amber-400/40 bg-slate-950/60 cursor-wait'
                : 'border-amber-400/30 hover:border-amber-400/70 bg-slate-950 hover:bg-slate-900/60'
            }`}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2 py-3">
                <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
                <span className="text-xs font-bold text-amber-200">
                  جاري ضغط وتجهيز الصورة بأعلى دقة...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-2">
                <div className="p-3 rounded-2xl bg-amber-400/10 text-amber-400 group-hover:scale-110 group-hover:bg-amber-400/20 transition-all border border-amber-400/30">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-100 block">
                    اضغط هنا لاختيار صورة من هاتفك أو جهازك
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    يدعم جميع صيغ الصور (JPG, PNG, WebP) مع ضغط تلقائي ذكي
                  </span>
                </div>
                {recommendedSize && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 border border-amber-400/20 text-[10px] text-amber-300 font-mono">
                    <Sparkles className="h-2.5 w-2.5" />
                    المقاس الموصى به: {recommendedSize}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Direct URL Input */}
      {activeMode === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              dir="ltr"
              placeholder="https://example.com/photo.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleUrlApply();
                }
              }}
              className="flex-1 rounded-xl border border-amber-400/25 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 font-mono text-left focus:border-amber-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleUrlApply}
              className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition-all shadow-md shrink-0"
            >
              تطبيق الرابط
            </button>
          </div>
          {placeholderUrl && (
            <button
              type="button"
              onClick={() => {
                onChange(placeholderUrl);
                setUrlInput(placeholderUrl);
              }}
              className="text-[11px] text-amber-300/80 hover:text-amber-200 underline inline-flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              استعادة الصورة الافتراضية الأصلية
            </button>
          )}
        </div>
      )}

      {/* Live Preview Box if an image is selected */}
      {value && (
        <div className="relative rounded-2xl border border-amber-400/30 bg-slate-950/80 p-3 overflow-hidden shadow-lg">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <ImageIcon className="h-3.5 w-3.5 text-amber-400" />
              <span>معاينة الصورة الحالية</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30 text-[10px] text-amber-300 font-medium">
                {isDataUrl ? 'صورة مرفوعة من الجهاز' : 'رابط ويب خارجي'}
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                title="إزالة الصورة"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className={`relative w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-800 ${aspectClass}`}>
            <img
              src={value}
              alt="معاينة"
              className="h-full w-full object-cover object-center"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  placeholderUrl || 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
              <Check className="h-3 w-3" />
              <span>جاهزة ومثبتة للحفظ</span>
            </div>
          </div>
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {helperText}
        </p>
      )}
    </div>
  );
};
