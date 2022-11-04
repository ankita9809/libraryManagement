const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");
const booksController = require("../controller/bookController");
const mid = require("../middleware/auth")


// ---------------------------- User APIs ------------------------------------------
router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)

// ---------------------------- Books APIs -----------------------------------------

router.post("/books",mid.auth, booksController.addBooks)
router.get("/books",mid.auth,  booksController.getBooks)
router.put("/books/:bookId",mid.auth,  booksController.modifyBook)
router.delete("/books/:bookId", mid.auth, booksController.deleteBook)


// ------- To check whether correct API is passed or not

router.all("/**", function(req, res){
    res.status(404).send({ status: false, message: "The api you have requested is not available."})
})


module.exports = router