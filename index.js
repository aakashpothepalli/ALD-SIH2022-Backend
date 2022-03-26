const { Deta } = require("deta")
const deta = Deta("c0zjinx1_bmnWXrhDYAmgwJf2vHzuDE8CvRjYyhAB")
const db = deta.Base("temp")
const express = require("express")
const app = express()
app.use(express.json())
app.use('/patient', require('./api/patient'))
app.use('/hospital', require('./api/hospital'))
app.use('/activity', require('./api/activity'))
app.use('/hotel', require('./api/hotel'))

app.listen(process.env.PORT || 8000,()=>{
    console.log("listening on ",process.env.PORT || 8000);
})