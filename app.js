const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const stories = require('./routes/stories')
const reviews = require('./routes/reviews')
const session = require('express-session')
const flash = require('connect-flash')

mongoose.connect('mongodb://localhost:27017/write-pad')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database connected!")
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

app.engine('ejs', ejsMate)


app.use('/stories', stories)
app.use('/stories/:id/reviews', reviews)

app.get('/', (req,res) =>{
    res.render('home')
})





app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})