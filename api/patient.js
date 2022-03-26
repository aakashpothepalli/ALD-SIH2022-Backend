
var express = require('express');
var router = express.Router();
const { Deta } = require("deta")
const deta = Deta("c0zjinx1_bmnWXrhDYAmgwJf2vHzuDE8CvRjYyhAB")
const patientDB = deta.Base("patient")

router.get('/get', async function (req, res) {
    const patients = await patientDB.fetch()
    res.status(200).send(patients.items)
})

router.get('/getPatient', async function (req, res) {
  if(req.query['pid']==undefined){
      res.status(400).send('pid not found')
      return;
  }
  const patients = await patientDB.fetch({pid:req.query['pid']})
  res.status(200).send(patients.items)
})

router.post('/register', async function (req, res) {
  // pid , name, age, country, gender
  const reqParams = ['email','password','name','age','country','gender'];
  for(let par of reqParams){
    if(req.body[par]==undefined){
      res.status(400).send(par+" not found");
      return ;
    }
  }
  let patient = await patientDB.fetch({email:req.body['email']})
  if(patient.count!=0){
    res.status(401).send("User already exists")
    return;
  }
  const { v4: uuidv4 } = require('uuid');

  let pid = uuidv4();
  let data = {}
  for(let par of reqParams){
    data[par] = req.body[par]
  }
  data['pid'] = pid
  await patientDB.put(data)
  res.status(200).send("Registered user");
})

router.post('/loginbyemail', async function (req, res) {

  const reqParams = ['email','password'];
  for(let par of reqParams){
    if(req.body[par]==undefined){
      res.status(400).send(par+" not found");
      return ;
    }
  }

  let patient = await patientDB.fetch({email:req.body['email']})
  if(patient.count==0){
    res.status(401).send("User not found")
    return;
  }
  res.status(200).send(patient.items[0]);
})

router.post("/loginbypid",async function (req,res){
  const reqParams = ['pid'];
  for(let par of reqParams){
    if(req.body[par]==undefined){
      res.status(400).send(par+" not found");
      return ;
    }
  }
  let patient = await patientDB.fetch({pid:req.body['pid']})
  if(patient.count==0){
    res.status(401).send("User not found")
    return;
  }
  res.status(200).send(patient.items[0]);
})
router.post('/bookactivity', async function (req, res) {
  const reqParams = ['aid','pid'];
  for(let par of reqParams){
    if(req.body[par]==undefined){
      res.status(400).send(par+" not found");
      return ;
    }
  }
  let booking = await deta.Base('travel_bookings').fetch({aid:req.body['aid'],pid:req.body['pid']})
  if(booking.count!=0){
    res.status(401).send("Already booked")
    return;
  }
  let data = {}
  for(let par of reqParams){
    data[par] = req.body[par]
  }
  await deta.Base('treatment_bookings').put(data)
  res.status(200).send("Booked");

})

module.exports = router;