
var express = require('express');
var router = express.Router();
const { Deta } = require("deta")
const deta = Deta("c0zjinx1_bmnWXrhDYAmgwJf2vHzuDE8CvRjYyhAB")
const patientDB = deta.Base("patient")

router.get('/get', async function (req, res) {
    const patients = await patientDB.fetch()
    res.send(patients.items)
})

router.post('/register', async function (req, res) {
  // pid , name, age, country, gender
  const reqParams = ['pid','name','age','country','gender'];
  for(let par of reqParams){
    if(req.body[par]==undefined){
      res.status(400).send(par+" not found");
      return ;
    }
  }
  let data = {}
  for(let par of reqParams){
    data[par] = req.body[par]
  }
  await patientDB.put(data)
  res.status(200).send("Registered user");
})

router.post('/login', async function (req, res) {
  if(req.body['pid']==undefined){
    res.status(400).send("PID not found")
    return ;
  }

  let patient = await patientDB.fetch({pid:req.body['pid']})
  res.status(200).send(patient.items);
})


module.exports = router;