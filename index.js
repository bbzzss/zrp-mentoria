const express = require('express')
const { connect } = require('./src/database')
const User = require('./src/schemas/user')
const app = express()
const port = 3000
connect('mongodb://mongo:27017/mentoria').then(() => {

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use((req, res, next) => {
    console.log(req.headers, req.body)
    next()
  })

  app.get('/', function (req, res) {
    res.send('Hello World!')
  })

  app.post('/register', function (req, res) {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }).then((user) => {
      res.status(201).json(user.toJSON())
    }).catch((error) => {
      console.error(error.message)
      res.status(500).send()
    })
  })

  app.post('/login', function (req, res) {
    const { email, password } = req.body

    User.findOne({
      email // : email
    }).then((user) => {
      if (password === user.password) {
        const token = "abcd1234-" + user._id
        res.status(200).json({ token })
      }

      return Promise.reject()
    }).catch(() => {
      res.status(501).send()
    })

    // LOGIN TODO
    // - Recebe email
    // - Consultar pra ver se usuario existe
    // - Encriptar a senha que é passada pelo cliente, e comparar com a do banco
    // - Valida se esta no banco
    // - 
  })

  app.listen(port, function () {
    console.log('Aplicação escutando na porta 3000')
  })
}).catch((error) => {
  console.error(error.message)
})
