const mongoose = require('mongoose');
async function connect(url = 'mongodb://mongo:27017/mentoria'){
    await mongoose.connect(url)
}
exports.connect=connect