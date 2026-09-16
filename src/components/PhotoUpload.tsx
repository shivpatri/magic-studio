import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, FileWarning } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoSelect: (file: File, dataUrl: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function PhotoUpload({ onPhotoSelect }: PhotoUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);

      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError('File size must be less than 10 MB.');
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
        } else {
          setError(rejection.errors[0]?.message || 'An error occurred during upload.');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            onPhotoSelect(file, reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [onPhotoSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
  });

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 ease-in-out
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-accent/50'}
          ${error ? 'border-destructive/50 bg-destructive/5' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="p-4 rounded-full bg-primary/10 mb-4 text-primary">
          <UploadCloud size={40} />
        </div>
        <h3 className="text-xl font-semibold mb-2">Upload your photo</h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm">
          Drag and drop your image here, or click to browse. Supported formats: JPEG, PNG, WebP (Max 10MB).
        </p>

        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors pointer-events-none">
          Select Photo
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-3">
          <FileWarning size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
