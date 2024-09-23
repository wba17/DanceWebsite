const express = require("express");
const path = require("path");
const mongoose = require('mongoose');

const app = express();
const port = 8000;

// Connect to MongoDB without deprecated options
mongoose.connect('mongodb://localhost:27017/contactDance')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose Schema
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    desc: String
});

const Contact = mongoose.model('Contact', contactSchema);

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')); // For serving static files
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

// PUG SPECIFIC STUFF
app.set('view engine', 'pug'); // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// ENDPOINTS
app.get('/', (req, res) => {
    res.status(200).render('home.pug');
});

app.get('/contact', (req, res) => {
    res.status(200).render('contact.pug');
});

app.post('/contact', (req, res) => {
    const myData = new Contact(req.body);
    myData.save()
        .then(() => {
            res.send("This item has been saved to the database");
        })
        .catch(() => {
            res.status(400).send("Item was not saved to the database");
        });
});

// START THE SERVER
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});
