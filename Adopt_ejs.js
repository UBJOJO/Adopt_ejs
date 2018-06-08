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

app.get('/adopt_logout', function(req, res){
  delete req.session.displayName;
  res.redirect('/welcome')
})

var users =[
  {
    username:'egoing',
    password:'111',
    displayName:'Egoing'
  }
];

app.post('/adopt_login', function(req, res){
  var uname = req.body.username;
  var pwd = req.body.password;
  for(var i=0; i<users.length; i++){
    var user = users[i];
    if(uname === user.username && pwd === user.password){
      req.session.displayName = user.displayName;
      return res.redirect('/welcome');
    }
  }
    res.send('Who are u <a href="/Adopt_login">Login</a>');
});

app.get('/welcome', function(req, res){
  if(req.session.displayName){
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <a href="/adopt_logout">logout</a>
      `)
  } else {
    res.send(`
      <h1>Welcome</h1>
      <a href="/adopt_login">Login</a><br>
      <a href="/adopt_register">Register</a>
    `);
  }
})

app.get('/adopt_register', function(req, res){
  var output=`
  <h1>Register</h1>
  <form action="/adopt_register" method="post">
    <p>
      <input type="text" name="username" placeholder="username"
    </p>
    <p>
      <input type="password" name="password" placeholder="password"
    </p>
    <p>
      <input type="text" name="displayName" placeholder="displatName"
    </p>
    <p>
      <input type = "submit">
    </p>
  </form>
  `
  res.send(output)
})

app.post('/adopt_register', function(req, res){
  users.push({
    username:req.body.username,
    password:req.body.password,
    displayName:req.body.displayName
  })
  req.session.displayName = req.body.displayName;
  req.session.save(function(){
    res.redirect('/welcome')
  })
})

app.listen(3003, function(){
  console.log('Connected 3003!');
});
