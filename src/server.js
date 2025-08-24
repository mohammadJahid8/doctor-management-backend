/* eslint-disable no-console */
globalThis.File = class File { };
import mongoose from 'mongoose';

import config from './config/config.js';
import app from './app.js';
import { initializeCronJobs } from './utils/cronJobs.js';

async function main() {
  await mongoose.connect(config.database_url, {
    autoIndex: true,
  });
  console.log('Connected to MongoDB');

  // Initialize cron jobs
  initializeCronJobs();

  app.listen(config.port, () => {
    console.log(`Server running at port ${config.port}`);
  });
}
main();
