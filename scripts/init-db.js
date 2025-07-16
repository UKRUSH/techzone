#!/usr/bin/env node

import { initializeDatabaseConnection, testDatabaseConnection } from '../lib/prisma.js';

async function initializeDatabase() {
  console.log('🚀 Initializing database connection...');
  
  try {
    // Test connection
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      console.log('❌ Initial connection test failed, retrying...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const retryConnection = await testDatabaseConnection();
      if (!retryConnection) {
        throw new Error('Database connection failed after retry');
      }
    }
    
    // Initialize connection pool
    await initializeDatabaseConnection();
    
    console.log('✅ Database initialization complete');
    console.log('🔗 Connection pool ready for fast queries');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
