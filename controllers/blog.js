var express = require('express');
var fs = require("fs");
const { v4: uuidv4 } = require('uuid');     // this is used to create random id
const router = express.Router()
const dbcon = require('../config/dbconnection');
const { dirname } = require('path');
var uploadImage = require('../middleware/uploadImage')

var postlist = []

router.get('/', async function (req, res) {
    postlist = await dbcon.select('*').from('post')
    res.json(postlist);
});

router.post('/', uploadImage, async function (req, res) {
    var newpost = {}
    newpost.title = req.body.title;
    newpost.content = req.body.content;
    newpost.createdAt = new Date();
    newpost.createdBy = req.userId;
    newpost.id = uuidv4();   // this will create unique id

    if (req.file) {
        var name = req.file.filename
        newpost.Image = name
    }
    postlist = await dbcon.insert(
        newpost
    )
        .into('post')
    res.json(newpost)
})

// post update
router.put('/:id', uploadImage, async function (req, res) {
    var newpost = {}
    var post = await dbcon.first('*').from('post').where('ID', req.params.id)
    newpost.title = req.body.title;
    newpost.content = req.body.content;
    newpost.updatedAt = new Date();
    newpost.updatedBy = req.userId

    if (req.file) {
        var name = req.file.filename
        newpost.Image = name
    }
    if (post.Image) {
        const appDir = dirname(require.main.filename);
        await fs.unlinkSync(appDir + '/uploads/' + post.Image);

    }
    // updating data from table
    postlist = await dbcon('post').where('ID', req.params.id).update(
        newpost
    )
    res.json(newpost)
})

router.delete('/:id', async function (req, res) {
    await dbcon('post')
        .where('ID', req.params.id)
        .del()
    res.send("Post Deleted Sucessfully")
});

router.get('/:id', async function (req, res) {
    var post = await dbcon.first('*').from('post').where('ID', req.params.id)
    res.json(post);
})

module.exports = router