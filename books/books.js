const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Book = require('./book.js');

const PORT = process.env.PORT || 3000;
const app = express();
mongoose.connect('mongodb://piotr:password1@ds231517.mlab.com:31517/booksservice', () => {
    console.log('Connected to database!');
});

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('This is the books endpoint');
});

app.get('/books', (req, res) => {
    Book.find().then((books) => {
        res.json(books);
    }).catch((err) => {
        if(err) throw err;
    });
});

app.get('/book/:id', (req, res) => {
    Book.findById(req.params.id).then((book) => {
        if(book) res.json(book);
        else res.sendStatus(404);
    }).catch((err) => {
        if(err) throw err;
    })
});

app.post('/book', (req, res, next) => {
    Book.create(req.body).then((ninja) => {
        res.send(ninja);
    }).catch((err) => {
        if(err) throw err;
    });
});

app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});