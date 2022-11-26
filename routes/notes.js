const notes = require("express").Router();
const {
    readFromFile,
    readAndAppend,
    readAndDelete,
} = require("../helpers/uuid");
const uuid = require("../helpers/uuid");

notes.get('/', (req, res) => {
    console.info(`${req.method} request received`);
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

notes.post("/", (req, res) => {
    console.info(`${req.method} request received`);
    const { title, text } = req.body;
    if (title && text ) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        readAndAppend(newNote, "./db/db.json");
        const response = {
            status: "success",
            body: newNote,
        };
        res.json(response);
    } else {
        res.json("Error! Could not post note.")
    }
});

//DELETE note
notes.delete('/:id', (req, res) => {
    const id = req.params.id;
    if(id) {
        readAndDelete(id, './db/db.json')
        res.json('Deleted!')
    } else {
        res.json('Error! Couuld not delete note.')
    }
    });

module.exports = notes;