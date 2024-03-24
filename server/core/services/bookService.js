const { getDB } = require('../dbConnection')

class BookService{
    
    constructor() {
        this.db = getDB();
    }

    async getBooks() {
        var t = this;
        const collection = t.db.collection('Books');
        return await collection.find({}).toArray();
    }

    async addBooks() {
        try {
            var t = this;
            let newBook = new Book({
                title: 'Война и мир',
                author: 'Лев Толстой',
                year: 1869,
                genres: ['роман', 'эпопея'],
                isAvailable: true
            });

            t.db.collection('Books').insertOne(newBook);
        } catch(err) {
            console.log(err.message + " вызвал метод addBooks BookService")
        }
    }
    

    async findById(){
        Book.find({ author: 'Лев Толстой' }, (err, books) => {
            if (err) return console.error(err);
            console.log(books);
        });
    }
}

module.exports = BookService;