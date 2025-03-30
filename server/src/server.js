// server.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import sequelize from './config/connection.js';
import { DataTypes, Model } from 'sequelize';


const app = express();
app.use(cors());
app.use(express.json());

// Define the Event model
class Event extends Model {}
Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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

// Define the Reservation model
class Reservation extends Model {}
Reservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: 'reservations',
    timestamps: false,
  }
);

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error('Database connection error:', err));

// Endpoint to verify invite code and return event info
app.post('/api/invite', async (req, res) => {
  const { inviteCode } = req.body;
  try {
    const event = await Event.findOne({ where: { invite_code: inviteCode } });
    if (!event) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }
    return res.json({ event });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Test endpoint to check server status
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  return res.status(200).send('Test endpoint hit');
});

// Endpoint to reserve an event spot
app.post('/api/reserve', async (req, res) => {
  const { eventId, firstName, lastName, email } = req.body;
  try {
    // Check if email already exists for the event
    const existingReservation = await Reservation.findOne({
      where: { event_id: eventId, email },
    });
    if (existingReservation) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create the reservation record in the database
    const reservation = await Reservation.create({
      event_id: eventId,
      first_name: firstName,
      last_name: lastName,
      email: email,
    });

    // Append the reservation to a JSON file
    const filePath = path.join(__dirname, 'reservations.json');
    let reservationsData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
      reservationsData = JSON.parse(fileContent);
    }
    reservationsData.push(reservation.toJSON());
    fs.writeFileSync(filePath, JSON.stringify(reservationsData, null, 2));

    return res.json({
      message: 'Thanks for your submission. You are in waiting list',
      reservation,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
