const mongoose = require('mongoose')
const StatsSchema = new mongoose.Schema({
    name: String,
    baseStat: Number,
    effort: Number, 
})
const PokemonSchema = new mongoose.Schema({
    name: String,
    type: [String],
    stats: [StatsSchema]
})
const Pokemon = mongoose.model('Pokemon', PokemonSchema)
module.exports = Pokemon