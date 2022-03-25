const { Deta } = require("deta")
const deta = Deta("c0zjinx1_bmnWXrhDYAmgwJf2vHzuDE8CvRjYyhAB")
const db = deta.Base("temp")

const express = require("express")
const app = express()

app.use('/patient', require('./api/patient'))

app.listen(8000 || process.env.PORT,()=>{
    console.log("listening on 8000");
})