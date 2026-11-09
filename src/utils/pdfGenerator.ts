import { jsPDF } from 'jspdf';
import { Recipe } from '../types';

/**
 * Loads an image from a URL or relative path and converts it into a base64 Data URL
 * with robust fallbacks for CORS, local files, and external URLs.
 */
const loadImageAsBase64 = (url: string): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }

    // If it's already a Data URL, return immediately
    if (url.startsWith('data:image/')) {
      resolve(url);
      return;
    }

    // Try HTML Image with canvas first
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 800;
        canvas.height = img.naturalHeight || img.height || 600;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        // JPEG format with quality 0.82 for optimal file size & crisp quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      } catch {
        // Fallback: Fetch as blob
        fetchBlobAsBase64(url).then(resolve);
      }
    };

    img.onerror = () => {
      fetchBlobAsBase64(url).then(resolve);
    };

    img.src = url;
  });
};

/**
 * Fallback fetch blob reader for cross-origin or local assets
 */
const fetchBlobAsBase64 = async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(typeof reader.result === 'string' ? reader.result : null);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

/**
 * Generates an executive, magazine-grade Recipe PDF featuring:
 * 1. Official TASTE OF INDIA logo
 * 2. High-resolution recipe food image
 * 3. Complete ingredients, instructions, metrics & chef tips
 */
