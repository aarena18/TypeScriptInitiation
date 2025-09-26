// to see the console.logs, type:
// npx tsc src/index.ts --target es2020 --module esnext --moduleResolution bundler
// node src/index.js
import { runPartie1Tests } from './tests/partie1.test.js';
import { runPartie2Tests } from './tests/partie2.test.js';
import { runPartie3Tests } from './tests/partie3.test.js';
import { runPartie4Tests } from './tests/partie4.test.js';
console.log('🚀 Exercice 3 - Version Segmentée Complète');
console.log('=========================================');
runPartie1Tests();
runPartie2Tests();
runPartie3Tests();
runPartie4Tests();
console.log('\n✅ Tous les tests terminés!');
