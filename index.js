const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- Mock Data ---

const lessons = [
    { 
        id: 1, 
        title: "Introduction to Korean", 
        level: "TOPIK 1",
        content: "Her lærer du alfabetet og grunnleggende uttrykk.",
        exercises: [
            { id: 1, question: "Hvordan sier man 'hei'?", answer: "안녕하세요" },
            { id: 2, question: "Hvordan sier man 'takk'?", answer: "감사합니다" }
        ]
    },
    { 
        id: 2, 
        title: "Daily phrases", 
        level: "TOPIK 1",
        content: "Vanlige setninger for dagligliv.",
        exercises: [
            { id: 3, question: "Hvordan sier man 'jeg er sulten'?", answer: "배고파요" }
        ]
    }
];

const users = [
    { id: 1, name: "Robin", email: "robin@example.com", progress: [1] }
];

// --- Lesson Routes ---

// Hent alle leksjoner
app.get('/lessons', (req, res) => {
    res.json(lessons);
});

// Hent leksjon etter ID
app.get('/lessons/:id', (req, res) => {
    const lesson = lessons.find(l => l.id == req.params.id);
    if (!lesson) return res.status(404).send({ error: "Not found" });
    res.json(lesson);
});

// Hent øvelser for en leksjon
app.get('/lessons/:id/exercises', (req, res) => {
    const lesson = lessons.find(l => l.id == req.params.id);
    if (!lesson) return res.status(404).send({ error: "Not found" });
    res.json(lesson.exercises);
});

// Opprett ny leksjon
app.post('/lessons', (req, res) => {
    const newLesson = {
        id: lessons.length + 1,
        ...req.body
    };
    lessons.push(newLesson);
    res.status(201).json(newLesson);
});

// Oppdater leksjon
app.put('/lessons/:id', (req, res) => {
    const lesson = lessons.find(l => l.id == req.params.id);
    if (!lesson) return res.status(404).send({ error: "Not found" });
    Object.assign(lesson, req.body);
    res.json(lesson);
});

// Slett leksjon
app.delete('/lessons/:id', (req, res) => {
    const index = lessons.findIndex(l => l.id == req.params.id);
    if (index === -1) return res.status(404).send({ error: "Not found" });
    lessons.splice(index, 1);
    res.status(204).send();
});

// --- User Routes ---

// Registrer bruker
app.post('/users/register', (req, res) => {
    const newUser = {
        id: users.length + 1,
        progress: [],
        ...req.body
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Logg inn bruker (for testing, uten passord)
app.post('/users/login', (req, res) => {
    const user = users.find(u => u.email === req.body.email);
    if (!user) return res.status(404).send({ error: "User not found" });
    res.json(user);
});

// Hent brukerprogresjon
app.get('/users/:id/progress', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) return res.status(404).send({ error: "User not found" });
    res.json(user.progress);
});

// Oppdater progresjon
app.put('/users/:id/progress', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) return res.status(404).send({ error: "User not found" });
    user.progress = req.body.progress;
    res.json(user.progress);
});

// --- Start server ---
app.listen(port, () => {
    console.log(`TOPIK API running at http://localhost:${port}`);
});
