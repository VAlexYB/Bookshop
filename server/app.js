const express = require('express');
const cors = require('cors');
const router = require('./routes/routes.js');
const { connectToServer } = require('./core/dbConnection.js');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use('/api', router);   


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