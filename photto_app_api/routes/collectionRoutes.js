const calculatePeriods = require("../helpers/helpers")
const { collection } = require("../models/CollectionModel")
const Collection = require("../models/CollectionModel")
const { Item } = require("../models/ItemModel")


const router = require("express").Router()



router.get("/popular-collections", async (req, res) => {
    var responseObject = {}
    try {
        const popularColelctions = await Collection.find({}, {}, { limit: 8, sort: { traded: -1 } })
        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = popularColelctions
    }
    catch (e) {
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }

    res.json(responseObject)


})

router.get("/top-100", async (req, res) => {
    const { period } = req.query
    var responseObject = {}
    var periodObject = calculatePeriods(period)

    console.log(periodObject)

    try {
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
                                        { "$gt": ["$$trade.date", periodObject["oneStep"]] },
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
                                        { "$gt": ["$$trade.date", periodObject["twoStep"]] },
                                        { "$lt": ["$$trade.date", periodObject["oneStep"]] }
                                    ]
                                }
                            }
                        },
                        "document": "$$ROOT"

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
                        "ratio": {
                            "$switch": {
                                "branches": [
                                    { "case": { "$eq": ["$calculated_volume", 0] }, "then": 0 },
                                    { "case": { "$eq": ["$calculated_one_step_back_volume", 0] }, "then": "$calculated_volume" },
                                    {
                                        "case": {
                                            "$and": [
                                                { "$eq": ["$calculated_one_step_back_volume", null] },
                                                { "$eq": ["$calculated_volume", null] }
                                            ]
                                        }, "then": 0
                                    },                                 
                                ],
                                "default": 10
                            }
                        }
                    }
                },
                {
                    "$sort": {
                        "ratio": -1
                    }
                }

            ]
        )
        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = collections

    }
    catch (e) {
        responseObject["success"] = true
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }

    console.log(responseObject)



    return res.json(responseObject)
})

router.get("/single-collection", async (req, res) => {
    const { contract_address } = req.query
    console.log(contract_address)

    var responseObject = {}
    var dataObject = {}

    try {
        const collection = await Collection.aggregate([
            { $match: { contract_address: contract_address } },
            {
                $addFields: {
                    floorPrice: {
                        $min: {
                            $map: {
                                input: "$trades",
                                as: "trade",
                                in: "$$trade.amount"
                            }
                        }
                    }
                }
            }
        ])



        const items = await Item.find({
            '_id': { $in: collection[0].items }
        })

        console.log(items)



        dataObject["items"] = items
        dataObject["collection_data"] = collection[0]
        responseObject["error"] = null
        responseObject["success"] = true
        responseObject["data"] = dataObject



    }
    catch (e) {
        dataObject["items"] = null
        dataObject["collection_data"] = null
        responseObject["error"] = e.toString()
        responseObject["success"] = false
        responseObject["data"] = null
    }



    res.json(responseObject)
})

router.get("/search-item", async (req, res) => {
    const { term, contract_address } = req.query

    var responseObject = {}

    try {
        const items = await Item.find({
            name: { $regex: `${term}`, $options: 'i' },
            contract_address: contract_address
        })

        responseObject["error"] = null
        responseObject["success"] = true
        responseObject["data"] = items
    }
    catch (e) {
        responseObject["error"] = e.toString()
        responseObject["success"] = false
        responseObject["data"] = null
    }

    res.json(responseObject)


})


module.exports = router