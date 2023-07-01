const mongoose = require("mongoose")

exports.connectDB = () => {
    mongoose.connect('mongodb://localhost:27017/E-commerce', { useNewUrlParser: true }).then(data => {
        console.log(`mongoDb connected with server ${data.connection.host}`)
    })
}
