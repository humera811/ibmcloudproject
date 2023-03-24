const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('https://humera811-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books');
    const books = response.data;
    res.send(JSON.stringify(books, null, 4));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching books data');
  }
});


public_users.get('/isbn/:isbn', async function(req, res) {
    const isbn = req.params.isbn;
    try {
      const response = await axios.get(`https://humera811-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn=${isbn}`);
      const book = response.data;
      res.send(book);
    } catch (error) {
      console.error(error);
      res.status(404).send('Book not found');
    }
  });


  public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
      const response = await axios.get(`https://humera811-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books?author=${author}`);
      const matchingBooks = response.data;
      if (matchingBooks.length === 0) {
        return res.status(404).send('No books found for author');
      }
      res.send(matchingBooks);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching books data');
    }
  });

  public_users.get('/title/:title', async function(req, res) {
    const title = req.params.title;
    try {
      const response = await axios.get(`https://humera811-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books?title=${title}`);
      const matchingBooks = response.data;
      if (matchingBooks.length === 0) {
        return res.status(404).send('No books found for title');
      }
      res.send(matchingBooks);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching books data');
    }
});


public_users.post('/register', function(req, res) {
    const { username, password } = req.body;

    // Check if the username and password are provided
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    // Check if the username already exists
    if (users.find(user => user.username === username)) {
      return res.status(400).send('Username already exists');
    }

    // Check if the username is valid
    if (!isValid(username)) {
      return res.status(400).send('Invalid username');
    }

    // Register the new user
    users.push({ username, password });
    res.send('User registered successfully');
});
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function(req, res) {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(book => book.isbn === isbn);
    if (!book) {
        return res.status(404).send('Book not found');
    }
    console.log(books); // add this line to log the books object
    res.send(book);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];
    for (const id in books) {
      if (books[id].author === author) {
        matchingBooks.push(books[id]);
      }
    }
    if (matchingBooks.length === 0) {
      return res.status(404).send('No books found for author');
    }
    res.send(matchingBooks);
  });

// Get all books based on title
public_users.get('/title/:title', function(req, res) {
    const title = req.params.title;
    const matchingBooks = [];
    for (const id in books) {
      if (books[id].title === title) {
        matchingBooks.push(books[id]);
      }
    }
    if (matchingBooks.length === 0) {
      return res.status(404).send('No books found for title');
    }
    res.send(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn', function(req, res) {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(book => book.isbn === isbn);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    const reviews = book.reviews;
    res.send(reviews);
  });

module.exports.general = public_users;