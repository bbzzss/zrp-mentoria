const express = require('express')
const {connect} = require('./src/database')
const User = require('./src/schemas/user')
const app = express()
const port = 3000
// connect('mongodb://mongo:27017/mentoria').then(() =>{
  app.get('/', function (req, res) {
    res.send('Hello World!')
  })
  app.post('register', function (req, res) {
    // res.send('Register')
    console.log('OLA MUNDO')
    // User.create({
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: req.body.password
    // }).then((user)=>{
    //   console.log(user.toJSON())
    //   res.status(201).json(user.toJSON())
    // }).catch((error)=>{
    //   console.error(error.message)
    //   res.status(500).send()
    // })
  }) 
  app.listen(port, function() {
    console.log('Aplicação escutando na porta 3000')
  })
// }).catch((error)=>{
//   console.error(error.message)
// })
