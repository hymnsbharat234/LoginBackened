const express = require('express');
const port = 3000;
const app = express();
const db = require('./config/mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);;
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');
const customMiddleware = require('./config/noty');
const passportLocal = require('./config/passport-local-strategy');
const cors = require('cors')


app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(customMiddleware.setFlash);

app.use(passport.setAuthenticatedUser);
app.use(flash());

app.use(session({
    name: 'chandrakant',
    // To be changed at deployment
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (20000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'

    }, function(err) {
        if (err) {
            console.log('Error in MongoStore');
        }
    })

}));

app.listen(port, function(err) {
    if (err) {
        console.log('Error', err);
        return;
    }

    console.log('Server is running on port ', port);
})