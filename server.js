const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

//Parse incoming array data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//Data from db.json
const { notes } = require('./db/db.json')

function newNote(body, notesArray) {
    const note = body;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }), null, 2
    );
    return note;
};

//check note data
function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
};

//GET route
app.get('/api/notes', (req, res) => {
    res.json(notes);
})

//server route. Accepts data to be stored on server.
app.post('/api/notes', (req, res) => {
    req.body.iq = notes.length.toString();

    if (!validateNote(req.body)) {
        res.status(400).send('Note is note formatted correctly.');
    } else {
        const note = createNewNote(req.body, notes);
        res.json(note);
    }
});

//DELETE note
app.delete('api/notes/:id', (req, res) => {
    const id = req.params.id;
    let note;

    notes.map((element, index) => {
        if (element.id == id) {
            note = element
            notes.splice(index, 1)
            return res.json(note);
        }

    });
});

//INDEX route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//NOTES.HTML route
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});