const express = require('express');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const handleBar = require('express-handlebars');
const mongojs = require('mongojs');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const localStragegy = require('passport-local').Strategy;
var path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/rental',{ useNewUrlParser: true });
var db = mongoose.connection;

var app = express();

//set view engine
// app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('views/images'));

//set view engine handlebar
app.set('view engine', 'handlebars');
app.engine('handlebars', handleBar({
    defaultLayout: 'index'
}));


// body parser pass object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

// express validator middleware
app.use(validator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//set static path
app.use(express.static(path.join(__dirname, 'public')));

// connect flash

app.use(flash());

// global variable
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

var index = require('./routs/index');
var users = require('./routs/users');
var roomDetail = require('./routs/roomDetail');
var admin = require('./routs/admin');

app.use('/',index);
app.use('/',users);
app.use('/',roomDetail);
app.use('/admin/',admin);

// global variable
app.use((req, res, next) => {
    res.locals.errors = null;
    next();
});



// // express validator middleware
// app.post('/users/add', (req, res) => {

//     req.checkBody('firstName', 'FirstName is required!').notEmpty();
//     req.checkBody('lastName', 'FirstName is required!').notEmpty();
//     req.checkBody('email', 'Email  is required!').notEmpty();

//     var errors = req.validationErrors();
//     if (errors) {
//         db.users.find((err, data) => {
//             res.render('index', { //view
//                 layout: 'index', //layout
//                 tittle: 'Users',
//                 errors: errors,
//                 users: data //users is object 
//             });
//         });
//     }
//     else {
//         var newUser = {
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             email: req.body.email
//         }

//         db.users.insert(newUser);

//         res.redirect('/');
//     }
// });

// app.delete('/users/delete:id', (req, res) => {
//     db.users.remove({ _id: ObjectId(req.params.id) }, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             console.log(req.params.id + ' is deleted');
//             res.redirect('/index');
//         }
//     });
// });

var port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app listened from port ${port}`));