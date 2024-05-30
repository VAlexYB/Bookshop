const express = require('express');
const cors = require('cors');
const path = require('path');

const { 
    authRouter, 
    bookRouter,
    userInfoRouter,
    fileRouter, 
    orderRouter, 
    storageRouter, 
    genreRouter, 
    authorRouter,
    cartRouter 
}  = require('./routes');

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


//роутеры
const routePrefix = '/api';
app.use(routePrefix, authRouter);
app.use(routePrefix, bookRouter); 
app.use(routePrefix, userInfoRouter);
app.use(routePrefix, fileRouter);
app.use(routePrefix, orderRouter);
app.use(routePrefix, storageRouter);
app.use(routePrefix, genreRouter);
app.use(routePrefix, authorRouter);
app.use(routePrefix, cartRouter);
 


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/main/test.html');
});

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