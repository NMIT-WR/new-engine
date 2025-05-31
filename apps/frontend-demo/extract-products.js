const fs = require('fs');
const content = fs.readFileSync('src/data/mock-products.ts', 'utf8');
const matches = content.match(/title: '([^']+)'/g);
const titles = matches.map(m => m.replace('title: ', '').replace(/'/g, ''));
const productTitles = titles.filter(t => 
  t.length > 5 && 
  !['S', 'M', 'L', 'XL', '28', '30', '32', '34', '40', '42', '44'].includes(t) &&
  !t.includes('Collection')
);
console.log('Available products:');
productTitles.forEach((title, i) => console.log(`${i + 1}. ${title}`));