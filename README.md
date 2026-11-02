# 🎬 CineSlate — Short Film & Fest Screening Manager

> A complete beginner-friendly full-stack CRUD web application built for university evaluation and laboratory viva examinations. Built exclusively with **Node.js**, **Express.js**, **MongoDB Atlas (Mongoose ODM)**, and pure **HTML5 & Vanilla CSS**.

![CineSlate Theme](https://img.shields.io/badge/Theme-Cinema%20Premiere-amber?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Pure HTML/CSS](https://img.shields.io/badge/Frontend-Vanilla%20HTML%2FCSS-E34F26?style=for-the-badge&logo=html5&logoColor=white)

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Folder & File Architecture (MVC)](#-folder--file-architecture-mvc)
3. [Quick Start & Setup Instructions](#-quick-start--setup-instructions)
4. [MongoDB Atlas Setup Guide](#-mongodb-atlas-setup-guide)
5. [Complete Postman API Testing Guide](#-complete-postman-api-testing-guide)
6. [Git & GitHub Commands Guide](#-git--github-commands-guide)
7. [Viva & Oral Examination Cheat-Sheet](#-viva--oral-examination-cheat-sheet)

---

## 📽️ Project Overview

**CineSlate** streamlines the curation and screening pipeline of short film festivals. Festival organizers can:
- **Register Submissions (`POST`)**: Input film title, director name, genre category, duration (runtime in minutes), and initial status.
- **Browse Festival Lineup (`GET`)**: View all submitted short films ordered chronologically (newest first) with genre pills and live countdown statistics.
- **Inspect Specific Entry (`GET /:id`)**: Fetch details of any film by its MongoDB `_id`.
- **Advance Pipeline Stage (`PUT /:id`)**: Progress films through festival stages (`Submitted` ➔ `Shortlisted` ➔ `Screened`) or update metadata.
- **Withdraw / Remove Entry (`DELETE /:id`)**: Delete rejected or disqualified entries.
- **Live Festival Marquee**: 4 real-time summary counters tracking:
  1. *Total Submissions*
  2. *Shortlisted Films*
  3. *Screened Films*
  4. *Total Festival Runtime (Mins)*

---

## 📁 Folder & File Architecture (MVC)

The project adheres to the strict **Model-View-Controller (MVC)** architectural pattern:

```
cineslate-film-crud-api/
├── models/
│   └── film.model.js            # Mongoose Schema & Model (data validation, constraints, timestamps)
├── controllers/
│   └── film.controller.js       # Business logic for all 5 CRUD operations (async/await, HTTP status codes)
├── routes/
│   └── film.route.js            # Express Router mapping HTTP verbs to controllers under /api/films
├── public/
│   ├── index.html               # Pure HTML5 UI with marquee metrics, submission form & lineup cards
│   └── style.css                # Cinema Premiere & Clapperboard Dark Gold theme (Pure CSS)
├── .env                         # Environment variables (PORT=3000, MONGO_URI) [Ignored in Git]
├── .env.example                 # Public template for environment variables
├── .gitignore                   # Excludes node_modules and .env from version control
├── index.js                     # Main Express server entry, DB connection & static file serving
├── package.json                 # Project manifest & npm scripts
└── README.md                    # Comprehensive documentation and viva evaluation guide
```

---

## 🚀 Quick Start & Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x LTS)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) Account

### 1. Clone or Open Project
```bash
cd cineslate-film-crud-api
```

### 2. Install Dependencies
```bash
npm install
```
Installed packages:
- `express`: Fast, unopinionated web framework for Node.js
- `mongoose`: Elegant MongoDB object modeling (ODM)
- `dotenv`: Loads environment variables from `.env`
- `nodemon` *(dev)*: Automatically restarts server on file edits

### 3. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.fbqf9ud.mongodb.net/cineslate?retryWrites=true&w=majority
```

### 4. Run the Server
- **Production mode:**
  ```bash
  npm start
  ```
- **Development mode (with auto-reload):**
  ```bash
  npm run dev
  ```

### 5. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🍃 MongoDB Atlas Setup Guide

Follow these steps if you are configuring a new MongoDB Atlas cluster:

1. **Sign in to MongoDB Atlas**: Go to [cloud.mongodb.com](https://cloud.mongodb.com).
2. **Create a Free Cluster**: Click **"Build a Database"** and select the free **M0 Sandbox** tier.
3. **Configure Database User**:
   - Navigate to **Security > Database Access**.
   - Click **"Add New Database User"**.
   - Select **Password Authentication**.
   - Enter a username (e.g. `milan25cse_db_user`) and a secure password.
   - Set **Database User Privileges** to `Read and write to any database` or `Atlas admin`.
   - Click **Add User**.
4. **Configure Network IP Access**:
   - Navigate to **Security > Network Access**.
   - Click **"Add IP Address"**.
   - Click **"Allow Access from Anywhere"** (`0.0.0.0/0`) for development/evaluation mobility, or click **"Add Current IP Address"**.
   - Click **Confirm**.
5. **Get Connection String**:
   - Go to **Database > Clusters**.
   - Click the **"Connect"** button next to your cluster.
   - Choose **"Drivers"** (Node.js).
   - Copy the connection string format:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your credentials, and append the database name `/cineslate`:
     ```
     mongodb+srv://milan25cse_db_user:STGrkhUyLbdV1bSw@cluster0.fbqf9ud.mongodb.net/cineslate?retryWrites=true&w=majority
     ```
   - Paste this exact string into your `.env` file as `MONGO_URI`.

---

## 📮 Complete Postman API Testing Guide

During your university evaluation, the examiner will often ask you to demonstrate each endpoint directly in **Postman Desktop**. Here is the exact cheat-sheet for all 5 CRUD operations:

### Base URL:
```
http://localhost:3000/api/films
```

---

### Test 1: CREATE A Short Film Entry (POST)
- **HTTP Method:** `POST`
- **Request URL:** `http://localhost:3000/api/films`
- **Headers:**
  - `Content-Type`: `application/json`
- **Body:** Select **raw** ➔ choose **JSON** from the dropdown, then paste:
```json
{
  "filmTitle": "The Last Frame",
  "directorName": "Kabir Sharma",
  "genre": "Drama",
  "runtimeMins": 14,
  "screeningStatus": "Submitted"
}
```
- **Expected Status Code:** `201 Created`
- **Expected Response JSON:**
```json
{
  "success": true,
  "message": "Short film submission registered successfully!",
  "data": {
    "_id": "6724...",
    "filmTitle": "The Last Frame",
    "directorName": "Kabir Sharma",
    "genre": "Drama",
    "runtimeMins": 14,
    "screeningStatus": "Submitted",
    "createdAt": "2026-11-02T...",
    "updatedAt": "2026-11-02T...",
    "__v": 0
  }
}
```

---

### Test 2: READ ALL Short Films (GET)
- **HTTP Method:** `GET`
- **Request URL:** `http://localhost:3000/api/films`
- **Headers:** None needed
- **Body:** None
- **Expected Status Code:** `200 OK`
- **Expected Response JSON:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6724...",
      "filmTitle": "The Last Frame",
      "directorName": "Kabir Sharma",
      "genre": "Drama",
      "runtimeMins": 14,
      "screeningStatus": "Submitted",
      "createdAt": "2026-11-02T...",
      "updatedAt": "2026-11-02T..."
    }
  ]
}
```

---

### Test 3: READ ONE Short Film by ID (GET)
- **HTTP Method:** `GET`
- **Request URL:** `http://localhost:3000/api/films/:id`  
  *(Replace `:id` with the 24-character hexadecimal `_id` returned from Test 1, e.g., `http://localhost:3000/api/films/6724abcd...`)*
- **Headers:** None needed
- **Body:** None
- **Expected Status Code:** `200 OK` (or `404 Not Found` if ID does not exist)
- **Expected Response JSON:**
```json
{
  "success": true,
  "data": {
    "_id": "6724...",
    "filmTitle": "The Last Frame",
    "directorName": "Kabir Sharma",
    "genre": "Drama",
    "runtimeMins": 14,
    "screeningStatus": "Submitted"
  }
}
```

---

### Test 4: UPDATE A Short Film by ID (PUT)
- **HTTP Method:** `PUT`
- **Request URL:** `http://localhost:3000/api/films/:id`  
  *(Replace `:id` with your film's `_id`)*
- **Headers:**
  - `Content-Type`: `application/json`
- **Body (raw JSON):**
```json
{
  "screeningStatus": "Shortlisted",
  "runtimeMins": 16
}
```
- **Expected Status Code:** `200 OK`
- **Expected Response JSON:**
```json
{
  "success": true,
  "message": "Film submission updated successfully!",
  "data": {
    "_id": "6724...",
    "filmTitle": "The Last Frame",
    "directorName": "Kabir Sharma",
    "genre": "Drama",
    "runtimeMins": 16,
    "screeningStatus": "Shortlisted",
    "updatedAt": "2026-11-02T..."
  }
}
```

---

### Test 5: DELETE A Short Film by ID (DELETE)
- **HTTP Method:** `DELETE`
- **Request URL:** `http://localhost:3000/api/films/:id`  
  *(Replace `:id` with your film's `_id`)*
- **Headers:** None needed
- **Body:** None
- **Expected Status Code:** `200 OK`
- **Expected Response JSON:**
```json
{
  "success": true,
  "message": "Film submission \"The Last Frame\" removed successfully!",
  "data": {
    "id": "6724...",
    "filmTitle": "The Last Frame"
  }
}
```

---

## 🐙 Git & GitHub Commands Guide

To push your project to a public GitHub repository from scratch:

```bash
# 1. Initialize Git repository
git init

# 2. Check status (verify that node_modules and .env are ignored)
git status

# 3. Add all project files
git add .

# 4. Commit files
git commit -m "feat: complete CineSlate Short Film & Fest Screening Manager CRUD app"

# 5. Rename default branch to main
git branch -M main

# 6. Add remote origin (replace milanrathee with your GitHub username)
git remote add origin https://github.com/milanrathee/cineslate-film-crud-api.git

# 7. Push to GitHub
git push -u origin main
```

---

## 🎓 Viva & Oral Examination Cheat-Sheet

Here are answers to the most common questions university examiners ask during full-stack web evaluations:

### Q1: What is the MVC architecture and how is it implemented in CineSlate?
> **Answer:** MVC stands for **Model-View-Controller**:
> - **Model (`models/film.model.js`)**: Defines the Mongoose schema, fields (`filmTitle`, `directorName`, `genre`, `runtimeMins`, `screeningStatus`), data types, and validation constraints.
> - **View (`public/index.html` & `public/style.css`)**: The presentation layer rendered in the browser. Pure HTML5/CSS served statically via `express.static('public')`.
> - **Controller (`controllers/film.controller.js`)**: Contains the business logic for incoming requests. It communicates with Mongoose to execute queries and formats HTTP responses.
> - **Router (`routes/film.route.js`)**: Directs HTTP verbs (`POST`, `GET`, `PUT`, `DELETE`) to the respective controller actions.

### Q2: Why use Mongoose ODM over the native MongoDB driver?
> **Answer:** 
> - **Schema Enforcement:** MongoDB is schemaless by default. Mongoose enforces strict schemas, data types, required fields, and enum validation at the application level.
> - **Built-in Validation & Typecasting:** Automatically validates constraints (e.g. `min: 1`, `enum: [...]`) before hitting the database.
> - **Automatic Timestamps:** Automatically injects `createdAt` and `updatedAt` timestamps with zero manual code.
> - **Cleaner Syntax:** Simplifies complex operations using methods like `create()`, `find()`, `findByIdAndUpdate()`, and `findByIdAndDelete()`.

### Q3: What is the significance of `{ new: true, runValidators: true }` in `findByIdAndUpdate`?
> **Answer:** 
> - By default, Mongoose's `findByIdAndUpdate` returns the document as it was **before** the update. Passing `{ new: true }` instructs Mongoose to return the **modified, newly updated document**.
> - By default, Mongoose update operations bypass schema validators. Passing `{ runValidators: true }` ensures that any modified field is validated against the schema constraints (e.g., verifying that a new status is in the allowed enum values).

### Q4: Explain the HTTP status codes used in CineSlate.
> **Answer:**
> - `200 OK`: Standard response for successful retrieval (`GET`), update (`PUT`), and deletion (`DELETE`).
> - `201 Created`: Used for `POST /api/films` to signify that a new short film document was successfully inserted into MongoDB.
> - `400 Bad Request`: Returned when client input fails schema validation (e.g., negative runtime or missing required fields) or has an invalid ObjectId format.
> - `404 Not Found`: Returned when attempting to query, update, or delete a film ID that does not exist in the collection.
> - `500 Internal Server Error`: Returned when an unhandled database or server exception occurs.

### Q5: How does Express serve the static HTML/CSS frontend?
> **Answer:** 
> In `index.js`, we configure `app.use(express.static('public'))`. Express automatically maps any file inside the `public/` folder to the root URL. When a user navigates to `http://localhost:3000`, Express serves `public/index.html` and links `public/style.css`.
