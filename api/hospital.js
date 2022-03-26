
var express = require('express');
var router = express.Router();
const { Deta } = require("deta")
const deta = Deta("c0zjinx1_bmnWXrhDYAmgwJf2vHzuDE8CvRjYyhAB")
const hospitalDB = deta.Base("hospital")

router.get('/get', async function (req, res) {
    const hospitals = await deta.Base('hospital').fetch()
    res.status(200).send(hospitals.items)
})

router.post('/register', async function (req, res) {
  // pid , name, age, country, gender
  const reqParams = ['hid','name','location','latlong','about','specialities','img_url','ratings','contact'];
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
  await hospitalDB.put(data)
  res.status(200).send("Registered hospital");
})

router.post('/login', async function (req, res) {
  if(req.body['pid']==undefined){
    res.status(400).send("PID not found")
    return ;
  }

  let patient = await patientDB.fetch({pid:req.body['pid']})
  res.status(200).send(patient.items);
})

router.get('/bookings', async function (req, res) {
    if(req.query['hid']==undefined){
        res.status(400).send("hid not found")
        return ;
    }
    const treatment_bookings = deta.Base("treatment_bookings")
    const bookings = await treatment_bookings.fetch({hid:req.body['hid']})
    res.status(200).send(bookings.items)
  
})

router.post('/classify',async function (req,res){
    // Get text from Doctor, send it to ML Model , retrieve category and put in it diagnosis DB
    const reqParams = ['did','pid','hid','diagnosis'];
    for(let par of reqParams){
      if(req.body[par]==undefined){
        res.status(400).send(par+" not found");
        return ;
      }
    }
    // API Call to retrieve Category from ML Model

    let category = null

    const diagnosisDB = deta.Base("diagnosis")
    diagnosisDB.put({
        did:req.body['did'],
        pid:req.body['pid'],
        hid:req.body['hid'],
        category:category
    })
    res.status(200).send({category,message:"Successfully classified"});
})

module.exports = router;