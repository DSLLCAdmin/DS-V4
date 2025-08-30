module.exports = {
  // Image naming conventions
  naming: {
    // Format: [ProductID]_[ProductName].[ext]
    pattern: /^([A-Z0-9]+)_(.+)\.(webp|jpg|jpeg|png|gif)$/i,
    examples: [
      'A2_mesh-bodysuits.webp',
      'B3_window-shades.webp',
      '1a_first-light-ebook.webp'
    ]
  },

  // Image directories and their purposes
  directories: {
    'product-images': {
      purpose: 'High-quality product images (preferred)',
      formats: ['webp', 'png'],
      maxSize: '500KB',
      dimensions: '800x800px minimum'
    },
    'Archive-Images': {
      purpose: 'Legacy images and placeholders',
      formats: ['png', 'jpg'],
      maxSize: '1MB',
      dimensions: '400x400px minimum'
    }
  },

  // Product type to placeholder image mapping
  placeholders: {
    'Serials/Books': '/Archive-Images/1a_first-light-ebook.jpg',
    'Apparel & Intimate Wear': '/Archive-Images/A2_mesh-bodysuits.png',
    'Auto + Mobility': '/Archive-Images/A8_hats.png',
    'Accessories': '/Archive-Images/A8_hats.png',
    'Home, Mood, and Atmosphere': '/Archive-Images/A8_hats.png',
    'Media + Experiences': '/Archive-Images/1a_first-light-ebook.jpg',
    'Digital + Curated Services': '/Archive-Images/1a_first-light-ebook.jpg',
    'Culinary & Novelty': '/Archive-Images/A8_hats.png',
    'Collector & Art-Based': '/Archive-Images/A8_hats.png',
    'Live & Social Activation': '/Archive-Images/A8_hats.png',
    'Relationship, Erotic & Mystery-Inspired': '/Archive-Images/A8_hats.png'
  },

  // Image optimization recommendations
  optimization: {
    webp: {
      quality: 85,
      effort: 6,
      description: 'Best format for web - small size, high quality'
    },
    png: {
      compression: 'high',
      description: 'Good for graphics with transparency'
    },
    jpg: {
      quality: 85,
      description: 'Good for photos, smaller than PNG'
    }
  },

  // Batch processing commands (for future automation)
  batchCommands: {
    convertToWebp: 'cwebp -q 85 -m 6 input.png -o output.webp',
    resizeImage: 'magick input.jpg -resize 800x800^ -gravity center -extent 800x800 output.jpg',
    optimizePng: 'pngquant --quality=85-95 --force input.png --output output.png'
  }
};
