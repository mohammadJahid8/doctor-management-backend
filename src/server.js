/* eslint-disable no-console */
globalThis.File = class File {};
import mongoose from 'mongoose';

import config from './config/config.js';
import app from './app.js';

async function main() {
  await mongoose.connect(config.database_url, {
    autoIndex: true,
  });
  console.log('Connected to MongoDB');
  app.listen(config.port, () => {
    console.log(`Server running at port ${config.port}`);
  });
}
main();
