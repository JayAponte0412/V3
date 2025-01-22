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

// Get readers route
app.get("/readers", (req, res) => {
  const query = "SELECT reader_name FROM readers";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get books route
app.get("/books", (req, res) => {
  const query = "SELECT book_id AS id, title, author_name, image_link, availability FROM books";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Toggle book availability
app.post("/books/toggle", (req, res) => {
  const { bookId, availability } = req.body;
  const query = "UPDATE books SET availability = ? WHERE book_id = ?";
  db.query(query, [availability, bookId], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

// Add review
app.post("/reviews", (req, res) => {
  const { bookId, reviewer, rating, comment } = req.body;
  const query = "INSERT INTO reviews (book_id, reviewer, rating, comment) VALUES (?, ?, ?, ?)";
  db.query(query, [bookId, reviewer, rating, comment], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

// Get reviews for a book
app.get("/reviews/:bookId", (req, res) => {
  const { bookId } = req.params;
  const query = "SELECT reviewer, rating, comment FROM reviews WHERE book_id = ?";
  db.query(query, [bookId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
