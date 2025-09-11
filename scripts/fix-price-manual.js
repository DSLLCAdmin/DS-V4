const fs = require('fs');

const content = fs.readFileSync('app/shop/page.tsx', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('parseFloat(a.price?.replace')) {
    lines[i] = '        return (a.price - b.price);';
    console.log('Fixed line', i+1, ':', lines[i]);
  }
  if (lines[i].includes('parseFloat(b.price?.replace')) {
    lines[i] = '        return (b.price - a.price);';
    console.log('Fixed line', i+1, ':', lines[i]);
  }
}

const newContent = lines.join('\n');
fs.writeFileSync('app/shop/page.tsx', newContent, 'utf8');
console.log('SUCCESS! Fixed price sorting lines');