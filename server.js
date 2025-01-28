//adding Express.js and middleware here
import express from "express";
import { createConnection } from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:5501"] }));
app.use(express.json());

// Connect to MySQL database
const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Jay123456',
  database: 'myDB'
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database.");
});

// Get readers route 'API endpoints need to be added bellow for readers books and reviews'
app.get("/readers", (req, res) => {
  const query = "SELECT reader_name FROM readers";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Getting books 
app.get("/books", (req, res) => {
  const query = "SELECT book_id AS id, title, author_name, image_link, availability FROM books";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// books available/or not
app.post("/books/toggle", (req, res) => {
  const { bookId, availability } = req.body;
  const query = "UPDATE books SET availability = ? WHERE book_id = ?";
  db.query(query, [availability, bookId], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

app.post("/reviews", (req, res) => {
  const { bookId, reviewer, rating, comment } = req.body;
  const query = "INSERT INTO reviews (book_id, reviewer, rating, comment) VALUES (?, ?, ?, ?)";
  db.query(query, [bookId, reviewer, rating, comment], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

//  reviews for a book
app.get("/reviews/:bookId", (req, res) => {
  const { bookId } = req.params;
  const query = "SELECT reviewer, rating, comment FROM reviews WHERE book_id = ?";
  db.query(query, [bookId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});



// Start the server (use node server.js in terminal)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
