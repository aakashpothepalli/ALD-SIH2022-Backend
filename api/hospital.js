
var express = require('express');
var router = express.Router();
const { Deta } = require("deta");
const { default: axios } = require('axios');
const { response } = require('express');
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
    console.log("here")
    let category = null
    let response = null
    try{
       response = await axios.post('https://api-inference.huggingface.co/models/Supreeth/BioBERT',{
        "inputs":req.body['diagnosis']
        },{
          headers: {
            "Authorization": "Bearer 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"
          }
        })

        // LABEL 1 -> red
        // LABEL 2 -> Yellow
        // LABEL 0 -> Green
      // res.status(200).send(response.data)
    }
    catch(e){
      console.log(e)
      res.status(400).send("Error in ML Model")
      return ;
    }
    let red = 0 , yellow = 0 , green = 0;
    let data = response.data[0]
    console.log(data)
    for(let i = 0 ; i < data.length ; i++){
        if(data[i]['label']=='LABEL_0'){
            green=data[i]['score']
        }
        else if(data[i]['label']=='LABEL_1'){
            red = data[i]['score']
        }
        else if(data[i]['label']=='LABEL_2'){
            yellow = data[i]['score']
        }
    } 
    console.log(red,yellow,green)
    if(red>yellow && red>green){
        category = 'red'
    }
    else if(yellow>red && yellow>green){
        category = 'yellow'
    }
    else if(green>red && green>yellow){
        category = 'green'
    }

    // res.status(200).send({red,yellow,green,category})
    const diagnosisDB = deta.Base("diagnosis")
    diagnosisDB.put({
        did:req.body['did'],
        pid:req.body['pid'],
        hid:req.body['hid'],
        category:category
    })
    res.status(200).send({category,message:"Successfully classified",red,yellow,green});
})

module.exports = router;