// to see the console.logs, type:
// npx tsc src/index.ts --target es2020 --module esnext --moduleResolution bundler
// node src/index.js
import { runPartie1Tests } from './tests/partie1.test.js';
import { runPartie2Tests } from './tests/partie2.test.js';
import { runPartie3Tests } from './tests/partie3.test.js';
runPartie1Tests();
runPartie2Tests();
runPartie3Tests();
