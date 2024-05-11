const express = require('express');
const cors = require('cors');
const path = require('path');

const router = require('./routes/routes.js');
const { connectToServer } = require('./core/dbConnection.js');
const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use('/api', router);   
app.use('/images/covers', express.static(path.join(__dirname, 'public', 'images', 'covers')));

const start = async () => {
    try {
        await connectToServer();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        })
    } catch(e) {
        console.log(e);
    }
}

start();