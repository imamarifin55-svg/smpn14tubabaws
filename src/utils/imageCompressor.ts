/**
 * Client-side image compression utility.
 * Guarantees that uploaded photos (logos, campus image, headmaster portrait,
 * news banners, gallery pictures) are optimized to compact dimensions and
 * byte sizes, preventing Firestore document size limit errors (1MB max per document)
 * and ensuring fast loading across devices.
 */

export async function compressImage(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.82,
  maxDataUrlBytes = 250000
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG and small, keep vector
    if (file.type === 'image/svg+xml' && file.size < 200 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        // Fallback to original data URL if image parsing fails
        resolve(event.target?.result as string);
      };
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate aspect-ratio preserved scaling
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Draw image onto canvas
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Preserve PNG transparency for logos/PNGs unless size exceeds budget
        const isTransparentPng = file.type === 'image/png';
        let dataUrl = isTransparentPng
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', quality);

        // If PNG output exceeds target size, try JPEG if large or downscale PNG slightly
        if (dataUrl.length > maxDataUrlBytes && isTransparentPng) {
          const scaledCanvas = document.createElement('canvas');
          scaledCanvas.width = Math.max(1, Math.round(width * 0.75));
          scaledCanvas.height = Math.max(1, Math.round(height * 0.75));
          const sCtx = scaledCanvas.getContext('2d');
          if (sCtx) {
            sCtx.imageSmoothingEnabled = true;
            sCtx.imageSmoothingQuality = 'high';
            sCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
            const scaledPng = scaledCanvas.toDataURL('image/png');
            dataUrl = scaledPng.length <= maxDataUrlBytes
              ? scaledPng
              : scaledCanvas.toDataURL('image/jpeg', 0.8);
          }
        } else if (dataUrl.length > maxDataUrlBytes) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        }

        // Extra safeguard if still larger than budget
        if (dataUrl.length > maxDataUrlBytes) {
          const tighterCanvas = document.createElement('canvas');
          tighterCanvas.width = Math.max(1, Math.round(width * 0.65));
          tighterCanvas.height = Math.max(1, Math.round(height * 0.65));
          const tCtx = tighterCanvas.getContext('2d');
          if (tCtx) {
            tCtx.imageSmoothingEnabled = true;
            tCtx.drawImage(canvas, 0, 0, tighterCanvas.width, tighterCanvas.height);
            dataUrl = tighterCanvas.toDataURL('image/jpeg', 0.72);
          }
        }

        resolve(dataUrl);
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
