const Collection = require("../models/CollectionModel")
const { Item } = require("../models/ItemModel")
const router = require("express").Router()
const calculatePeriods = require("../helpers/helpers")


router.get("/rankings", async (req,res) => {
    var responseObject = {}





    try{
        const rankedCollections = await Collection.aggregate([
            { $addFields: {
                total: { $sum: {
                  $map: { input: "$trades", as: "trade", in: "$$trade.amount" }
                }}
            }},
            { $sort : { total : -1 } }
        ])

        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = rankedCollections


    }
    catch(e){

        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null

    }

    res.json(responseObject)

        

})

router.get("/recent-rockets", async (req,res) => {
    var responseObject = {}
    var periodObject = calculatePeriods("3d")
    console.log(periodObject)

    try{
        const collections = await Collection.aggregate(
            [
                {
                    "$project": {
                        "volume": {
                            "$filter": {
                                "input": "$trades",
                                "as": "trade",
                                "cond": {
                                    "$and": [
                                        { "$gt" : [ "$$trade.date", periodObject["oneStep"] ] },
                                        { "$lt": ["$$trade.date", periodObject["now"]] }
                                    ]
                                }
                            }
                        },
                        "one_step_back_volume": {
                            "$filter": {
                                "input": "$trades",
                                "as": "trade",
                                "cond": {
                                    "$and": [
                                        { "$gt" : [ "$$trade.date", periodObject["twoStep"] ] },
                                        { "$lt": ["$$trade.date", periodObject["oneStep"]] }
                                    ]
                                }
                            }
                        },
                        "document":"$$ROOT"
    
                    }
                },
                {
    
                    "$addFields": {                    
                        "calculated_volume": {
                            "$reduce": {
                                input: "$volume",
                                initialValue: 0,
                                in: {
                                    $add: ["$$value", "$$this.amount"]
                                }
                            },
                        },
                        "calculated_one_step_back_volume": {
                            "$reduce": {
                                input: "$one_step_back_volume",
                                initialValue: 0,
                                in: {
                                    $add: ["$$value", "$$this.amount"]
                                }
                            },
                        },
                        
    
                    }
                },
                {
                    "$addFields": {                                        
                        "ratio":{
                            $cond: {
                                if: {
                                  $ne: ['$calculated_one_step_back_volume', 0],
                                },
                                // then return its value as is
                                then: { $divide: [ "$calculated_volume", "$calculated_one_step_back_volume" ] },
                                // else exclude this field
                                else: "$calculated_volume",
                              },
                        }
                    }
                },
                {
                    "$sort":{
                        "ratio":-1
                    }
                }
    
            ]
        )

        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = collections

    }
    catch(e){

        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null

    }
  

    res.json(responseObject)

})

module.exports = router
