'use client';

import QRCode from 'qrcode';

/**
 * Load image from URL and return as canvas
 */
async function loadImageAsCanvas(
  imagePath: string,
  size: number
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas);
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${imagePath}`));
    };

    // Use absolute path or relative to public folder
    img.src = imagePath;
  });
}

/**
 * Generate QR code with embedded logo as PNG blob
 */
export async function generateQRCodePNG(
  url: string,
  logoPath: string = '/logo.jpg',
  size: number = 1000
): Promise<Blob> {
  try {
    // Generate QR code as canvas
    const qrCanvas = await QRCode.toCanvas(url, {
      width: size,
      margin: 10,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H', // High error correction to allow logo overlay
    });

    // Create context for final image
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = size;
    finalCanvas.height = size;
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Draw QR code
    ctx.drawImage(qrCanvas, 0, 0, size, size);

    // Load and embed logo
    try {
      const logoSize = Math.floor(size * 0.25); // 25% of QR code size
      const logoX = (size - logoSize) / 2;
      const logoY = (size - logoSize) / 2;

      // Draw white background circle for logo
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, logoSize / 2 + 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw semi-transparent border for contrast
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, logoSize / 2 + 10, 0, Math.PI * 2);
      ctx.stroke();

      // Load and draw logo
      const logoCanvas = await loadImageAsCanvas(logoPath, logoSize);
      ctx.drawImage(logoCanvas, logoX, logoY, logoSize, logoSize);
    } catch (error) {
      console.warn('Failed to embed logo, QR code without logo:', error);
      // Continue without logo - QR code is still valid
    }

    // Convert to blob
    return new Promise((resolve, reject) => {
      finalCanvas.toBlob(
        (blob: Blob | null) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        'image/png',
        0.95
      );
    });
  } catch (error) {
    console.error('Error generating QR code PNG:', error);
    throw error;
  }
}

/**
 * Generate QR code with embedded logo as SVG blob
 */
export async function generateQRCodeSVG(
  url: string,
  logoPath: string = '/logo.jpg',
  size: number = 1000
): Promise<Blob> {
  try {
    // Generate QR code as SVG string
    const qrSvgString = await QRCode.toString(url, {
      width: size,
      margin: 10,
      type: 'svg',
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });

    // Convert SVG string to document
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(qrSvgString, 'image/svg+xml');
    const svgElement = svgDoc.documentElement as unknown as SVGSVGElement;

    // Add logo image to SVG
    try {
      const logoSize = Math.floor(size * 0.25); // 25% of QR code size
      const logoX = (size - logoSize) / 2;
      const logoY = (size - logoSize) / 2;

      // Create group for logo background and image
      const logoGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      // Add white background circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', String(size / 2));
      circle.setAttribute('cy', String(size / 2));
      circle.setAttribute('r', String(logoSize / 2 + 10));
      circle.setAttribute('fill', '#FFFFFF');
      circle.setAttribute('stroke', '#CCCCCC');
      circle.setAttribute('stroke-width', '2');
      logoGroup.appendChild(circle);

      // Add logo image
      const imageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      imageElement.setAttribute('x', String(logoX));
      imageElement.setAttribute('y', String(logoY));
      imageElement.setAttribute('width', String(logoSize));
      imageElement.setAttribute('height', String(logoSize));
      imageElement.setAttribute('href', logoPath);
      logoGroup.appendChild(imageElement);

      svgElement.appendChild(logoGroup);
    } catch (error) {
      console.warn('Failed to embed logo in SVG, returning QR code without logo:', error);
      // Continue without logo - QR code is still valid
    }

    // Convert SVG to blob
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    return blob;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw error;
  }
}

/**
 * Generate QR code without logo (fallback)
 */
export async function generateQRCodePlain(
  url: string,
  size: number = 1000,
  format: 'png' | 'svg' = 'png'
): Promise<Blob> {
  if (format === 'svg') {
    const qrSvg = await QRCode.toString(url, {
      width: size,
      margin: 10,
      type: 'svg',
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return new Blob([qrSvg], { type: 'image/svg+xml' });
  } else {
    return new Promise((resolve, reject) => {
      QRCode.toCanvas(url, {
        width: size,
        margin: 10,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then((canvas: HTMLCanvasElement) => {
          canvas.toBlob(
            (blob: Blob | null) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert canvas to blob'));
              }
            },
            'image/png',
            0.95
          );
        })
        .catch(reject);
    });
  }
}

/**
 * Trigger file download
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Extract short code from full URL
 */
export function extractShortCode(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1); // Remove leading slash
  } catch {
    return 'qrcode';
  }
}
