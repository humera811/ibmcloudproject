const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const validRegex = /^[a-zA-Z0-9]+$/; // only allow alphanumeric characters
  return validRegex.test(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    console.log(`Trying to login user ${username}...`);
    //Write your code here
    if (authenticatedUser(username,password)){
        const token = jwt.sign({username: username}, 'secretkey');
        console.log(`User ${username} logged in successfully. Token generated: ${token}`);
        return res.status(200).json({token: token});
    } else {
        console.log(`Login failed for user ${username}`);
        return res.status(401).json({message: "Invalid credentials"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { username } = jwt.verify(req.headers.authorization, 'secretkey');
    const { review } = req.query;
  
    // Check if the book exists in the database
    const index = books.findIndex(book => book.isbn === req.params.isbn);
    if (index === -1) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the current user has already reviewed the book
    const userReviewIndex = books[index].reviews.findIndex(review => review.username === username);
    if (userReviewIndex === -1) {
      // If the user has not reviewed the book yet, add a new review
      books[index].reviews.push({ username, review });
    } else {
      // If the user has already reviewed the book, update the existing review
      books[index].reviews[userReviewIndex].review = review;
    }
  
    return res.status(200).json({ message: "Review added/modified successfully" });
  });
  
  // Delete a book review
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { username } = jwt.verify(req.headers.authorization, 'secretkey');
  
    // Check if the book exists in the database
    const index = books.findIndex(book => book.isbn === req.params.isbn);
    if (index === -1) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Filter the reviews based on the session username
    books[index].reviews = books[index].reviews.filter(review => review.username !== username);
  
    return res.status(200).json({ message: "Review deleted successfully" });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
