import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const db = new Database(join(__dirname, 'videobelajar.db'));

const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
const seed   = readFileSync(join(__dirname, 'seed.sql'),   'utf8');

db.exec(schema);
console.log('Schema berhasil dibuat.');

db.exec(seed);
console.log('Seed data berhasil dimasukkan.');

db.close();
console.log('Database videobelajar.db siap digunakan.');
