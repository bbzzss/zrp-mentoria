const express = require('express')
const jwt = require('jsonwebtoken')
const axios = require('axios')

const { connect } = require('./src/database')
const User = require('./src/schemas/user')
const Pokemon = require('./src/schemas/pokemon')
const app = express()
const port = 3000
const JWT_SECRET = 'zrp-mentoria-1234'
connect('mongodb://mongo:27017/mentoria').then(() => {
  const client = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/pokemon',
  })

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

  app.post('/user/add-pokemon', async function (req, res) {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const { pokeApiId } = req.body

    if (!pokeApiId) {
      return res.status(400).send()
    }

    const signedUser = await User.findById(decoded.id)

    if (!signedUser) {
      return res.status(401).send()
    }

    let pokemon = await Pokemon.findOne({
      pokeApiId
    })

    if (!pokemon) {
      const { data } = await client.get(`/${pokeApiId}`)

      pokemon = await Pokemon.create({
        name: data.name,
        pokeApiId: data.pokeApiId,
        types: data.types.map((type) => type.name),
        stats: data.stats.map((status) => ({
          baseStat: status.base_stat,
          effort: status.effort,
          name: status.stat.name
        }))
      })
    }

    signedUser.pokemons.push(pokemon._id)
    await signedUser.save()

    return res.status(200).send()
  })


  app.listen(port, function () {
    console.log('Aplicação escutando na porta 3000')
  })
})
