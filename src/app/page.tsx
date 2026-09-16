'use client';

import React, { useState } from 'react';
import { PhotoUpload } from '@/components/PhotoUpload';
import { CropEditor } from '@/components/CropEditor';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<{ file: File; dataUrl: string } | null>(null);

  const handlePhotoSelect = (file: File, dataUrl: string) => {
    setSelectedImage({ file, dataUrl });
  };

  const handleCancel = () => {
    setSelectedImage(null);
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl flex flex-col">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          AI Headshot Cropper
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Upload a portrait, let our AI suggest the optimal crop, and perfectly frame your next professional headshot.
        </p>
      </header>

      <div className="flex-1 flex flex-col justify-center">
        {!selectedImage ? (
          <PhotoUpload onPhotoSelect={handlePhotoSelect} />
        ) : (
          <CropEditor 
            imageSrc={selectedImage.dataUrl} 
            onCancel={handleCancel} 
          />
        )}
      </div>
    </main>
  );
}
