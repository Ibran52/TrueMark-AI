import { VerificationResult } from './types';

export const sampleResults = {
  real: [
    {
      isGenuine: true,
      confidenceScore: 97,
      imageAnalysis: {
        title: "Pristine Visuals",
        description: "Logo is crisp with sharp edges and correctly placed. Packaging colors are vibrant and match official branding Pantone codes. High-resolution printing shows no pixelation or smudges.",
        isPositive: true,
      },
      barcodeAnalysis: {
        title: "Barcode Verified",
        description: "Scanned barcode matches the registered product in our database (Product ID: 850041-B).",
        isPositive: true,
      },
      textAnalysis: {
        title: "Text & Fonts Match",
        description: "All text, including ingredients and manufacturer details, uses the correct font and is free of spelling mistakes.",
        isPositive: true,
      },
    },
    {
      isGenuine: true,
      confidenceScore: 99,
      imageAnalysis: {
        title: "Authentic Electronics Packaging",
        description: "Holographic security seal is intact and displays a multi-layered 3D effect when tilted. The matte finish on the product casing is even and consistent with premium manufacturer standards.",
        isPositive: true,
      },
      barcodeAnalysis: {
        title: "Serial Number Confirmed",
        description: "The serial number on the box matches the one on the device and is validated in the manufacturer's warranty database.",
        isPositive: true,
      },
      textAnalysis: {
        title: "Regulatory Markings Present",
        description: "All regulatory markings (CE, FCC) are present, correctly formatted, and match the specified region.",
        isPositive: true,
      },
    },
    {
      isGenuine: true,
      confidenceScore: 95,
      imageAnalysis: {
        title: "Cosmetic Seal Intact",
        description: "The product's tamper-evident safety seal is perfectly aligned and unbroken. The container's plastic has a high-quality feel, with no molding imperfections, and the color is consistent.",
        isPositive: true,
      },
      barcodeAnalysis: {
        title: "Batch Code Valid",
        description: "The batch code is printed clearly and corresponds to a recent manufacturing date.",
        isPositive: true,
      },
      textAnalysis: {
        title: "Ingredient List Verified",
        description: "The ingredient list is accurate, uses standard INCI nomenclature, and has no typos.",
        isPositive: true,
      },
    },
    {
      isGenuine: true,
      confidenceScore: 98,
      imageAnalysis: {
        title: "Premium Skincare Jar",
        description: "The glass jar has a substantial weight and is free of bubbles or defects. The holographic security sticker on the box shows the brand's micro-printing when viewed under magnification.",
        isPositive: true,
      },
      barcodeAnalysis: {
        title: "Batch Code Laser-Etched",
        description: "Batch code is laser-etched on the jar's bottom and matches the outer box. Verified in the brand's production database.",
        isPositive: true,
      },
      textAnalysis: {
        title: "Perfectly Aligned Text",
        description: "All text uses the brand's proprietary font. The ingredient list is comprehensive and uses correct INCI names without error.",
        isPositive: true,
      },
    },
    {
      isGenuine: true,
      confidenceScore: 99,
      imageAnalysis: {
        title: "Flawless Headphone Build",
        description: "The brushed aluminum finish is flawless, with a consistent grain direction. The logo is precisely debossed with clean edges. All included accessories are high-quality and correctly branded.",
        isPositive: true,
      },
      barcodeAnalysis: {
        title: "Serial Number Registered",
        description: "Serial number from the box matches the one inside the earcup and was successfully registered for warranty on the official website.",
        isPositive: true,
      },
      textAnalysis: {
        title: "Professional Documentation",
        description: "The quick start guide and warranty information are well-printed in multiple languages with no grammatical errors.",
        isPositive: true,
      },
    },
    {
      isGenuine: true,
      confidenceScore: 96,
      imageAnalysis: {
        title: "Official Jersey Stitching",
        description: "Official league hologram is present and shows the correct 3D effect from multiple angles. Stitching on the team crest is dense and intricate, with over 10,000 stitches and no loose threads.",
        isPositive: true,
      },
      barcodeAnalysis: {
        title: "Hang Tag Barcode Correct",
        description: "The barcode on the hang tag corresponds to the correct product, size, and season in the official merchandise catalog.",
        isPositive: true,
      },
      textAnalysis: {
        title: "Authentic Care Label",
        description: "The care and material information label is sewn in neatly and contains the official manufacturer's information and logo.",
        isPositive: true,
      },
    }
  ] as VerificationResult[],
  fake: [
    {
      isGenuine: false,
      confidenceScore: 85,
      imageAnalysis: {
        title: "Visual Inconsistencies",
        description: "The logo appears slightly blurred, suggesting a low-resolution scan of an original. Color saturation is dull and inconsistent, especially noticeable in the red tones.",
        isPositive: false,
      },
      barcodeAnalysis: {
        title: "Barcode Mismatch",
        description: "Barcode is not registered in the official product database or corresponds to a different product.",
        isPositive: false,
      },
      textAnalysis: {
        title: "Font & Spelling Errors",
        description: "The font used for the product description is incorrect, and a minor spelling error was detected in the ingredient list ('aqua' spelled as 'aqau').",
        isPositive: false,
      },
    },
    {
      isGenuine: false,
      confidenceScore: 92,
      imageAnalysis: {
        title: "Subtle Watch Flaws",
        description: "Watch hands have a cheap, polished finish instead of the correct brushed steel. Luminosity of the hour markers is weak and fades quickly. Engraving on the back is shallow and lacks precision.",
        isPositive: false,
      },
      barcodeAnalysis: {
        title: "Serial Number Duplicated",
        description: "The serial number is known to be used on multiple counterfeit items and is not unique.",
        isPositive: false,
      },
      textAnalysis: {
        title: "Incorrect Terminology",
        description: "The user manual contains grammatical errors and uses non-standard terms for watch components.",
        isPositive: false,
      },
    },
    {
      isGenuine: false,
      confidenceScore: 78,
      imageAnalysis: {
        title: "Low-Quality Materials",
        description: "The plastic feels brittle and has prominent, rough seam lines from a poor molding process. Paint application is sloppy, with colors bleeding over their designated areas and a strong chemical smell.",
        isPositive: false,
      },
      barcodeAnalysis: {
        title: "Barcode Invalid",
        description: "The barcode does not follow the standard EAN-13 format and fails checksum validation.",
        isPositive: false,
      },
      textAnalysis: {
        title: "Missing Safety Warnings",
        description: "Crucial safety warnings and age recommendations for the toy are missing from the packaging.",
        isPositive: false,
      },
    },
    {
      isGenuine: false,
      confidenceScore: 88,
      imageAnalysis: {
        title: "Perfume Bottle Defects",
        description: "The bottle cap is lightweight plastic instead of weighted metal and fits loosely. Small air bubbles are visible within the glass. The atomizer nozzle sprays unevenly and leaks.",
        isPositive: false,
      },
      barcodeAnalysis: {
        title: "Barcode Linked to Recall",
        description: "While the barcode is scannable, it corresponds to a product batch that was officially recalled by the manufacturer for quality issues.",
        isPositive: false,
      },
      textAnalysis: {
        title: "Ingredient List Inaccurate",
        description: "The font on the ingredients list is slightly thinner than the official branding. A key chemical component is missing from the list.",
        isPositive: false,
      },
    },
    {
        isGenuine: false,
        confidenceScore: 95,
        imageAnalysis: {
            title: "Charger Build Quality",
            description: "The plastic casing is a warmer shade of white and feels significantly lighter. The USB port is misaligned, requiring force to insert a cable. Electrical prongs are loose and show signs of poor casting.",
            isPositive: false,
        },
        barcodeAnalysis: {
            title: "Peelable Barcode Sticker",
            description: "The barcode is a low-resolution sticker that can be peeled off, not printed directly on the casing as per official products.",
            isPositive: false,
        },
        textAnalysis: {
            title: "Incorrect Safety Marks",
            description: "The UL safety certification logo is improperly designed, and the text 'Designed by Apple in California' uses a generic font.",
            isPositive: false,
        },
    },
    {
        isGenuine: false,
        confidenceScore: 82,
        imageAnalysis: {
            title: "Poor Handbag Craftsmanship",
            description: "Stitching is uneven, widely spaced, and uses a thin, weak thread. The 'leather' has a synthetic, plastic-like sheen and odor. Hardware is lightweight, unbranded, and the zipper catches.",
            isPositive: false,
        },
        barcodeAnalysis: {
            title: "Suspicious QR Code",
            description: "The QR code on the authenticity tag links to a non-official website instead of the brand's secure product verification page.",
            isPositive: false,
        },
        textAnalysis: {
            title: "Brand Name Misspelled",
            description: "The brand name on the interior label is misspelled ('Prado' instead of 'Prada'). The 'Made in Italy' stamp is blurry.",
            isPositive: false,
        },
    }
  ] as VerificationResult[],
};