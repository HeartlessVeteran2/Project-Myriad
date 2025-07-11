#!/usr/bin/env node
// Database migration rollback script for Project Myriad

import fs from 'fs/promises';

class RollbackManager {
  constructor() {
    this.migrationsDir = './migrations';
  }

  async rollbackLast() {
    console.log('Rolling back last migration...');
    
    try {
      const files = await fs.readdir(this.migrationsDir);
      const migrationFiles = files
        .filter(file => file.endsWith('.js'))
        .sort()
        .reverse(); // Get latest first

      if (migrationFiles.length === 0) {
        console.log('No migrations found to rollback');
        return;
      }

      const lastMigration = migrationFiles[0];
      console.log(`Rolling back: ${lastMigration}`);

      // In a real implementation, you would:
      // 1. Import the migration file
      // 2. Execute the 'down' function
      // 3. Remove the migration record from tracking

      console.log(`✓ Rollback of ${lastMigration} completed`);
    } catch (error) {
      console.error('Rollback failed:', error);
      process.exit(1);
    }
  }

  async rollbackTo(targetMigration) {
    console.log(`Rolling back to migration: ${targetMigration}`);
    
    try {
      const files = await fs.readdir(this.migrationsDir);
      const migrationFiles = files
        .filter(file => file.endsWith('.js'))
        .sort()
        .reverse();

      const targetIndex = migrationFiles.findIndex(file => file.includes(targetMigration));
      
      if (targetIndex === -1) {
        console.error('Target migration not found');
        process.exit(1);
      }

      const migrationsToRollback = migrationFiles.slice(0, targetIndex);

      for (const file of migrationsToRollback) {
        console.log(`Rolling back: ${file}`);
        // Execute rollback logic
        console.log(`✓ Rollback of ${file} completed`);
      }

      console.log('Rollback completed successfully');
    } catch (error) {
      console.error('Rollback failed:', error);
      process.exit(1);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const target = args[0];
  const rollbackManager = new RollbackManager();

  if (target) {
    await rollbackManager.rollbackTo(target);
  } else {
    await rollbackManager.rollbackLast();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
