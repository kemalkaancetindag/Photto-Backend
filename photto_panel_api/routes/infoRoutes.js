const router = require("express").Router()
const multer = require("multer")
const Announcement = require("../models/AnnouncementModel")
const FAQ = require("../models/FAQModel")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null,"C:/Users/Kaan/Desktop/photto_backend/photto_panel_api/assets/announcement_images")
    },
    filename: (req, file, cb) => {        
          
        cb(null, file.originalname)
        
    }
})

const faqStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null,"C:/Users/Kaan/Desktop/photto_backend/photto_panel_api/assets/faq_images")
    },
    filename: (req, file, cb) => {        
          
        cb(null, file.originalname)
        
    }
})


const upload = multer({storage})
const faqUpload = multer({faqStorage})



//ANONCEMENT ROUTES
router.post("/new-announcement",upload.single("image") , async (req,res) => {
    const {header, content} = req.body
    var responseObject = {}


    try{
        const newAnnouncement = Announcement({
            header,
            content,
            image: req.file.path
        })

        await newAnnouncement.save()

        responseObject["success"] = true
        responseObject["error"] = null


    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
    }

    return res.json(responseObject)
    
    
})

router.post("/update-announcement", upload.single("image"), async (req,res) => {
    const {id} = req.query
    const {header,content} = req.body
    var responseObject = {} 
    var newImage = null
    try{              
        if(req.file){            
            newImage = req.file.path
        }   
        console.log(newImage)

        await Announcement.findOneAndUpdate({_id:id},{header,content,image:newImage})
        

        responseObject["success"] = true
        responseObject["error"] = null        
        
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
    }

    return res.json(responseObject)
})

router.get("/delete-announcement", async (req,res) => {
    const {id} = req.query
    var responseObject = {}
    try{
        await Announcement.findByIdAndDelete(id)
        responseObject["success"] = true
        responseObject["error"] = null

    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()

    }

    return res.json(responseObject)


})

router.get("/get-announcements", async (req,res) => {
    var responseObject = {}

    try{
        const announcements = await Announcement.find({},{},{sort:{createdAt:-1}})
        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = announcements
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }

    return res.json(responseObject)
})

router.get("/get-single-announcement", async (req,res) => {
    const {id} = req.query
    console.log(id)
    var responseObject = {}
    try{
        const announcement = await Announcement.findOne({_id:id})
        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = announcement

    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }

    return res.json(responseObject)
})
//ANONCEMENT ROUTES



//FAQ ROUTES
router.post("/new-faq",faqUpload.single("image") , async (req,res) => {
    const {question, answer} = req.body
    var responseObject = {}
    console.log(req.file)

    try{
        const newFAQ = FAQ({
            question,
            answer,
            image: req.file.path ?? null
        })

        await newFAQ.save()

        responseObject["success"] = true
        responseObject["error"] = null


    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
    }

    return res.json(responseObject)
    
    
})

router.post("/update-faq", faqUpload.single("image"), async (req,res) => {
    const {id} = req.query
    const {question,answer} = req.body
    var responseObject = {} 
    var newImage = null
    try{              
        if(req.file){            
            newImage = req.file.path
        }   
        console.log(newImage)

        await FAQ.findOneAndUpdate({_id:id},{question,answer,image:newImage})
        

        responseObject["success"] = true
        responseObject["error"] = null        
        
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
    }

    return res.json(responseObject)
})

router.get("/delete-faq", async (req,res) => {
    const {id} = req.query
    var responseObject = {}
    try{
        await FAQ.findByIdAndDelete(id)
        responseObject["success"] = true
        responseObject["error"] = null

    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()

    }

    return res.json(responseObject)


})

router.get("/get-faqs", async (req,res) => {
    var responseObject = {}

    try{
        const faqs = await FAQ.find({},{},{sort:{createdAt:-1}})
        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = faqs
    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }

    return res.json(responseObject)
})

router.get("/get-single-faq", async (req,res) => {
    const {id} = req.query
    console.log(id)
    var responseObject = {}
    try{
        const faq = await FAQ.findOne({_id:id})
        responseObject["success"] = true
        responseObject["error"] = null
        responseObject["data"] = faq

    }
    catch(e){
        responseObject["success"] = false
        responseObject["error"] = e.toString()
        responseObject["data"] = null
    }

    return res.json(responseObject)
})
//FAQ ROUTES


module.exports = router