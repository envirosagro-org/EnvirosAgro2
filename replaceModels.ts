import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'services', 'agroLangService.ts');
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace(/model:\s*'gemini-3-[a-z0-9\-]*'/g, "model: 'envirosagro-core-model'");
content = content.replace(/model:\s*"gemini-2\.5-flash-preview-tts"/g, "model: 'envirosagro-core-model'");

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Replaced successfully');
