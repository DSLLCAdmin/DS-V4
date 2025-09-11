const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('return (a.price - b.price);')) {
    lines[i] = '        return ((a.price || 0) - (b.price || 0));';
    console.log('Fixed line', i+1, ':', lines[i]);
  }
}

const newContent = lines.join('\n');
fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Fixed null price handling');