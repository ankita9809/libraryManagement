TASK BRIEF

Rahul ( a librarian) is the owner of Noble library. He's having around 5000 books in library at present. He ordered 250 new books for his library. At present, Rahul is using a system to manage books in library. After receiving the order of 250 books, Rahul follows the below process to enter the details of new book into the system

He opens the system, a LOGIN page is displayed to him. He is asked to enter his USERNAME & PASSWORD in order to LOGIN. 

After login, a dashboard is displayed to Rahul showing TOTAL no. of books in library, also in dashboard he has option to ADD new books details, MODIFY existing details of old books, DELETE the books which are torn and are of no use now. 

Following additional things are also displayed to him, a LIST of all books. While scrolling through the list section, he came across a book title " You can Win". He CLICKS on the title, and following additional details are displayed to him - Book Price, Author Name, How many times it is issued. You're required to prepare a demo structure of above system, which Rahul is currently using.

APIs to be created:

#User APIs
1. POST /register
2. POST /login

#Books APIs
1. POST /books
2. GET /books
3. PUT /books/:bookId
4. DELETE /books/:bookId

Respected APIs needs to be protected using authentication and authorisation.