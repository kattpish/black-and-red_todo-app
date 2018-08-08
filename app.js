const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cookie = require('cookie-parser')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/todo_list')

const app = express()
const User = require('./models/User')

app.set('view engine', 'pug')
app.set('views', './views')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookie())
app.use(express.static('public'))
app.use(morgan('dev'))

app.get('/', (req, res) => {
    console.log('request for home')
    res.clearCookie("username")
    res.render('index')
})

app.post('/login', (req, res) => {
    User.findOne({username: req.body.todo_id}).then ( user => {
        if(!user) return res.render('error', {error: '회원가입 해라 병진아 ㅅㅂ'})
        if(user.password === req.body.todo_pw) {res.cookie("username", req.body.todo_id); return res.redirect('/list')}
    })

})

app.get('/list', (req, res) => {
    User.findOne({username: req.cookies.username}, (err, todos) => { 
        if(err)
            res.render('error', {error: "LOGIN 해라 병진아ㅗㅗ"})
        else
            res.render('view', {todos: todos.todos, username: req.cookies.username})
    })
})

app.get('/add_todo', (req, res) => {
    console.log('request for add_todo')
    res.render('add_todo')
})

app.post('/add', (req, res) => {
    User.update({username: req.cookies.username}, { $addToSet: {todos: req.body.todo_text}})
        .then(() => {
            res.redirect('/list')
        })
        .catch(console.error)
})

app.listen(3000, () => {
    console.log('The server is set up, and listening on port 3000.')
})

app.post('/regi_done', (req, res) => {
    if (req.body.username &&
        req.body.password &&
        req.body.passwordconf &&
        req.body.password == req.body.passwordconf) {
        const userData = {
          username: req.body.username,
          password: req.body.password,
          passwordConf: req.body.passwordconf,
          todos: [""]
        }
        User.create(userData, function (err, user) {
          if (err) {
            return next(err)
          } else {
            console.log('who registered ' + req.body.username)
            return res.redirect('/')
          }
        })
      } 
})

app.post('/register', (req, res) => {
    console.log('request for register')
    res.render('register')
})