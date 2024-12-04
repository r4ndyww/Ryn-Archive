const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const tanggal = moment.tz('Asia/Jakarta').locale('id').format('DD/MM/YYYY HH:mm');

const app = express();
const PORT = process.env.PORT || 4000;

app.enable("trust proxy");
app.set("json spaces", 2);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/buku-paket/kelas-7', express.static(path.join(__dirname, 'kelas-7')));
app.use('/buku-paket/kelas-8', express.static(path.join(__dirname, 'kelas-8')));
app.use('/buku-paket/kelas-9', express.static(path.join(__dirname, 'kelas-9')));
app.use('/buku-paket', express.static(path.join(__dirname, 'buku-paket')));
app.use('/bot-introduction', express.static(path.join(__dirname, 'ibukii')));
app.use('/portofolio', express.static(path.join(__dirname, 'portofolio')));
app.use('/credits', express.static(path.join(__dirname, 'credits')));
app.use('/posts', express.static(path.join(__dirname, 'posts')));

// MongoDB Connection
const mongoURI = 'mongodb+srv://randyyuankurnianto20:Randyyyyy2009@rynn-archive.akfzq.mongodb.net/?retryWrites=true&w=majority&appName=Rynn-Archive'; // Ganti dengan URI MongoDB Anda

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Mongoose Schema
const postSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, default: tanggal },
    ipAddress: { type: String },
});

const Post = mongoose.model('Post', postSchema);

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.post('/api/posts', async (req, res) => {
    const { content, author } = req.body;
    const ipAddress = req.ip;
    if (!content || content.trim() === '' || !author || author.trim() === '') {
        return res.status(400).json({ error: 'Content and author are required' });
    }
    const bannedWords = ["kontol", "bangsat", "tolol", "tai"];
    if (bannedWords.some(word => content.toLowerCase().includes(word.toLowerCase()))) {
        return res.status(400).json({ error: 'Konten mengandung kata-kata terlarang' });
    }
    try {
        const existingPost = await Post.findOne({ author, ipAddress });
        if (existingPost) {
            return res.status(400).json({ error: 'Anda sudah pernah memposting dari perangkat ini' });
        }
        const newPost = new Post({ content, author, ipAddress });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error adding post:', error);
        res.status(500).json({ error: 'Failed to add post' });
    }
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

app.get('/portofolio', (req, res) => {
    res.sendFile(path.join(__dirname, 'portofolio', 'index.html'));
});

app.get('/bot-introduction', (req, res) => {
    res.sendFile(path.join(__dirname, 'ibukii', 'index.html'));
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
