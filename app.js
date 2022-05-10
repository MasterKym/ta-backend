

const express = require("express");
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const users = [
  {username: "ismail", password: "ismail123"},
  {username: "yassir", password: "yassir123"},
  {username: "abdellatif", password: "abdo123"},
  {username: "saad", password: "saad123"},
];

app.get('/', async function(req, res){
  res.send("<b>Hello, there !</b>")
});

app.post('/login', async function(req, res){

  // console.log(req.body);
  // read username and password from request
  const usrn = req.body.username;
  const password = req.body.password;

  // check if username is inside database
  const user = users.find(user => user.username == usrn);
  if(!user){
    res.send("This user does not exist");
    return;
  }
  if(password != user.password){
    res.send("Wrong password !");
    return;
  }
  res.send(`You have been signed in, ${usrn}`);
    // --> username is inside
      // check if password matches
        // if yes
          // successful login
        // if not
          // UNsuccessful login

    // --> username is NOT inside
      // UNsuccessful login
});

const port = 1337;
app.listen(port, function(err){
  if(err){
    throw Error("Something went wrong..");
    return;
  }
  console.log(`started listening on port ${port}`);
});