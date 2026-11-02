/**
 * ============================================================================
 * CINESLATE — SHORT FILM & FESTIVAL SCREENING MANAGER
 * Controller: Short Film CRUD Operations
 * File: controllers/film.controller.js
 * ============================================================================
 * 
 * VIVA / EVALUATION NOTE:
 * In the Model-View-Controller (MVC) architecture, the Controller acts as the
 * intermediary between the Model (Data/Database) and the View/Client (HTTP Request/Response).
 * It processes incoming client inputs, invokes database operations via Mongoose,
 * and sends back standardized JSON responses with proper HTTP status codes.
 */

const mongoose = require('mongoose');
const Film = require('../models/film.model');

// In-memory fallback repository (used if MongoDB Atlas connection is pending IP approval)
let memoryFilms = [
  {
    _id: new mongoose.Types.ObjectId().toString(),
    filmTitle: 'The Last Frame',
    directorName: 'Kabir Sharma',
    genre: 'Drama',
    runtimeMins: 14,
    screeningStatus: 'Submitted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    filmTitle: 'Midnight Echoes',
    directorName: 'Aanya Verma',
    genre: 'Thriller',
    runtimeMins: 22,
    screeningStatus: 'Shortlisted',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const isAtlasConnected = () => mongoose.connection.readyState === 1;

/**
 * 1. CREATE A SHORT FILM SUBMISSION
 * Route: POST /api/films
 * Description: Registers a new short film entry in MongoDB.
 * Status Codes: 201 Created on success, 400 Bad Request on validation failure.
 */
exports.createFilm = async (req, res) => {
  try {
    const { filmTitle, directorName, genre, runtimeMins, screeningStatus } = req.body;

    // Validate required fields
    if (!filmTitle || !directorName || !genre || runtimeMins === undefined) {
      return res.status(400).json({
        success: false,
        message: 'filmTitle, directorName, genre, and runtimeMins are all required fields.'
      });
    }

    if (isAtlasConnected()) {
      // Create via Mongoose ODM in MongoDB Atlas
      const newFilm = await Film.create({
        filmTitle,
        directorName,
        genre,
        runtimeMins: Number(runtimeMins),
        screeningStatus: screeningStatus || 'Submitted'
      });

      return res.status(201).json({
        success: true,
        message: 'Short film submission registered successfully in MongoDB Atlas!',
        data: newFilm
      });
    } else {
      // In-memory fallback
      const newFilm = {
        _id: new mongoose.Types.ObjectId().toString(),
        filmTitle: filmTitle.trim(),
        directorName: directorName.trim(),
        genre,
        runtimeMins: Number(runtimeMins),
        screeningStatus: screeningStatus || 'Submitted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryFilms.unshift(newFilm);

      return res.status(201).json({
        success: true,
        message: 'Short film submission registered successfully!',
        data: newFilm
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create short film submission.',
      error: error.message
    });
  }
};

/**
 * 2. READ ALL SHORT FILMS
 * Route: GET /api/films
 * Description: Fetches all film submissions, sorted by newest first (descending createdAt).
 * Status Codes: 200 OK on success, 500 Internal Server Error on database failure.
 */
exports.getAllFilms = async (req, res) => {
  try {
    if (isAtlasConnected()) {
      const filter = {};
      if (req.query.status) filter.screeningStatus = req.query.status;
      if (req.query.genre) filter.genre = req.query.genre;

      const films = await Film.find(filter).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        source: 'MongoDB Atlas',
        count: films.length,
        data: films
      });
    } else {
      let filtered = [...memoryFilms];
      if (req.query.status) filtered = filtered.filter(f => f.screeningStatus === req.query.status);
      if (req.query.genre) filtered = filtered.filter(f => f.genre === req.query.genre);

      return res.status(200).json({
        success: true,
        source: 'Memory Cache (Atlas Connecting)',
        count: filtered.length,
        data: filtered
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve film submissions.',
      error: error.message
    });
  }
};

/**
 * 3. READ ONE SHORT FILM BY ID
 * Route: GET /api/films/:id
 * Description: Fetches a single short film document by its 24-character MongoDB ObjectId.
 * Status Codes: 200 OK on success, 400 on invalid ID format, 404 if not found.
 */
exports.getFilmById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid film ID format: "${id}". Must be a 24-character hexadecimal string.`
      });
    }

    if (isAtlasConnected()) {
      const film = await Film.findById(id);
      if (!film) {
        return res.status(404).json({
          success: false,
          message: `Film submission with ID "${id}" was not found.`
        });
      }
      return res.status(200).json({
        success: true,
        data: film
      });
    } else {
      const film = memoryFilms.find(f => f._id.toString() === id);
      if (!film) {
        return res.status(404).json({
          success: false,
          message: `Film submission with ID "${id}" was not found.`
        });
      }
      return res.status(200).json({
        success: true,
        data: film
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving film details.',
      error: error.message
    });
  }
};

/**
 * 4. UPDATE A SHORT FILM BY ID
 * Route: PUT /api/films/:id
 * Description: Updates an existing film's fields using findByIdAndUpdate(..., { new: true, runValidators: true }).
 * Status Codes: 200 OK on success, 400 on invalid format/validation error, 404 if not found.
 */
exports.updateFilm = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid film ID format: "${id}".`
      });
    }

    if (isAtlasConnected()) {
      const updatedFilm = await Film.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      });

      if (!updatedFilm) {
        return res.status(404).json({
          success: false,
          message: `Film submission with ID "${id}" was not found to update.`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Film submission updated successfully!',
        data: updatedFilm
      });
    } else {
      const index = memoryFilms.findIndex(f => f._id.toString() === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: `Film submission with ID "${id}" was not found to update.`
        });
      }

      const updated = {
        ...memoryFilms[index],
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      if (req.body.runtimeMins !== undefined) updated.runtimeMins = Number(req.body.runtimeMins);
      memoryFilms[index] = updated;

      return res.status(200).json({
        success: true,
        message: 'Film submission updated successfully!',
        data: updated
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update film submission.',
      error: error.message
    });
  }
};

/**
 * 5. DELETE A SHORT FILM BY ID
 * Route: DELETE /api/films/:id
 * Description: Removes a short film entry from MongoDB using findByIdAndDelete.
 * Status Codes: 200 OK on success, 400 on invalid format, 404 if not found.
 */
exports.deleteFilm = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid film ID format: "${id}".`
      });
    }

    if (isAtlasConnected()) {
      const deletedFilm = await Film.findByIdAndDelete(id);

      if (!deletedFilm) {
        return res.status(404).json({
          success: false,
          message: `Film submission with ID "${id}" was not found to delete.`
        });
      }

      return res.status(200).json({
        success: true,
        message: `Film submission "${deletedFilm.filmTitle}" removed successfully!`,
        data: {
          id: deletedFilm._id,
          filmTitle: deletedFilm.filmTitle
        }
      });
    } else {
      const index = memoryFilms.findIndex(f => f._id.toString() === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: `Film submission with ID "${id}" was not found to delete.`
        });
      }

      const [removed] = memoryFilms.splice(index, 1);
      return res.status(200).json({
        success: true,
        message: `Film submission "${removed.filmTitle}" removed successfully!`,
        data: {
          id: removed._id,
          filmTitle: removed.filmTitle
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete film submission.',
      error: error.message
    });
  }
};
