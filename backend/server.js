const app = require('./app')


const server = app.listen(process.env.PORT, () => {
    console.log(`server running port on http://locahost:${process.env.PORT}`)
})

