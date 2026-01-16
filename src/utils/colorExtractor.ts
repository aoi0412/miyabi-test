export interface ExtractedColors {
  dominant: string;
  vibrant: string;
  muted: string;
}

export async function extractColorsFromImage(imageUrl: string): Promise<ExtractedColors> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(getDefaultColors());
        return;
      }

      // Scale down for performance
      const size = 100;
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(img, 0, 0, size, size);

      try {
        const imageData = ctx.getImageData(0, 0, size, size);
        const colors = analyzeColors(imageData.data);
        resolve(colors);
      } catch (error) {
        console.error('Color extraction failed:', error);
        resolve(getDefaultColors());
      }
    };

    img.onerror = () => {
      resolve(getDefaultColors());
    };

    img.src = imageUrl;
  });
}

function analyzeColors(data: Uint8ClampedArray): ExtractedColors {
  const colorMap = new Map<string, number>();
  let totalR = 0, totalG = 0, totalB = 0;
  let count = 0;

  // Sample every 4th pixel for performance
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent and very dark/light pixels
    if (a < 128 || (r < 30 && g < 30 && b < 30) || (r > 240 && g > 240 && b > 240)) {
      continue;
    }

    totalR += r;
    totalG += g;
    totalB += b;
    count++;

    // Quantize color to reduce variations
    const quantizedR = Math.floor(r / 32) * 32;
    const quantizedG = Math.floor(g / 32) * 32;
    const quantizedB = Math.floor(b / 32) * 32;
    const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;

    colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
  }

  // Find most common color (dominant)
  let dominantColor = '102, 126, 234'; // Default blue
  let maxCount = 0;

  colorMap.forEach((occurrences, color) => {
    if (occurrences > maxCount) {
      maxCount = occurrences;
      dominantColor = color;
    }
  });

  // Calculate average color (muted)
  const avgR = Math.floor(totalR / count);
  const avgG = Math.floor(totalG / count);
  const avgB = Math.floor(totalB / count);

  // Calculate vibrant color (saturated version of dominant)
  const [dR, dG, dB] = dominantColor.split(',').map(Number);
  const vibrant = increaseSaturation(dR, dG, dB);

  return {
    dominant: `rgb(${dominantColor})`,
    vibrant: `rgb(${vibrant.r}, ${vibrant.g}, ${vibrant.b})`,
    muted: `rgb(${avgR}, ${avgG}, ${avgB})`
  };
}

function increaseSaturation(r: number, g: number, b: number): { r: number; g: number; b: number } {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (delta === 0) return { r, g, b };

  const factor = 1.5;
  const newR = Math.min(255, Math.floor(r + (r - min) * factor));
  const newG = Math.min(255, Math.floor(g + (g - min) * factor));
  const newB = Math.min(255, Math.floor(b + (b - min) * factor));

  return { r: newR, g: newG, b: newB };
}

function getDefaultColors(): ExtractedColors {
  return {
    dominant: 'rgb(102, 126, 234)',
    vibrant: 'rgb(118, 75, 162)',
    muted: 'rgb(90, 100, 150)'
  };
}
