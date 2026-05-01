import * as fs from 'fs';
import { globSync } from 'glob';

const files = globSync('components/**/*.tsx');
let removedCount = 0;

for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  // Match <style>{...}</style> blocks that contain custom-scrollbar or animate-scan or spin
  const regex = /<style>\{\`[\s\S]*?(custom-scrollbar|animate-scan|spin|shadow-3xl)[\s\S]*?\`\}<\/style>/g;
  if (regex.test(code)) {
    const newCode = code.replace(regex, '');
    fs.writeFileSync(file, newCode);
    console.log('Removed from', file);
    removedCount++;
  }
}
console.log('Total files cleaned:', removedCount);
