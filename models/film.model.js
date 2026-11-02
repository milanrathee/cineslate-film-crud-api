/**
 * ============================================================================
 * CINESLATE — SHORT FILM & FESTIVAL SCREENING MANAGER
 * Model: Short Film Submission Schema
 * File: models/film.model.js
 * ============================================================================
 * 
 * VIVA / EVALUATION NOTE:
 * Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
 * It manages relationships between data, provides schema validation, and is
 * used to translate between code objects and the representation of those
 * objects in MongoDB.
 */

const mongoose = require('mongoose');

// Allowed film genres for the festival
const VALID_GENRES = ['Drama', 'Thriller', 'Sci-Fi', 'Documentary', 'Comedy'];

// Allowed screening stages in the festival pipeline
const VALID_STATUSES = ['Submitted', 'Shortlisted', 'Screened'];

/**
 * filmSchema defines the blueprint and data constraints for each short film.
 */
const filmSchema = new mongoose.Schema(
  {
    // The official title of the short film
    filmTitle: {
      type: String,
      required: [true, 'Film title is required.'],
      trim: true,
      minlength: [2, 'Film title must have at least 2 characters.'],
      maxlength: [120, 'Film title cannot exceed 120 characters.']
    },

    // Name of the primary director
    directorName: {
      type: String,
      required: [true, 'Director name is required.'],
      trim: true,
      minlength: [2, 'Director name must have at least 2 characters.'],
      maxlength: [80, 'Director name cannot exceed 80 characters.']
    },

    // Genre classification (restricted to the 5 festival categories)
    genre: {
      type: String,
      required: [true, 'Genre is required.'],
      enum: {
        values: VALID_GENRES,
        message: '{VALUE} is not a valid genre. Choose from: ' + VALID_GENRES.join(', ')
      }
    },

    // Duration of the short film in minutes (must be a positive number)
    runtimeMins: {
      type: Number,
      required: [true, 'Runtime in minutes is required.'],
      min: [1, 'Runtime must be at least 1 minute.'],
      max: [300, 'Runtime cannot exceed 300 minutes (5 hours).']
    },

    // Current stage in the festival curation pipeline
    screeningStatus: {
      type: String,
      default: 'Submitted',
      enum: {
        values: VALID_STATUSES,
        message: '{VALUE} is not a valid status. Choose from: ' + VALID_STATUSES.join(', ')
      }
    }
  },
  {
    // Automatically creates `createdAt` and `updatedAt` ISO date fields
    timestamps: true
  }
);

// Compile the schema into a Mongoose Model named 'Film' (stored as 'films' collection in MongoDB)
const Film = mongoose.model('Film', filmSchema);

module.exports = Film;
