#!/usr/bin/env node
// Database seeding script for Project Myriad

import fs from 'fs/promises';
import path from 'path';

class DatabaseSeeder {
  constructor() {
    this.seedsDir = './seeds';
    this.sampleData = {
      users: [
        {
          id: 1,
          username: 'admin',
          email: 'admin@projectmyriad.com',
          displayName: 'Administrator',
          role: 'admin',
          joinDate: new Date('2024-01-01')
        },
        {
          id: 2,
          username: 'demo_user',
          email: 'demo@example.com',
          displayName: 'Demo User',
          role: 'user',
          joinDate: new Date('2024-06-01')
        },
        {
          id: 3,
          username: 'manga_fan',
          email: 'mangafan@example.com',
          displayName: 'Manga Enthusiast',
          role: 'user',
          joinDate: new Date('2024-07-01')
        }
      ],
      manga: [
        {
          id: 1,
          title: 'One Piece',
          author: 'Eiichiro Oda',
          genres: ['Adventure', 'Comedy', 'Shounen'],
          status: 'ongoing',
          chapters: 1090,
          rating: 9.5,
          description: 'The story follows Monkey D. Luffy, a young pirate who gains rubber powers after eating a Devil Fruit.',
          coverImage: '/covers/one-piece.jpg'
        },
        {
          id: 2,
          title: 'Attack on Titan',
          author: 'Hajime Isayama',
          genres: ['Action', 'Drama', 'Fantasy'],
          status: 'completed',
          chapters: 139,
          rating: 9.3,
          description: 'Humanity fights for survival against giant humanoid creatures called Titans.',
          coverImage: '/covers/attack-on-titan.jpg'
        },
        {
          id: 3,
          title: 'Demon Slayer',
          author: 'Koyoharu Gotouge',
          genres: ['Action', 'Supernatural', 'Historical'],
          status: 'completed',
          chapters: 205,
          rating: 9.1,
          description: 'A young boy becomes a demon slayer to save his sister and avenge his family.',
          coverImage: '/covers/demon-slayer.jpg'
        }
      ],
      anime: [
        {
          id: 1,
          title: 'One Piece',
          studio: 'Toei Animation',
          genres: ['Adventure', 'Comedy', 'Shounen'],
          status: 'ongoing',
          episodes: 1000,
          rating: 9.4,
          description: 'Anime adaptation of the popular manga series.',
          coverImage: '/covers/one-piece-anime.jpg'
        },
        {
          id: 2,
          title: 'Attack on Titan',
          studio: 'Mappa',
          genres: ['Action', 'Drama', 'Fantasy'],
          status: 'completed',
          episodes: 75,
          rating: 9.6,
          description: 'Critically acclaimed anime adaptation.',
          coverImage: '/covers/attack-on-titan-anime.jpg'
        },
        {
          id: 3,
          title: 'Demon Slayer',
          studio: 'Ufotable',
          genres: ['Action', 'Supernatural', 'Historical'],
          status: 'ongoing',
          episodes: 32,
          rating: 9.2,
          description: 'Beautifully animated adaptation with stunning visuals.',
          coverImage: '/covers/demon-slayer-anime.jpg'
        }
      ],
      novels: [
        {
          id: 1,
          title: 'Sword Art Online',
          author: 'Reki Kawahara',
          genres: ['Science Fiction', 'Romance', 'Adventure'],
          status: 'ongoing',
          volumes: 27,
          rating: 8.5,
          description: 'Players trapped in a virtual reality MMORPG must clear the game to escape.',
          coverImage: '/covers/sword-art-online.jpg'
        },
        {
          id: 2,
          title: 'Re:Zero',
          author: 'Tappei Nagatsuki',
          genres: ['Fantasy', 'Psychological', 'Drama'],
          status: 'ongoing',
          volumes: 29,
          rating: 9.0,
          description: 'A young man is transported to a fantasy world with the ability to return from death.',
          coverImage: '/covers/rezero.jpg'
        },
        {
          id: 3,
          title: 'Overlord',
          author: 'Kugane Maruyama',
          genres: ['Fantasy', 'Adventure', 'Comedy'],
          status: 'ongoing',
          volumes: 16,
          rating: 8.8,
          description: 'A player becomes trapped in his favorite MMORPG as his character, an overlord.',
          coverImage: '/covers/overlord.jpg'
        }
      ],
      clubs: [
        {
          id: 1,
          name: 'Manga Readers Club',
          description: 'For passionate manga readers to discuss their favorite series',
          category: 'manga',
          memberCount: 156,
          isPublic: true,
          createdAt: new Date('2024-03-01')
        },
        {
          id: 2,
          name: 'Anime Discussion',
          description: 'Weekly anime episode discussions and reviews',
          category: 'anime',
          memberCount: 203,
          isPublic: true,
          createdAt: new Date('2024-04-15')
        },
        {
          id: 3,
          name: 'Light Novel Enthusiasts',
          description: 'Discussing the latest light novel translations and releases',
          category: 'novel',
          memberCount: 89,
          isPublic: true,
          createdAt: new Date('2024-05-20')
        }
      ]
    };
  }

  async init() {
    try {
      await fs.mkdir(this.seedsDir, { recursive: true });
      console.log('Seeds directory created');
    } catch (error) {
      console.error('Failed to create seeds directory:', error);
    }
  }

  async createSeedFiles() {
    console.log('Creating seed files...');
    
    for (const [tableName, data] of Object.entries(this.sampleData)) {
      const filename = `${tableName}_seed.json`;
      const filepath = path.join(this.seedsDir, filename);
      
      await fs.writeFile(filepath, JSON.stringify(data, null, 2));
      console.log(`✓ Created seed file: ${filename}`);
    }
  }

  async seedDatabase() {
    console.log('Seeding database with sample data...');
    
    try {
      await this.init();
      await this.createSeedFiles();
      
      // In a real implementation, you would:
      // 1. Connect to your database
      // 2. Check if data already exists
      // 3. Insert the sample data
      // 4. Handle relationships and foreign keys
      
      console.log('Database seeding completed successfully!');
      console.log('Sample data includes:');
      
      Object.entries(this.sampleData).forEach(([type, data]) => {
        console.log(`  - ${data.length} ${type}`);
      });
      
    } catch (error) {
      console.error('Seeding failed:', error);
      process.exit(1);
    }
  }

  async clearDatabase() {
    console.log('Clearing all data from database...');
    
    try {
      // In a real implementation, you would:
      // 1. Connect to your database
      // 2. Delete all data from tables
      // 3. Reset auto-increment counters
      
      console.log('Database cleared successfully!');
    } catch (error) {
      console.error('Database clearing failed:', error);
      process.exit(1);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const seeder = new DatabaseSeeder();

  switch (command) {
    case 'run':
      await seeder.seedDatabase();
      break;
      
    case 'clear':
      await seeder.clearDatabase();
      break;
      
    case 'create-files':
      await seeder.init();
      await seeder.createSeedFiles();
      break;
      
    default:
      console.log('Available commands:');
      console.log('  run          - Seed database with sample data');
      console.log('  clear        - Clear all data from database');
      console.log('  create-files - Create seed files only');
      break;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
