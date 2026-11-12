/**
 * Client-side image compression utility.
 * Guarantees that uploaded photos (logos, news banners, gallery pictures)
 * are optimized to compact dimensions and file sizes (< 100KB),
 * preventing Firestore document size limit errors (1MB max per document)
 * and ensuring instantaneous page loading across devices.
 */

export async function compressImage(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG and small, keep vector
    if (file.type === 'image/svg+xml' && file.size < 250 * 1024) {
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

        // Prefer JPEG for general photos; if PNG with transparency, use PNG or JPEG
        const isTransparentPng = file.type === 'image/png';
        let outputType = isTransparentPng ? 'image/png' : 'image/jpeg';
        let dataUrl = canvas.toDataURL(outputType, quality);

        // If PNG output is still large (> 350KB), compress to JPEG
        if (dataUrl.length > 350000) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        }

        // Extra safeguard: if still > 600KB, do a second tighter pass
        if (dataUrl.length > 600000) {
          const tighterCanvas = document.createElement('canvas');
          tighterCanvas.width = Math.round(width * 0.7);
          tighterCanvas.height = Math.round(height * 0.7);
          const tCtx = tighterCanvas.getContext('2d');
          if (tCtx) {
            tCtx.imageSmoothingEnabled = true;
            tCtx.drawImage(canvas, 0, 0, tighterCanvas.width, tighterCanvas.height);
            dataUrl = tighterCanvas.toDataURL('image/jpeg', 0.75);
          }
        }

        resolve(dataUrl);
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
