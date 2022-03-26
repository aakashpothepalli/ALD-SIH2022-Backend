
var express = require('express');
var router = express.Router();
const { Deta } = require("deta")
const deta = Deta("c0zjinx1_bmnWXrhDYAmgwJf2vHzuDE8CvRjYyhAB")
const hotelDB = deta.Base("hotel")
router.get('/get', async function (req, res) {
    const hotels = await hotelDB.fetch()
    res.status(200).send(hotels.items)
})

router.post('/register', async function (req, res) {
  // pid , name, age, country, gender
  const reqParams = ['hotel_id','name','location','latlong','description','cost','img_url','ratings','facilities'];

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
  res.status(200).send("Registered hotel");
})

router.post('/book',async (req,res)=>{
    if(req.body['pid']==undefined){
        res.status(400).send("PID not found")
        return ;
    }
    if(req.body['hotel_id']==undefined){
        res.status(400).send("hotel_id not found")
        return ;
    }
    if(req.body['checkin_date']==undefined){
        res.status(400).send("checkin_date not found")
        return ;
    }
    const bookingDB = deta.Base('hotel_booking')
    const bookings = await bookingDB.fetch({pid:req.body['pid'],hotel_id:req.body['hotel_id'],checkin_date:req.body['checkin_date']})
    const bookings_data = bookings.items
    
    for(let booking of bookings_data){
        if(booking.pid==req.body['pid'] && booking.hotel_id==req.body['hotel_id'] && booking.checkin_date==req.body['checkin_date']){
            res.status(400).send("Already booked")
            return ;
        }
    }
    let data = {}
    for(let par of reqParams){
        data[par] = req.body[par]
    }
    await bookingDB.put(data)
    res.status(200).send("Booked hotel");
})
module.exports = router;