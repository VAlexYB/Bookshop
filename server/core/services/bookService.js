const { getDB } = require('../dbConnection')

class BookService{
    
    constructor() {
        this.db = getDB();
    }

    async getBooks(page = 1, pageSize = 20) {
        let t = this;
        const collection = t.db.collection('Books');

        const skip = (page - 1) * pageSize;
        return await collection.find({})
        .skip(skip)
        .limit(pageSize)
        .toArray();
    }
    

    async getById(id){
        const book = Book.find({ Id: id }, (err, books) => {
            if (err) return console.error(err);
            console.log(books);
        });
    }
}

module.exports = BookService;