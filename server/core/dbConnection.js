const mongoose = require('mongoose');
const dbName = 'Bookshop';
const url = `mongodb://localhost:27017/${dbName}`;

async function connectToServer() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error("Ошибка подключения к MongoDB:", error);
    }
}

function getDB() {
    return mongoose.connection;
}

module.exports = { connectToServer, getDB };
