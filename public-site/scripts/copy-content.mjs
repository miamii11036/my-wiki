import { cpSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, '..', '..', 'content', 'notes');
const dest = join(__dirname, '..', 'src', 'content', 'notes');

// Clean and recreate destination
rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

// Copy notes
cpSync(src, dest, { recursive: true });

console.log('Content copied from content/notes/ to src/content/notes/');
