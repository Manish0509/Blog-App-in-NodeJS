var express = require('express');
var app = express();
var fs = require("fs");
const { v4: uuidv4 } = require('uuid');     // this is used to create random id
const router = express.Router()
var utility = require('../utility/utility')
const dbcon = require('../config/dbconnection')
var uploadImage = require('../middleware/uploadImage')
var userlist = []


router.get('/', async function (req, res) {
  userlist = await dbcon.select('*').from('users')
  res.json(userlist)
});

// Uploading file using "multer"
router.post('/upload', uploadImage, (req, res) => {
  console.log("File uploaded successfully")
  res.send("File uploaded successfully")
});


router.post('/', async function (req, res) {
  var newuser = req.body;
  newuser.password = utility.encrypt(newuser.password)  //encrypt the password entered by the user
  newuser.id = uuidv4();   // this will create unique id
  newuser.createdBy = 'system';
  newuser.createdAt = Date();
  userlist = await dbcon.insert(
    newuser
  )
    .into('users')
  res.json(newuser)
})

router.delete('/:id', async function (req, res) {
  var userdel=await dbcon('users').where('ID', req.params.id).del()
  if(userdel)
    res.send("User Deleted Sucessfully")
  else
    res.send("Entered user not exist")
});

router.get('/:id', async function (req, res) {
  var user = await dbcon.first('*').from('users').where('ID', req.params.id)
  if(user)
    res.json(user);
  else
    res.json("User ID not exist")
})

module.exports = router