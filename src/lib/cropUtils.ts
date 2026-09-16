import { Crop } from 'react-image-crop';

export const calculateAICrop = (
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number = 3 / 4
): Crop => {
  // A standard heuristic: A face is usually in the upper center third of the photo.
  // We want to calculate a crop box that fits the aspect ratio, 
  // scaled down relative to the image size, and positioned appropriately.

  // Calculate target crop width and height.
  // Let's assume the crop should be 60% of the image's shortest dimension.
  const scale = 0.3;

  let cropWidth: number;
  let cropHeight: number;

  if (imageWidth / imageHeight > aspectRatio) {
    // Image is wider than the aspect ratio
    cropHeight = imageHeight * scale;
    cropWidth = cropHeight * aspectRatio;
  } else {
    // Image is taller than the aspect ratio
    cropWidth = imageWidth * scale;
    cropHeight = cropWidth / aspectRatio;
  }

  // 1. Find the crop center points. 
  // Horizontal center is the middle of the image.
  // Vertical center is the midpoint of the upper third (1/6 of the image height).
  const cx = imageWidth / 2;
  const cy = imageHeight / 6;

  // 2. Check if the crop box violates the image boundaries when centered at (cx, cy).
  // The max width/height we can have while keeping it centered is 2x the distance to the closest edge.
  const maxCenteredWidth = 2 * Math.min(cx, imageWidth - cx);
  const maxCenteredHeight = 2 * Math.min(cy, imageHeight - cy);

  // 3. Shrink the crop box if necessary, respecting the aspect ratio
  if (cropWidth > maxCenteredWidth || cropHeight > maxCenteredHeight) {
    const scaleFactor = Math.min(
      maxCenteredWidth / cropWidth,
      maxCenteredHeight / cropHeight
    );
    cropWidth *= scaleFactor;
    cropHeight *= scaleFactor;
  }

  // 4. Get final top-left coordinates
  const x = cx - cropWidth / 2;
  const y = cy - cropHeight / 2;

  return {
    unit: 'px',
    x,
    y,
    width: cropWidth,
    height: cropHeight,
  };
};

export const exportCroppedImage = async (
  imageElement: HTMLImageElement,
  crop: Crop,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg'
) => {
  const extension = format === 'image/png' ? 'png' : 'jpg';
  const fileName = `headshot-crop.${extension}`;
  const canvas = document.createElement('canvas');
  const scaleX = imageElement.naturalWidth / imageElement.width;
  const scaleY = imageElement.naturalHeight / imageElement.height;
  const pixelRatio = window.devicePixelRatio;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Set actual size in memory (scaled to account for extra pixel density).
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  ctx.drawImage(
    imageElement,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  return new Promise<void>((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }

        // Use modern File System Access API if supported (Chrome/Edge/Opera)
        if ('showSaveFilePicker' in window) {
          try {
            const handle = await (window as any).showSaveFilePicker({
              suggestedName: fileName,
              types: [{
                description: 'Image',
                accept: { [format]: [`.${extension}`] },
              }],
            });
            // This waits for the user to click "Save" in the dialog
            const writable = await handle.createWritable();
            // This waits for the file to actually finish writing to disk
            await writable.write(blob);
            await writable.close();
            resolve();
            return;
          } catch (err: any) {
            if (err.name === 'AbortError') {
              reject(new Error('ABORTED'));
            } else {
              reject(err);
            }
            return;
          }
        }

        // Fallback for browsers that don't support showSaveFilePicker (Safari, Firefox)
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();

        URL.revokeObjectURL(url);
        resolve();
      },
      format,
      1 // quality
    );
  });
};
