const fs = require('fs'); 
const content = fs.readFileSync('data/products.ts', 'utf8'); 
let newContent = content; 
newContent = newContent.replace(/"Auto \+ Mobility Product 1"/g, '"Prowler Keychain"'); 
newContent = newContent.replace(/"Auto \+ Mobility Product 2"/g, '"DarkStreets License Plate Frame"'); 
newContent = newContent.replace(/"Auto \+ Mobility Product 3"/g, '"Custom Car Decals (Set of 3)"'); 
fs.writeFileSync('data/products.ts', newContent, 'utf8'); 
console.log('Auto + Mobility titles fixed!'); 
