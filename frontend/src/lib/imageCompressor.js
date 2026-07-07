/**
 * Compresses an image file to WebP format using HTML5 Canvas.
 * @param {File} file The input file object.
 * @param {number} quality Compression quality between 0.1 and 1.0 (default 0.8).
 * @param {number} maxDim Maximum width or height of the compressed image (default 1200).
 * @returns {Promise<string>} Resolve with the compressed base64 data URL.
 */
export const compressToWebP = (file, quality = 0.8, maxDim = 1200) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if it exceeds max dimensions
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP with 80% compression quality
        const webpDataUrl = canvas.toDataURL('image/webp', quality);
        resolve(webpDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
