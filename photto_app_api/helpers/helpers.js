

const calculatePeriods = (period) => {
    var now = Math.floor(Date.now() / 1000)
    const oneDay = 86400
    const oneWeek = 604800 
    const oneMonth = 2629743

    var periodObject = {}

    switch(period){
        case "1d":
            periodObject["oneStep"] = now - oneDay
            periodObject["twoStep"] = now - (oneDay*2)
            break
        case "3d":
            periodObject["oneStep"] = now - (oneDay*3)
            periodObject["twoStep"] = now - (oneDay*6)
            break
        case "1w":
            periodObject["oneStep"] = now - oneWeek
            periodObject["twoStep"] = now - (oneWeek*2)
            break
        case "1m":
            periodObject["oneStep"] = now - oneMonth
            periodObject["twoStep"] = now - (oneMonth*2)
            break
    }

    periodObject["now"] = now
    return periodObject

} 


module.exports = calculatePeriods