/**
 * Convert Markdown Guide Files to Clean PDF Format
 * Removes markdown syntax, creates readable plain text/PDF
 */

const fs = require('fs');
const path = require('path');

// Remove markdown syntax and clean up formatting
function cleanMarkdown(content) {
  let cleaned = content;
  
  // Remove code blocks
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  
  // Remove inline code
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  
  // Remove headers (keep text, remove #)
  cleaned = cleaned.replace(/^#{1,6}\s+(.+)$/gm, (match, text) => {
    // Convert to bold formatting indicator (we'll handle in PDF)
    return `\n${text}\n`;
  });
  
  // Remove horizontal rules
  cleaned = cleaned.replace(/^---+$/gm, '');
  cleaned = cleaned.replace(/^===+$/gm, '');
  
  // Remove bold/italic markdown (keep text)
  cleaned = cleaned.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
  cleaned = cleaned.replace(/_([^_]+)_/g, '$1');
  
  // Remove markdown links (keep text)
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Remove emoji placeholders or keep them as text
  // Keep emojis as-is since they may be useful
  
  // Clean up excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.replace(/[ \t]+$/gm, '');
  
  // Clean up list markers (convert to simple bullets)
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, '  • ');
  cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, (match) => {
    // Keep numbered lists as numbered
    return match;
  });
  
  // Remove table markdown (keep content separated)
  cleaned = cleaned.replace(/\|/g, ' | ');
  cleaned = cleaned.replace(/^\|.+\|$/gm, (match) => {
    return match.replace(/\|/g, '').trim().replace(/\s+/g, ' - ');
  });
  
  return cleaned.trim();
}

// Create clean text file (ready for PDF conversion)
function convertMarkdownFile(mdPath, outputDir) {
  try {
    const content = fs.readFileSync(mdPath, 'utf8');
    const cleaned = cleanMarkdown(content);
    
    const basename = path.basename(mdPath, '.md');
    const txtPath = path.join(outputDir, `${basename}.txt`);
    
    fs.writeFileSync(txtPath, cleaned, 'utf8');
    console.log(`✅ Converted: ${basename}.md → ${basename}.txt`);
    
    return txtPath;
  } catch (error) {
    console.error(`❌ Error converting ${mdPath}:`, error.message);
    return null;
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
  
  console.log('\n📄 Converting Markdown Guides to Clean Text Format\n');
  console.log('='.repeat(70));
  
  // Find all .md files
  const mdFiles = fs.readdirSync(docsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(docsDir, file));
  
  console.log(`\nFound ${mdFiles.length} markdown files:\n`);
  
  const converted = [];
  mdFiles.forEach(mdFile => {
    const result = convertMarkdownFile(mdFile, outputDir);
    if (result) {
      converted.push(path.basename(result));
    }
  });
  
  console.log('\n' + '='.repeat(70));
  console.log(`\n✅ Converted ${converted.length} files to clean text format`);
  console.log(`\n📁 Output directory: ${outputDir}`);
  console.log('\n📋 Converted files:');
  converted.forEach(file => {
    console.log(`   • ${file}`);
  });
  
  console.log('\n💡 Next Steps:');
  console.log('   1. Open .txt files in Word or Google Docs');
  console.log('   2. Format as needed (headers, spacing, fonts)');
  console.log('   3. Export to PDF');
  console.log('\n');
}

main();

