const fs = require('fs');
const path = process.argv[2];
const size = 900*1024;

const raw = fs.readFileSync(path);
const b64 = raw.toString('base64');

for (let i=0, n=0; i<b64.length; i+=size, n++) {
  const part = b64.slice(i, i+size);
  fs.writeFileSync(`${process.env.TEMP}\\the-real-index.part${String(n).padStart(3,'0')}.b64`, part);
}

console.log('Done! Check %TEMP% for the part files.');