/**
 * ============================================================================
 * CINESLATE — SHORT FILM & FESTIVAL SCREENING MANAGER
 * Routes: Film Resource Router
 * File: routes/film.route.js
 * ============================================================================
 * 
 * VIVA / EVALUATION NOTE:
 * An Express Router is an isolated instance of middleware and routes. It allows
 * us to modularize application endpoints by resource (e.g. all /api/films
 * routes live in this file), adhering to RESTful API conventions:
 * 
 * - POST   /api/films      -> Create new resource
 * - GET    /api/films      -> Read collection of resources
 * - GET    /api/films/:id  -> Read individual resource by identifier
 * - PUT    /api/films/:id  -> Update resource by identifier
 * - DELETE /api/films/:id  -> Delete resource by identifier
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createFilm,
  getAllFilms,
  getFilmById,
  updateFilm,
  deleteFilm
} = require('../controllers/film.controller');

// Collection routes (/api/films)
router.route('/')
  .post(createFilm)    // CREATE: Register new film entry
  .get(getAllFilms);   // READ ALL: Fetch all film entries

// Item routes by ID (/api/films/:id)
router.route('/:id')
  .get(getFilmById)    // READ ONE: Fetch single film by MongoDB _id
  .put(updateFilm)     // UPDATE: Modify film entry by MongoDB _id
  .delete(deleteFilm); // DELETE: Remove film entry by MongoDB _id

module.exports = router;