export const generateRecipePDF = async (
  recipe: Recipe, 
  memberName: string = 'Taste of India Member'
): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  // Official logo path
  const logoUrl = '/assets/aistudio/file_00000000fb9482119cbfd58d08ef92d6_70233663.png';

  // Concurrently load the official website logo and the recipe's food image
  const [logoBase64, recipeImgBase64] = await Promise.all([
    loadImageAsBase64(logoUrl),
    loadImageAsBase64(recipe.image)
  ]);

  // Helper to draw the top luxury brand banner
  const drawHeaderBanner = (isFirstPage: boolean = true) => {
    const bannerHeight = isFirstPage ? 30 : 16;
    
    // Deep royal brown background
    doc.setFillColor(43, 27, 23);
    doc.rect(0, 0, pageWidth, bannerHeight, 'F');

    // Saffron accent bottom stripe
    doc.setFillColor(232, 89, 12);
    doc.rect(0, bannerHeight - 2, pageWidth, 2, 'F');

    // Official Logo inside header
    if (logoBase64) {
      try {
        const logoFormat = logoBase64.startsWith('data:image/png') ? 'PNG' : 'JPEG';
        if (isFirstPage) {
          // White rounded backdrop badge for the logo
          doc.setFillColor(250, 246, 240);
          doc.roundedRect(margin, 3.5, 46, 23, 2, 2, 'F');
          doc.addImage(logoBase64, logoFormat, margin + 1.5, 4.5, 43, 21);
        } else {
          doc.addImage(logoBase64, logoFormat, margin, 2, 26, 12);
        }
      } catch {
        // Fallback text if image render fails
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(245, 158, 11);
        doc.text('TASTE OF INDIA', margin, isFirstPage ? 16 : 10);
      }
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(245, 158, 11);
      doc.text('TASTE OF INDIA', margin, isFirstPage ? 16 : 10);
    }

    // Header Right-side text
    if (isFirstPage) {
      const textX = margin + 50;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(245, 158, 11); // Amber Gold
      doc.text('TASTE OF INDIA', textX, 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(230, 230, 230);
      doc.text('DISCOVER THE FLAVOURS OF INDIA · OFFICIAL MASTER ARCHIVE', textX, 16);

      doc.setFontSize(7);
      doc.setTextColor(200, 190, 180);
      doc.text(`Licensed to: ${memberName} · 100% Authentic Heritage Recipe`, textX, 21);

      // Verified Badge Pill (Far Right)
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(pageWidth - margin - 28, 9, 28, 6, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text('VERIFIED RECIPE', pageWidth - margin - 26, 13.2);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(240, 240, 240);
      doc.text(`TASTE OF INDIA · ${recipe.title}`, margin + 30, 9);
      doc.text('Page Continues...', pageWidth - margin - 25, 9);
    }
  };

  // Helper to draw bottom footer on each page
  const drawPageFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(230, 220, 210);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 120, 110);
    doc.text(`Taste of India Master Collection · Exclusively on tasteofindia.com`, margin, pageHeight - 7);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin - 18, pageHeight - 7);
  };

  // Render Page 1 Header
  drawHeaderBanner(true);
  let y = 37;

  // Recipe Title
  doc.setTextColor(43, 27, 23); // Deep Brown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(recipe.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 1;

  // Regional Sub-ribbon (State, Category, Diet, Difficulty, Spice)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(232, 89, 12); // Saffron
  const stateBadge = `${recipe.state.toUpperCase()}`;
  doc.text(stateBadge, margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const metaDetails = ` · ${recipe.category} · ${recipe.dietary} · ${recipe.difficulty} Difficulty · Spice: ${recipe.spiceLevel || 'Medium'}`;
  doc.text(metaDetails, margin + doc.getTextWidth(stateBadge), y);
  y += 5;

  // RECIPE FOOD IMAGE
  if (recipeImgBase64) {
    try {
      const imgHeight = 60; // 60mm height
      const imgWidth = contentWidth; // 180mm full width
      const format = recipeImgBase64.startsWith('data:image/png') ? 'PNG' : 'JPEG';

      // Subtle shadow/background backing
      doc.setFillColor(245, 240, 235);
      doc.roundedRect(margin, y, imgWidth, imgHeight, 2, 2, 'F');

      // Draw Recipe Image
      doc.addImage(recipeImgBase64, format, margin, y, imgWidth, imgHeight);

      // Subtle outer frame border
      doc.setDrawColor(210, 195, 180);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, y, imgWidth, imgHeight, 2, 2, 'D');

      y += imgHeight + 2;

      // Caption
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(130, 115, 105);
      doc.text(`Authentic presentation: ${recipe.title} (${recipe.state})`, margin + 1, y + 2.5);
      y += 6;
    } catch (e) {
      console.warn('Error inserting recipe image into PDF:', e);
      y += 2;
    }
  }

  // Description Paragraph
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 50, 45);
  const descLines = doc.splitTextToSize(recipe.description, contentWidth);
  doc.text(descLines, margin, y);
  y += descLines.length * 4.5 + 4;

  // Quick Metrics Highlight Box (5-column Grid)
  doc.setFillColor(250, 246, 240); // Soft Cream
  doc.setDrawColor(230, 215, 195);
  doc.roundedRect(margin, y, contentWidth, 15, 2, 2, 'FD');

  const colWidth = contentWidth / 5;
  const metrics = [
    { label: 'PREP TIME', val: `${recipe.prepTime} mins` },
    { label: 'COOK TIME', val: `${recipe.cookTime} mins` },
    { label: 'TOTAL TIME', val: `${recipe.totalTime} mins` },
    { label: 'SERVINGS', val: `${recipe.servings} People` },
    { label: 'CALORIES', val: `${recipe.nutrition.calories} kcal` }
  ];

  metrics.forEach((m, idx) => {
    const xPos = margin + idx * colWidth + 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(140, 110, 90);
    doc.text(m.label, xPos, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(43, 27, 23);
    doc.text(m.val, xPos, y + 11.5);
  });

  y += 21;

  // INGREDIENTS SECTION
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(232, 89, 12);
  doc.text('INGREDIENTS & MEASUREMENTS', margin, y);
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(43, 27, 23);

  // Render ingredients in 2 clean columns to maximize space
  const half = Math.ceil(recipe.ingredients.length / 2);
  const col1 = recipe.ingredients.slice(0, half);
  const col2 = recipe.ingredients.slice(half);
  const colW = (contentWidth - 6) / 2;
  const ingStartY = y;
  let maxIngY = y;

  // Left Column
  let col1Y = ingStartY;
  col1.forEach((ing) => {
    if (col1Y > pageHeight - 32) {
      doc.addPage();
      drawHeaderBanner(false);
      col1Y = 24;
    }
    const ingText = `• ${ing.item}: ${ing.quantity}${ing.notes ? ` (${ing.notes})` : ''}`;
    const wrapped = doc.splitTextToSize(ingText, colW);
    doc.text(wrapped, margin, col1Y);
    col1Y += wrapped.length * 4.2;
  });

  // Right Column
  let col2Y = ingStartY;
  col2.forEach((ing) => {
    if (col2Y > pageHeight - 32) {
      doc.addPage();
      drawHeaderBanner(false);
      col2Y = 24;
    }
    const ingText = `• ${ing.item}: ${ing.quantity}${ing.notes ? ` (${ing.notes})` : ''}`;
    const wrapped = doc.splitTextToSize(ingText, colW);
    doc.text(wrapped, margin + colW + 6, col2Y);
    col2Y += wrapped.length * 4.2;
  });

  maxIngY = Math.max(col1Y, col2Y);
  y = maxIngY + 5;

  // Check if we need a new page for instructions
  if (y > pageHeight - 55) {
    doc.addPage();
    drawHeaderBanner(false);
    y = 24;
  }

  // STEP-BY-STEP INSTRUCTIONS SECTION
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(232, 89, 12);
  doc.text('STEP-BY-STEP COOKING INSTRUCTIONS', margin, y);
  y += 6;

  recipe.instructions.forEach((step, idx) => {
    const stepNum = `${idx + 1}.`;
    const stepLines = doc.splitTextToSize(step, contentWidth - 8);
    const requiredHeight = stepLines.length * 4.5 + 3;

    if (y + requiredHeight > pageHeight - 25) {
      doc.addPage();
      drawHeaderBanner(false);
      y = 24;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(232, 89, 12);
    doc.text(stepNum, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(43, 27, 23);
    doc.text(stepLines, margin + 7, y);
    y += requiredHeight;
  });

  // CHEF TIPS SECTION
  if (recipe.tips && recipe.tips.length > 0) {
    if (y > pageHeight - 40) {
      doc.addPage();
      drawHeaderBanner(false);
      y = 24;
    } else {
      y += 3;
    }

    const tipsBoxStart = y;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(180, 83, 9);
    doc.text("CHEF'S TRADITIONAL COOKING SECRETS", margin + 4, y + 6);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 40, 20);

    recipe.tips.forEach((tip) => {
      const tipLines = doc.splitTextToSize(`★ ${tip}`, contentWidth - 8);
      doc.text(tipLines, margin + 4, y);
      y += tipLines.length * 4 + 1.5;
    });

    const boxHeight = y - tipsBoxStart + 2;
    doc.setDrawColor(245, 158, 11);
    doc.setFillColor(254, 243, 199); // Soft Amber
    doc.roundedRect(margin, tipsBoxStart, contentWidth, boxHeight, 2, 2, 'D');
    y += 5;
  }

  // NUTRITIONAL SUMMARY
  if (recipe.nutrition) {
    if (y > pageHeight - 30) {
      doc.addPage();
      drawHeaderBanner(false);
      y = 24;
    }

    doc.setFillColor(245, 245, 240);
    doc.roundedRect(margin, y, contentWidth, 10, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 80, 70);
    doc.text('NUTRITION PER SERVING:', margin + 3, y + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 40, 30);
    const nutText = `Calories: ${recipe.nutrition.calories} kcal  |  Protein: ${recipe.nutrition.protein}g  |  Carbohydrates: ${recipe.nutrition.carbs}g  |  Fat: ${recipe.nutrition.fat}g  |  Fiber: ${recipe.nutrition.fiber}g`;
    doc.text(nutText, margin + 42, y + 6.5);
    y += 14;
  }

  // CREATOR ATTRIBUTION
  if (y > pageHeight - 20) {
    doc.addPage();
    drawHeaderBanner(false);
    y = 24;
  }

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(120, 100, 90);
  doc.text(`Heirloom recipe curated by ${recipe.creator.name} (${recipe.creator.location}) for TASTE OF INDIA.`, margin, y);

  // Add Footers and Page Numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter(i, totalPages);
  }

  // Set document metadata properties
  doc.setProperties({
    title: `TASTEOFINDIA - ${recipe.title}`,
    subject: `Authentic Heritage Recipe - ${recipe.title}`,
    author: 'TASTEOFINDIA',
    creator: 'TASTEOFINDIA'
  });

  // Download PDF with TASTEOFINDIA file name
  const cleanTitle = (recipe.title || recipe.slug || recipe.id || 'recipe')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  const fileName = `TASTEOFINDIA_${cleanTitle}.pdf`;
  doc.save(fileName);
};
