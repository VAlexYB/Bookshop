const Storage = require('../models/Storage');
const UserError = require('../customError');

class StorageService {
    async addSupply(data) {
        try {
            const existBookStorage = await Storage.findOne({ book: data.bookId });
            if(existBookStorage) {
                existBookStorage.amount += parseInt(data.amount);
                await existBookStorage.save();
            }
            else {
                const bookStorage = new Storage({
                    book: data.bookId,
                    amount: parseInt(data.amount)
                });
                await bookStorage.save();
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    async getFilteredStorages(filter) {
        try {
            let aggregationPipeline = [
                {
                    $lookup: {
                        from: 'books',
                        localField: 'book',
                        foreignField: '_id',
                        as: 'bookDetails'
                    }
                },
                {
                    $addFields: {
                        amount: '$amount',
                        price: '$price',
                        bookId: { $arrayElemAt: ['$bookDetails._id', 0] },
                        title: { $arrayElemAt: ['$bookDetails.Title', 0] },
                        author: { $arrayElemAt: ['$bookDetails.Author', 0] },
                        year: { $arrayElemAt: ['$bookDetails.Year', 0] },
                        extension: { $arrayElemAt: ['$bookDetails.Extension', 0] }
                    }
                },
                {
                    $match: {
                        amount: { $gt: 0 }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        amount: 1,
                        price: 1,
                        bookId: 1,
                        title: 1,
                        author: 1,
                        year: 1,
                        extension: 1
                    }
                }
            ];
        
            if (filter.term) {
                aggregationPipeline.splice(1, 0, {
                    $match: {
                        'bookDetails.Title': { $regex: filter.term, $options: 'i' }
                    }
                });
            }
            let storages = await Storage.aggregate(aggregationPipeline);
            if (filter.page && filter.pageSize) {
                const skip = (filter.page - 1) * filter.pageSize;
                storages = storages.skip(skip).limit(filter.pageSize);
            } 
            return storages;
        } catch (error) {
            throw error;
        }
    }

    async setPrice(data) {
        const storage = await Storage.findById(data.storageId);
        if(storage) {
            storage.price = data.price;
            await storage.save();
            return true;
        }
        else {
            console.log("Неизвестный id в StorageService.setPrice")
        }
    }

    async takeBookForOrder(bookId) {
        try {
            const existBookStorage = await Storage.findOne({ book: bookId });
            if(existBookStorage && existBookStorage.amount > 0) {
                --existBookStorage.amount;
                await existBookStorage.save();
                return existBookStorage.price;
            }
            else {
                throw new UserError('В данный момент у нас нет на складе такой книги. Приносим свои извинения');
            }
        } catch (error) {
            throw error;
        }
    }

    async returnBook(bookId) {
        try {
            const existBookStorage = await Storage.findOne({ book: bookId });
            if(existBookStorage) {
                ++existBookStorage.amount;
                await existBookStorage.save();
            }
            else {
                throw new Error('Попытка возврата по id книги, которой нет в Storage (storageService.returnBook)');
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StorageService();