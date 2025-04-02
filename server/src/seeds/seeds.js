import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../config/connection.js';
import { DataTypes, Model } from 'sequelize';
import dotenv from 'dotenv';

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the server root (adjust the path as needed)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Define the Event model if not already defined
class Event extends Model {}
Event.init(
  {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    poster_image: DataTypes.STRING,
    invite_code: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: 'events',
    timestamps: false,
  }
);

async function seed() {
  try {
    // Sync the database without forcing (this will create missing tables but won't drop existing ones)
    await sequelize.sync();
    
    // Read and parse events.json
    const eventsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'events.json'), 'utf8')
    );

    // Bulk insert events data if not already inserted
    // You can further check if the table is empty and only then insert data.
    await Event.bulkCreate(eventsData, { ignoreDuplicates: true });
    
    console.log('Seeding completed.');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
