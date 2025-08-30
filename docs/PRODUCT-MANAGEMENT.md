<!-- Updated: 2025-08-30T20:54:03.012Z -->
# 🛍️ Product Management System

This document explains how to manage products, images, and data in the DarkStreets website.

## 🚀 Quick Start

### Generate a Complete Report
```bash
npm run products:report
```

### Find Products Needing Images
```bash
npm run products:needs-images
```

### Auto-assign Placeholder Images
```bash
npm run products:placeholders
```

## 🛠️ Available Commands

| Command | Description | npm Script |
|---------|-------------|------------|
| `report` | Generate comprehensive image analysis report | `npm run products:report` |
| `placeholders` | Auto-assign placeholder images by product type | `npm run products:placeholders` |
| `needs-images` | List products that need new images | `npm run products:needs-images` |
| `broken` | Find products with broken image links | `npm run products:broken` |
| `images` | List all available images | `npm run products:images` |

## 📁 Image Organization

### Directory Structure
```
public/
├── product-images/          # High-quality product images (preferred)
│   ├── A2_mesh-bodysuits.webp
│   ├── B3_window-shades.webp
│   └── 1a_first-light-ebook.webp
└── Archive-Images/          # Legacy images and placeholders
    ├── A2_mesh-bodysuits.png
    ├── A8_hats.png
    └── 1a_first-light-ebook.jpg
```

### Image Naming Convention
**Format:** `[ProductID]_[ProductName].[ext]`

**Examples:**
- `A2_mesh-bodysuits.webp`
- `B3_window-shades.webp`
- `1a_first-light-ebook.webp`

## 🎯 Best Practices

### 1. Image Creation Workflow
1. **Create image** using Std-Convert (Pixlr) or your preferred tool
2. **Save as .webp** for best performance (or .png for transparency)
3. **Use consistent naming**: `[ProductID]_[ProductName].webp`
4. **Place in correct directory**: `public/product-images/`
5. **Update products data** with new image path

### 2. Image Specifications
- **Format**: .webp preferred, .png acceptable
- **Size**: 800x800px minimum
- **File size**: Under 500KB for product-images, under 1MB for Archive-Images
- **Quality**: 85% for webp/jpg, high compression for PNG

### 3. Data Management
- **Never manually edit** `data/products.ts` directly
- **Use the management scripts** for bulk operations
- **Test changes** in development before deploying
- **Keep backups** of your product data

## 🔧 Advanced Usage

### Custom Scripts
You can also use the management system programmatically:

```javascript
const ProductManager = require('./scripts/manage-products.js');
const manager = new ProductManager();

// Generate a report
manager.generateImageReport();

// Find specific products
const needsImages = manager.findProductsNeedingImages();
const brokenImages = manager.findProductsWithBrokenImages();
```

### Configuration
Edit `scripts/image-config.js` to customize:
- Placeholder image mappings
- Directory purposes
- Naming conventions
- Optimization settings

## 📊 Monitoring & Maintenance

### Weekly Tasks
1. **Run image report**: `npm run products:report`
2. **Check for broken links**: `npm run products:broken`
3. **Update placeholder images** as needed

### Monthly Tasks
1. **Review image quality** and optimize if needed
2. **Clean up unused images** from Archive-Images
3. **Update naming conventions** if needed

### Before Deployments
1. **Verify all images load** correctly
2. **Check for broken links**
3. **Test placeholder system** works
4. **Validate product data** integrity

## 🚨 Troubleshooting

### Common Issues

**Images not loading:**
- Check file paths in `data/products.ts`
- Verify images exist in correct directories
- Check file permissions

**Placeholder not showing:**
- Ensure product has `"image": "Need Image Here"`
- Check shop page component logic
- Verify TypeScript compilation

**Script errors:**
- Ensure Node.js is installed
- Check file paths in scripts
- Verify products.ts format

### Getting Help
1. **Check the logs** from management scripts
2. **Review this documentation**
3. **Check the shop page** for visual issues
4. **Run diagnostic commands** to identify problems

## 🔮 Future Enhancements

### Planned Features
- **Image upload interface** in admin panel
- **Automatic image optimization** pipeline
- **CDN integration** for better performance
- **Image versioning** and rollback system
- **Bulk image processing** tools

### Automation Ideas
- **Git hooks** for image validation
- **CI/CD integration** for image optimization
- **Scheduled reports** via email
- **Image backup** and sync system

---

## 📞 Support

For questions or issues with the product management system:
1. Check this documentation first
2. Run diagnostic commands
3. Review the code in `scripts/` directory
4. Check the shop page implementation

**Remember**: Always test changes in development before deploying to production!
