// server.js
const express = require('express');
var { expressjwt: jwt } = require("express-jwt");
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors());
const jwtSecret = 'secret123';

app.get('/jwt', (req, res) => {
  const token = jsonwebtoken.sign({ user: 'johndoe' }, jwtSecret);
  res.cookie('token', token, { httpOnly: true });
  res.json({ token });
});

app.use(jwt({ 
  secret: jwtSecret, 
  algorithms: ['HS256'],
  getToken: req => req.cookies.token 
}));

const foods = [
  { id: 1, description: 'burritos' },
  { id: 2, description: 'quesadillas' },
  { id: 3, description: 'churos' }
];
app.get('/foods', (req, res) => {
  res.json(foods);
});
app.listen(3001);
console.log('App running on localhost:3001');