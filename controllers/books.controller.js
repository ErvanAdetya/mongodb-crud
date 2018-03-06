'use strict'

const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/';

module.exports = {
    create: (req, res) => {
        const newBooks = {
            isbn: req.body.isbn,
            title: req.body.title,
            author: req.body.author,
            category: req.body.category,
            stock: req.body.stock
        }
        mongoClient.connect(url, (err, client) => {
            if(err) return res.status(500).send('error connecting to database');
            const db = client.db('library');
            db.collection('books')
              .insertOne(newBooks)
              .then((response) => {
                  return res.status(201).json({
                      response,
                      message: "new book successfully created!"
                  })
              })
              .catch((err) => {
                  return res.status(500).json({
                      err,
                      message: "error in instering data"
                  })
              })
        })
    },
    readAll: (req, res ) => {
        mongoClient.connect(url, (err, client) => {
            if(err) return res.status(500).send('error connecting to database');
            const db = client.db('library');
            db.collection('books')
              .find({})
              .toArray()
              .then((response) => {
                  return res.status(200).send(response);
              })
        })
    },

    updateOne: (req, res) => {
        mongoClient.connect(url, (err, client) => {
            if(err) return res.status(500).send('error connecting to database');
            const db = client.db('library');
            
            const where = {isbn: req.params.isbn};
            db.collection('books')
            .find({isbn: req.params.isbn})
            .toArray()
            .then((response) => {
                response = response[0];
                if(response) {
                    const newValue = {
                        $set: {
                            // isbn: req.body.isbn,
                            title: req.body.title || response.title,
                            author: req.body.title || response.author,
                            category: req.body.category || response.author,
                            stock: req.body.stock || response.stock
                        }
                    }
                    db.collection('books')
                    .updateOne(where, newValue)
                    .then(() => {
                        return res.status(200).json({
                            message: "Books updated!"
                        })
                    })
                } else {
                    return res.status(404).json({
                        message: "Books not found"
                    })
                }
            })
        })
    },

    deleteOne: (req, res) => {
        mongoClient.connect(url, (err, client) => {
            if(err) return res.status(500).send(`error connecting to database`);
            const db = client.db('library');
            const where = {isbn : req.params.isbn};
            db.collection('books')
              .deleteOne(where)
              .then((response) => {
                  if(response.n) {
                      res.status(404).send('Book not found')
                  } else {
                      res.status(200).send('Book deleted')
                  }
              })
        })
    }
}