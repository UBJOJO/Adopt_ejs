var express = require('express')
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session)
var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'djqiowjd2212@@!sd32dk9023kjd09j',
  resave: false,
  saveUninitialized: true,
  store:new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'adopt'
  })
}));

app.set('view engine', 'ejs')
app.set('views', './views')

app.get('/adopt_login', function(req, res){
  res.render('view')
})

app.post('/adopt_login', function(req, res){
  var user = {
    username:'UBJOJO8',
    password:'1111',
    displayName:'Meek'
  }
  var uname = req.body.username;
  var pwd = req.body.password;
  if(uname === user.username && pwd === user.password){
    req.session.displayName = user.displayName;
    res.redirect('/welcome');
  } else {
    res.send('Who are u <a href="/adopt_login">Login</a>');
  }
})

app.get('/welcome', function(req, res){
  if(req.session.displayName){
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      `)
  } else {
    res.send(`
      <h1>Welcome</h1>
    `);
  }
})


app.listen(3003, function(){
  console.log('Connected 3003!');
});
