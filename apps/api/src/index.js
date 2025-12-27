import { startServer } from './server.js';
import { initStore } from './repositories/store.js';

initStore();
// Start the server
startServer(); 