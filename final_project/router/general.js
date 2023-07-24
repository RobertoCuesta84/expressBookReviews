const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ********* Task 6: Registering a new user

function doesExist(username) {
  const user = users.find((user) => user.username === username);
  return !!user;
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username, password });
      return res
        .status(200)
        .json({ message: "The user was successfully registred." });
    } else {
      return res.status(404).json({ message: "The user already exists in database." });
    }
  }
  return res.status(404).json({ message: "New register user failed." });

});



// ********** Task 1: Get the book list available in the shop

public_users.get('/',function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 100);
  });
  promise.then((result) => {
    return res.status(200).json({ books: result });
  });
});



// ********** Task 2: Get book details based on ISBN

public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve(books[req.params.isbn]), 100);
  });

  const book = await promise;
  if (book) {
    return res.status(200).json({ book });
  } else {
    return res.status(404).json({ message: "The book selected was not found." });
  }
 });
  




// ********** Task 3:  Get book details based on author

public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorsName = req.params.author;
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (b) => b.author === authorsName );
      resolve(filteredBooks);
    }, 100);

  const filteredBooks = await promise;

  if (filteredBooks.length > 0) {
    return res.status(200).json({ books: filteredBooks });
  } else {
    return res.status(404).json({ message: "This author's books were not found." });
  }
    
});


// ********** Task 4:   Get all books based on title

public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (b) => b.title === title
      );
      return resolve(filteredBooks);
    }, 100);
  });

  const filteredBooks = await promise;

  if (filteredBooks.length > 0) {
    return res.status(200).json({ books: filteredBooks });
  } else {
    return res.status(404).json({ message: "Books under this title were not found" });
  }
});



// ********** Task 5:     Get book reviews
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).json({ reviews: books[isbn].reviews });
});

module.exports.general = public_users;
