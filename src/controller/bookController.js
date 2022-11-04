const booksModel = require('../model/bookModel')
const validator = require('../validator/validator')


// ----------------- ADD Books

const addBooks = async function (req, res) {
    try {
        let data = req.body
        const { userId, title, bookPrice, authorName } = data

        if (!validator.isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide book details' })
        }
        //============ UserId ==============        
        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required" })
        };
        if (!validator.isValid(userId)) {
            return res.status(400).send({ status: false, message: "userId is in wrong format" })
        };
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, message: "Incorrect userId format" })
        }
        if (userId != req.token.userId) {
            return res.status(403).send({ status: false, message: "Unauthorized access ! User's credentials do not match." })
        }
        //============ Title ==============
        if (!title) {
            return res.status(400).send({ status: false, message: "Title is required" })
        };
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: "Title is in wrong format" })
        };
        let checkBook = await booksModel.findOne({ title: title })
        if (checkBook) {
            return res.status(400).send({ status: false, message: "Title already used" })
        }
        //============ Book Price ==============
        if (!bookPrice) {
            return res.status(400).send({ status: false, message: "bookPrice is required" })
        };
        if (!validator.isValid(bookPrice)) {
            return res.status(400).send({ status: false, message: "bookPrice is in wrong format" })
        };
        //============ Author Name ==============
        if (!authorName) {
            return res.status(400).send({ status: false, message: "authorName is required" })
        };
        if (!validator.isValid(authorName)) {
            return res.status(400).send({ status: false, message: "authorName is in wrong format" })
        };
        if (!authorName.match(/^[ a-z ]+$/i)) {
            return res.status(400).send({ status: false, message: "Please Provide correct input for authorName" })
        };

        const newBook = await booksModel.create(data);
        
        // let bookId = newBook._id                                 //didnt worked -- for inc count of book
        // let count = newBook.totalBooks
        // newBook.totalBooks = count + 1
        // await newBook.save()
        //let totalBooks = await booksModel.findOneAndUpdate({ _id: bookId }, { $inc: { totalBooks: 1 } }, { new: true })
        return res.status(201).send({
            status: true,
            message: "Book added successfully",
            data: {
                userId: newBook.userId,
                title: newBook.title,
                bookPrice: newBook.bookPrice,
                authorName: newBook.authorName,
                issued: newBook.issued,
                isDeleted: newBook.isDeleted,
                booksId: newBook._id
            }
        })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

// ----------------- GET books 

const getBooks = async function (req, res) {
    try {

        const data = req.query

        if (data.userId && !data.userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, message: "Incorrect userId" })
        }

        if (Object.keys(data).length == 0) {
            const books = await booksModel.find({ isDeleted: false }).select({ _id: 0, title: 1 })
            if (books.length == 0) {
                return res.status(400).send({ status: false, message: "No Books Found" })
            }
            return res.status(200).send({ status: true, message: "List of Books", data: books })
        }

        if (Object.keys(data).length != 0) {
            const books = await booksModel.find({ ...data, isDeleted: false }).select({ _id: 0, bookPrice: 1, authorName: 1, issued: 1 })
            if (books.length == 0) {
                return res.status(400).send({ status: false, message: "No Books Found" })
            }
            return res.status(200).send({ status: true, message: "Books List", data: books })
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

// ----------------- Update books/:bookId

const modifyBook = async function (req, res) {
    try {

        let bookId = req.params.bookId

        if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, message: "Incorrect Book Id format" })
        }

        let book = await booksModel.findById(bookId)
        if (!book || book.isDeleted == true) {
            return res.status(404).send({ status: false, message: "No Book Found" })
        }
        if (req.token.userId != book.userId) {
            return res.status(403).send({ status: false, message: "Not Authorised" })
        }

        if (!validator.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: "Body is empty, please Provide data" })
        }

        let { title, bookPrice, authorName, issued } = req.body

        //============ Title =================

        if (title) {
            if (!validator.isValid(title)) {
                return res.status(400).send({ status: false, message: "Title is in incorrect format" })
            };
            let checkBook = await booksModel.findOne({ title })
            if (checkBook) {
                return res.status(400).send({ status: false, message: "Title already used" })
            }
        }
        //============ Book Price ============  

        if (bookPrice && !validator.isValid(bookPrice)) {
            return res.status(400).send({ status: false, message: "book Price is in incorrect format" })
        }
        //============ Author Name ==========
        if (authorName) {
            if (!validator.isValid(authorName)) {
                return res.status(400).send({ status: false, message: "authorName is in incorrect format" })
            }
            if (!authorName.match(/^[ a-z ]+$/i)) {
                return res.status(400).send({ status: false, message: "Please Provide correct input for authorName" })
            };
        }

        //=========== Issued == =============
        if (issued && validator.isValid(issued)) {
            return res.status(400).send({ status: false, message: "issued is in incorrect format" })
        }


        //============ Updating and returning data ==============  
        let updatedBook = await booksModel.findOneAndUpdate({ _id: bookId }, { title, bookPrice, authorName, issued }, { new: true })
        return res.status(200).send({ status: true, message: "Book Updated Successfully", data: updatedBook })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

// ----------------- Delete books/:bookId

const deleteBook = async function (req, res) {
    try {
        const bookId = req.params.bookId
        if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({ status: false, message: "Incorrect Book Id format" })
        }

        let book = await booksModel.findById(bookId)
        if (!book || book.isDeleted == true) {
            return res.status(404).send({ status: false, message: "No such book exist" })
        };
        if (req.token.userId != book.userId) {
            return res.status(403).send({ status: false, message: "Not Authorised" })
        }

        await booksModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: new Date() })
        return res.status(200).send({ status: true, message: "Book deleted successfully" })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { addBooks, getBooks, modifyBook, deleteBook }
