const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chandrakant');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error in creating database'));
db.once('open', function() {
    console.log('Database successfully created');
});


module.exports = db;