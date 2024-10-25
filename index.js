require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoute = require('./routes/product.route.js');
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.get('/', (req, res) => {
    res.send('hello world');
});

app.use('/api/products', productRoute)





mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connect to database');
        app.listen(process.env.PORT, () => {
            console.log('server is running on http://localhost:3000');
        })
    })
    .catch(() => {
        console.log('connect failed');
    });