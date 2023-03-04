const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const fs = require('fs');
// const { check, validationResult } = require('express-validator')
const multer = require('multer')
const path = require('path');
// const checkAuth = require('../authentication')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname)
    }
});
console.log('image page')
const upload = multer({ storage: storage})
router.post('/',upload.single('image'), async (req, res)=>{
    const {title,description} = req.body
    console.log(title,description)
        const items = {
            title: req.body.title,
            description: req.body.description,
            image: {
                data: fs.readFileSync(path.join(__dirname + '../../../public/images/' + req.file.filename )),
                contentType: req.file.mimetype        
            }
    }
    Image.create(items, (err, items) => {
        if (err) {
            console.log(err);
        }
        res.send('welcome')
    })   
    
}
  
);
module.exports = router;