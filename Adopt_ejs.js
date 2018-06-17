const express = require('express')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const bodyParser = require('body-parser')
const app = express()
const crypto = require('crypto')
const mysql = require('async-mysql')
let connection
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

function createPW(pw) {
  return crypto.createHash('sha512').update(pw).digest('hex')
}

app.post('/adopt_login', async function(req, res){
  const { username:uname, password:pwd } = req.body;
  const query = `SELECT displayName FROM adoptdb where username='${uname}' and password='${createPW(pwd)}';`
  console.log(query)
  const result = await connection.query(query)

  if(result.length === 1){
    req.session.displayName = result[0].displayName;
    return res.redirect('/welcome');
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

app.post('/adopt_register', async function(req, res){
  // 변수 선언
  const {username: name, password: pw, displayName} = req.body

  // 중복 체크
  const checkQuery = `SELECT displayName FROM adoptdb where displayName='${displayName}';`
  console.log('checkQuery : ', checkQuery)
  const result1 = await connection.query(checkQuery)
  console.log('result1 : ', result1)
  if (result1.length != 0){
    console.log('Wrong')
  } else {
    // 실제 가입처리
    const query = `INSERT INTO adoptdb(username, password, displayName) VALUES('${name}', '${createPW(pw)}', '${displayName}');`
    const result = await connection.query(query)
    req.session.displayName = req.body.displayName;
    req.session.save(function(){
      res.redirect('/welcome')
    })
  }
})

app.listen(3003, async function(){
  connection = await mysql.connect({
    host:'localhost',
    user: 'root',
    password: 'root'
  })
  await connection.query('use adopt')
  console.log('Connected 3003!');
});
