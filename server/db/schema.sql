DROP DATABASE IF EXISTS ladlemon_db;
CREATE DATABASE ladlemon_db;
\c ladlemon_db;
-- database.sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  poster_image VARCHAR(255),
  invite_code VARCHAR(50) UNIQUE
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);