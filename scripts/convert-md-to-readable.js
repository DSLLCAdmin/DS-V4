/**
 * Convert Markdown to Clean, Readable Text Format
 * Removes markdown syntax, creates properly formatted plain text
 */

const fs = require('fs');
const path = require('path');

// Improved markdown cleaning with better formatting
function cleanMarkdown(content) {
  let cleaned = content;
  
  // Remove code blocks (but keep the content if useful)
  cleaned = cleaned.replace(/```[\s\S]*?```/g, (match) => {
    // Extract content but remove code block markers
    return match.replace(/```[\w]*/g, '').trim();
  });
  
  // Remove inline code markers
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  
  // Convert headers to readable format with spacing
  cleaned = cleaned.replace(/^#{6}\s+(.+)$/gm, '\n\n$1\n');
  cleaned = cleaned.replace(/^#{5}\s+(.+)$/gm, '\n\n$1\n');
  cleaned = cleaned.replace(/^#{4}\s+(.+)$/gm, '\n\n$1\n');
  cleaned = cleaned.replace(/^#{3}\s+(.+)$/gm, '\n\n$1\n');
  cleaned = cleaned.replace(/^#{2}\s+(.+)$/gm, '\n\n$1\n');
  cleaned = cleaned.replace(/^#{1}\s+(.+)$/gm, '\n\n$1\n');
  
  // Remove horizontal rules - replace with blank line
  cleaned = cleaned.replace(/^---+$/gm, '');
  cleaned = cleaned.replace(/^===+$/gm, '');
  
  // Remove bold/italic markdown (keep text only)
  cleaned = cleaned.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
  cleaned = cleaned.replace(/_([^_]+)_/g, '$1');
  
  // Convert markdown links to readable format
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Clean up list markers - convert to simple bullets with spacing
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '  • ');
  
  // Keep numbered lists but clean them up
  cleaned = cleaned.replace(/^\s*(\d+)\.\s+/gm, '  $1. ');
  
  // Clean up checkbox lists
  cleaned = cleaned.replace(/^\s*- \[x\]\s+/gim, '  ✓ ');
  cleaned = cleaned.replace(/^\s*- \[ \]\s+/gim, '  ☐ ');
  
  // Remove table markdown - convert to readable format
  cleaned = cleaned.replace(/\|/g, ' | ');
  cleaned = cleaned.replace(/^\|\s*:?-+:?\s*\|/gm, ''); // Remove separator rows
  
  // Remove markdown emphasis characters that might be left
  cleaned = cleaned.replace(/\*\*/g, '');
  cleaned = cleaned.replace(/__/g, '');
  
  // Clean up excessive whitespace while preserving paragraph structure
  cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n'); // Max 3 blank lines
  cleaned = cleaned.replace(/[ \t]+$/gm, ''); // Remove trailing spaces
  cleaned = cleaned.replace(/^[ \t]+$/gm, ''); // Remove lines with only whitespace
  
  // Ensure proper spacing after periods (if missing)
  cleaned = cleaned.replace(/\.([A-Z])/g, '. $1');
  
  // Clean up any remaining markdown artifacts
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, ''); // Remove HTML comments
  
  return cleaned.trim();
}

// Convert a markdown file to clean text
function convertFile(mdPath, outputDir) {
  try {
    const content = fs.readFileSync(mdPath, 'utf8');
    const cleaned = cleanMarkdown(content);
    
    const basename = path.basename(mdPath, '.md');
    const txtPath = path.join(outputDir, `${basename}.txt`);
    
    // Add header to file
    const header = `\n${'='.repeat(70)}\n${basename.toUpperCase().replace(/-/g, ' ').replace(/_/g, ' ')}\n${'='.repeat(70)}\n\n`;
    const finalContent = header + cleaned;
    
    fs.writeFileSync(txtPath, finalContent, 'utf8');
    
    return { success: true, file: basename };
  } catch (error) {
    return { success: false, file: path.basename(mdPath), error: error.message };
  }
}

// Main function
function main() {
  const docsDir = path.join(__dirname, '..', 'docs');
  const outputDir = path.join(__dirname, '..', 'docs', 'pdf-ready');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('\n📄 Converting Markdown Guides to Clean, Readable Text Format\n');
  console.log('='.repeat(70));
  
  // Find all .md files
  const mdFiles = fs.readdirSync(docsDir)
    .filter(file => file.endsWith('.md') && file !== 'GUIDE-INDEX.md')
    .map(file => path.join(docsDir, file))
    .sort(); // Sort alphabetically
  
  console.log(`\nFound ${mdFiles.length} markdown files to convert\n`);
  
  const results = [];
  mdFiles.forEach((mdFile, index) => {
    const result = convertFile(mdFile, outputDir);
    results.push(result);
    if (result.success) {
      process.stdout.write(`\r✅ [${index + 1}/${mdFiles.length}] ${result.file}`);
    } else {
      console.error(`\n❌ Error: ${result.file} - ${result.error}`);
    }
  });
  
  const successful = results.filter(r => r.success);
  
  console.log('\n\n' + '='.repeat(70));
  console.log(`\n✅ Successfully converted ${successful.length} of ${mdFiles.length} files`);
  console.log(`\n📁 Output directory: ${outputDir}`);
  console.log('\n📋 Next Steps:');
  console.log('   1. Open the .txt files in Microsoft Word or Google Docs');
  console.log('   2. Format headers, spacing, and fonts as desired');
  console.log('   3. Export each file to PDF');
  console.log('   4. Organize PDFs in folders by category (Product, Shopify, Email, etc.)');
  console.log('\n');
}

main();

