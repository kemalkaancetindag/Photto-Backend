const router = require("express").Router()
const multer = require("multer")
const Announcement = require("../models/AnnouncementModel")
const FAQ = require("../models/FAQModel")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null,`${process.cwd()}/assets/announcement_images`)
    },
    filename: (req, file, cb) => {        
          
        cb(null,  `${Date.now()}_news.${file.mimetype.split("/")[1]}`)
        
    }
})

const faqStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null,`${process.cwd()}/assets/faq_images`)
    },
    filename: (req, file, cb) => {    
        
            
          
        cb(null, `${Date.now()}_faq.${file.mimetype.split("/")[1]}`)
        
    }
})


const upload = multer({storage:storage})
const faqUpload = multer({storage:faqStorage})



//ANONCEMENT ROUTES
router.post("/new-announcement",upload.single("image") , async (req,res) => {
    const {title_tr, content_tr, title_eng, content_eng} = req.body
    var responseObject = {}


    try{
        const newAnnouncement = Announcement({
            title_tr,
            content_tr,
            title_eng,
            content_eng,
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
    
    const {question_tr,question_eng, answer_tr, answer_eng} = req.body    
    var responseObject = {}        

    try{
        const newFAQ = FAQ({
            question_tr,
            question_eng,
            answer_tr,
            answer_eng,
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
    console.log("id")
    console.log(id)
    const {question_tr,question_eng,answer_tr,answer_eng} = req.body
    console.log(req.body)
    var responseObject = {} 
    var newImage = null
    try{              
        if(req.file){            
            await FAQ.findOneAndUpdate({_id:id},{question_tr,answer_tr,image:req.file.path,question_eng,answer_eng})            
        }   
        else{
            await FAQ.findOneAndUpdate({_id:id},{question_tr,answer_tr,question_eng,answer_eng})            
        }
        

        
        

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