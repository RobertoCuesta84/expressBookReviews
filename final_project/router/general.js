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
  //res.send(JSON.stringify({books},null,4));

  const bookList = new Promise((resolve,reject)=>{

    if(books){
      resolve(books)
    }
    else
    {
      reject({error: 'Book list was not found'})
    }
  })

  bookList.then((resp)=>{
    return res.status(200).json(resp);
  }).catch(err=>res.status(403).json({error: err}))
  
});


// ********** Task 2: Get book details based on ISBN

public_users.get('/isbn/:isbn',function (req, res) {

  //Write your code here

  let isbnNumber = req.params.isbn
  const bookIsbn = new Promise((resolve, reject)=>{
    let book = books[isbnNumber]
    if(book)
    {
      resolve(book)
    }
    else{
      reject({error: `No book was found for ISBN number: ${isbnNumber}`})
    }
  })

  bookIsbn.then((resp)=>{
    res.status(200).json(resp)
  }).catch(err=>res.status(403).json({error: err}))
  
});
  




// ********** Task 3:  Get book details based on author

public_users.get('/author/:author',function (req, res) {
  
  //Write your code here
  let author = req.params.author;
  let bookArray = Object.entries(books)
  const bookAuthor = new Promise((resolve, reject)=>{

    let matchAuthor = bookArray.filter((item)=>item[1].author === author)
    if(matchAuthor)
    {
      resolve(matchAuthor)
    }
    else{
      reject({message: `No book was found for: ${author}`})
    }
  })

  bookAuthor.then((resp)=>{
    res.status(200).json(resp)
  }).catch(err=>res.status(403).json({error: err}))
  
});


// ********** Task 4:   Get all books based on title

public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let bookArray = Object.entries(books)

  const bookTitle = new Promise((resolve,reject)=>{
    let filterTitle = bookArray.filter((item)=>item[1].title === title)
    if(filterTitle)
    {
      resolve(filterTitle[0][1])
    }
    else{
      reject({message: `No book was found for the title: ${title}` })
    }
  })
  bookTitle.then((resp)=>{
    res.status(200).json(resp)
  }).catch(err=>res.status(403).json({error: err}))
  
});



// ********** Task 5:     Get book reviews
public_users.get('/review/:isbn',function (req, res) {
  let ISBN = req.params.isbn
  let book = books[ISBN]
  if(book)
  {
    res.status(200).json(book.reviews)
  }
  else{
    res.status(404).json({message: `No book was found for ISBN number: ${ISBN}`})
  }
});

module.exports.general = public_users;
