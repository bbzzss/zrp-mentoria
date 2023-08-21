const express = require('express')
const jwt = require('jsonwebtoken')
const { connect } = require('./src/database')
const User = require('./src/schemas/user')
const Pokemon = require('./src/schemas/pokemon')
const app = express()
const port = 3000
const JWT_SECRET = 'zrp-mentoria-1234'
connect('mongodb://mongo:27017/mentoria').then(() => {

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // app.use((req, res, next) => {
  //   console.log(req.headers, req.body)
  //   next()
  // })

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
      email
    }).then((user) => {
      if (password === user.password) {
        const token = jwt.sign({ id: user._id }, JWT_SECRET)
        return res.status(200).json({ token })
      }

      return Promise.reject()
    }).catch((error) => {
      console.log(error.message)
      res.status(401).send()
    })

  })

  app.post('/user/add-pokemon', function (req, res) {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const { pokeApiId } = req.body

    let signedUser;

    if (!pokeApiId) {
      return res.status(400).send()
    }

    User.findById(decoded.id).then((user) => {
      if (!user) {
        return res.status(401).send()
      }

      signedUser = user
      return Pokemon.findOne({
        pokeApiId,
      })
      //VINCULAR O POKEMON AO USUARIO
    }).then((pokemon) => {
      //VERIFICAR SE POKEMON ESTA NO BANCO DE DADOS
      if (!pokemon) {
        //SE NAO TIVER NO BANCO CONSULTAR A POKEAPI
      }

      user.pokemons.push(pokemon._id)
      return user.save()
    })

    res.status(200).send()
  })

  app.listen(port, function () {
    console.log('Aplicação escutando na porta 3000')
  })
}).catch((error) => {
  console.error(error.message)
})
