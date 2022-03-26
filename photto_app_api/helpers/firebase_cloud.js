const User = require("../models/UserModel");

const admin = require("firebase-admin")


const sendNotification = async (notification,wallet_address)  => {        
        const notification_options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };

      

        try{
            const user = await User.findOne({wallet_address})        
            const result = await admin.messaging().sendToDevice(user.instance_token, notification, notification_options)
            console.log(result)           
        }   
        catch(e){
            console.log(e)
        }                    

}

module.exports = sendNotification