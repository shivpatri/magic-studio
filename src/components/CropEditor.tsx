import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { calculateAICrop, exportCroppedImage } from '@/lib/cropUtils';
import { Download, RefreshCcw, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface CropEditorProps {
  imageSrc: string;
  onCancel: () => void;
}

const ASPECT_RATIOS = [
  { label: '3:4', value: 3 / 4 },
  { label: '4:5', value: 4 / 5 },
  { label: '1:1', value: 1 },
  { label: 'Free', value: undefined },
];

export function CropEditor({ imageSrc, onCancel }: CropEditorProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(3 / 4);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');

  // Initialize AI crop when image loads
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aiCrop = calculateAICrop(width, height, aspect || (3 / 4));
    setCrop(aiCrop);
  };

  const handleResetToAI = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const aiCrop = calculateAICrop(width, height, aspect || (3 / 4));
      setCrop(aiCrop);
    }
  };

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (imgRef.current && newAspect) {
      const { width, height } = imgRef.current;
      // Recenter crop with new aspect ratio if needed, or re-run AI suggestion
      const aiCrop = calculateAICrop(width, height, newAspect);
      setCrop(aiCrop);
    }
  };

  const handleExport = async () => {
    if (!imgRef.current || !completedCrop) {
      toast.error('Please select a crop area first.');
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading('Exporting your headshot...');

    try {
      await exportCroppedImage(imgRef.current, completedCrop, exportFormat);
      toast.success('Image exported successfully!', { id: toastId });
    } catch (err: any) {
      if (err.message === 'ABORTED') {
        toast.dismiss(toastId);
        return;
      }
      console.error(err);
      toast.error('Failed to export image.', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-6">
      <div className="flex-1 flex flex-col bg-card border border-border rounded-xl p-4 lg:p-6 overflow-hidden shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ImageIcon size={24} className="text-primary" />
            Adjust Headshot
          </h2>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Cancel editing"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative flex-1 bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            className="max-h-[70vh] w-auto h-auto object-contain"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              onLoad={onImageLoad}
              className="max-h-[70vh] w-auto h-auto object-contain select-none"
            />
          </ReactCrop>
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Crop Controls</h3>
          
          <button
            onClick={handleResetToAI}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors mb-6 text-sm font-medium"
          >
            <RefreshCcw size={16} />
            Reset to AI Suggestion
          </button>

          <div className="space-y-3">
            <label className="text-sm font-medium">Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.label}
                  onClick={() => handleAspectChange(ratio.value)}
                  className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                    aspect === ratio.value
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border hover:border-border/80 hover:bg-accent text-muted-foreground'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <label className="text-sm font-medium">Export Format</label>
            <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-border">
              <button
                onClick={() => setExportFormat('image/jpeg')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  exportFormat === 'image/jpeg'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                JPEG
              </button>
              <button
                onClick={() => setExportFormat('image/png')}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  exportFormat === 'image/png'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                PNG
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
           <button
            onClick={handleExport}
            disabled={!completedCrop || isExporting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary/20"
          >
            <Download size={18} />
            {isExporting ? 'Exporting...' : 'Export Cropped Image'}
          </button>
        </div>
      </div>
    </div>
  );
}
