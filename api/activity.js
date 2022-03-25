
var express = require('express');
var router = express.Router();
const { Deta } = require("deta")
const deta = Deta("c0zjinx1_bmnWXrhDYAmgwJf2vHzuDE8CvRjYyhAB")
const activitiesDB = deta.Base("activities")

router.get('/getTourismActivities', async function (req, res) {
    if(req.query['category']==undefined){
        res.status(400).send('category not found')
        return;
    }
    const activities = await activitiesDB.fetch({type:'activity',category:req.query['category']})
    res.status(200).send(activities.items)
})

router.get('/getCultureActivities',async function (req,res){
    if(req.query['category']==undefined){
        res.status(400).send('category not found')
        return;
    }
    const cultures = await activitiesDB.fetch({type:'culture',category:req.query['category']})
    res.status(200).send(cultures.items)
})

router.post("/registerActivity",async function (req,res){
    const reqParams = ['name','category','type','cost','description','act_agency_name','img_urls','ratings','location'];
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
    await activitiesDB.put(data)
    res.status(200).send("Registered activity");
})

module.exports = router;