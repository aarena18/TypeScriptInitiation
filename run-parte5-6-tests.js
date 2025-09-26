// Test runner for partie 5-6
import { runPartie56Tests } from './dist/tests/partie5-6.test.js';

try {
  console.log('🚀 Starting Parts 5 & 6 Tests...');
  runPartie56Tests();
  console.log('✅ Tests completed successfully!');
} catch (error) {
  console.error('❌ Test execution failed:', error);
  console.error(error.stack);
}
