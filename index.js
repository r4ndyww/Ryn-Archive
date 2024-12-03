const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 4000;

app.enable("trust proxy");
app.set("json spaces", 2);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/buku-paket/kelas-7', express.static(path.join(__dirname, 'kelas-7')));
app.use('/buku-paket/kelas-8', express.static(path.join(__dirname, 'kelas-8')));
app.use('/buku-paket/kelas-9', express.static(path.join(__dirname, 'kelas-9')));
app.use('/buku-paket', express.static(path.join(__dirname, 'buku-paket')));
app.use('/credits', express.static(path.join(__dirname, 'credits')));
app.use('/posts', express.static(path.join(__dirname, 'posts')));

// Database path
const databasePath = path.join(__dirname, 'database.json');
const getDatabase = () => JSON.parse(fs.readFileSync(databasePath));

// API to get posts
app.get('/api/posts', (req, res) => {
    const db = getDatabase();
    res.json(db.posts);
});

// API to add a new post
app.post('/api/posts', (req, res) => {
    const db = getDatabase();
    const { content, author } = req.body;
    const newPost = {
        content,
        author,
        date: new Date().toLocaleString()
    };
    db.posts.push(newPost);
    fs.writeFileSync(databasePath, JSON.stringify(db, null, 2));
    res.status(201).json(newPost);
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/buku-paket/kelas-7', (req, res) => {
    res.sendFile(path.join(__dirname, 'kelas-7', 'index.html'));
});

app.get('/buku-paket/kelas-8', (req, res) => {
    res.sendFile(path.join(__dirname, 'kelas-8', 'index.html'));
});

app.get('/buku-paket/kelas-9', (req, res) => {
    res.sendFile(path.join(__dirname, 'kelas-9', 'index.html'));
});

app.get('/buku-paket', (req, res) => {
    res.sendFile(path.join(__dirname, 'buku-paket', 'index.html'));
});

app.get('/posts', (req, res) => {
    res.sendFile(path.join(__dirname, 'posts', 'index.html'));
});

app.get('/credits', (req, res) => {
    res.sendFile(path.join(__dirname, 'credits', 'index.html'));
});

// Error handlers
app.use((req, res, next) => {
    res.status(404).sendFile(process.cwd() + "/public/404.html");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).sendFile(process.cwd() + "/public/500.html");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
