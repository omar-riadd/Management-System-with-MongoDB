
# Student Management System with MongoDB

## Overview

This project is a full-stack management system for handling students, instructors, and courses. It uses:\
Local MongoDB (for primary storage)\
MongoDB Atlas (cloud database for backup/sync)\
Node.js + Express (backend API)\
HTML/JS frontend (CRUD interface)\

The system supports:\
Viewing, adding, updating, and deleting documents in students, instructors, and courses collections.\
Automatic or manual assignment of _id for all documents.\
Multi-course management for students and instructors.\
Periodic sync between local MongoDB and Atlas.\
## Features

### Dynamic CRUD operations for three collections:
- Students: _id, name, age, department, gpa, courses (array)
- Instructors: _id, name, age, courses (array), salary
- Courses: _id, name, hours
### ID management:
- Manual entry of _id is allowed.
- Auto-generated if left blank.
- Multi-course support:
- Students can have multiple courses.
- Instructors can teach multiple courses.
- Input is comma-separated in the UI and stored as an array in MongoDB.
- Full sync between local MongoDB and MongoDB Atlas:
- Sync runs every 10 seconds (customizable).
- Ensures local and cloud databases are consistent.
- MongoDB Compass compatible:
    You can inspect and manage data visually using Compass.

## Structure
```bash
student-ui/
├─ node_modules/           # Installed Node.js packages
├─ public/
│  └─ index.html           # Frontend UI
├─ server.js               # Express server, CRUD API for all collections
├─ sync.js                 # Periodic sync between local MongoDB and Atlas
├─ package.json            # Project metadata and dependencies
└─ package-lock.json       # Locked package versions

```
## Setup Instructions
1. Clone the project
```bash
git clone https://github.com/omar-riadd/Management-System-with-MongoDB.git
cd Management-System-with-MongoDB
```
2. Install dependencies
```bash
npm install
```
3. Start the backend server
```javascript
node server.js
```

4. Open the frontend
- Open public/index.html in your browser, or navigate to http://localhost:3000

5. Configure MongoDB Compass

- Local MongoDB:
    - Hostname: 127.0.0.1
    - Port: 27017

- Atlas MongoDB:

    - Paste your mongodb+srv://<user>:<password>@cluster0.rze0qt8.mongodb.net/universityDB connection string.

6. Start Sync
```javascript
node sync.js
```
## Usage

- Select Collection: Students, Instructors, or Courses.

- View Records: The table displays all documents in the selected collection.

- Add / Edit:
    - Fill in the fields.
    - _id can be specified manually or left blank for auto-generation.

For courses in students and instructors, enter multiple values separated by commas.
Delete: Click Delete next to a row to remove it.


## Notes
- Changes made in the UI affect the local MongoDB first.
- The sync script copies updates to MongoDB Atlas automatically.
- You can also use MongoDB Compass to view and manage all collections.


## Dependencies
- https://nodejs.org/
- https://expressjs.com/
- https://www.npmjs.com/package/body-parser
- https://www.npmjs.com/package/mongodb
