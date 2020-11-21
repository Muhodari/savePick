const multer = require("multer");
const express = require('express');
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");
const router = express();


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images")
    },

    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});


router.post("", checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    })
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...createdPost,
                id: createdPost._id

            }
        });
    });
});


router.get("", (req, res, next) => {
    // console.log(req.query);
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedPosts;
    const postQuery = Post.find();

    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery.then((documents) => {
            fetchedPosts = documents;
            return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: "Posts fetched successfully!",
                posts: fetchedPosts,
                maxPosts: count
            });
        })
});


router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {} else {
            res.status(404).json({ message: " post not found!" })
        }
    })
})



router.put('/:id', checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
    console.log(req.file);
    let imagePath = req.body.imagePath;

    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    })

    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {

        if (result.nModified > 0) {
            res.status(200).json({ message: "post updated successfuly" });
        } else {
            res.status(401).json({ message: "not Authorized" });
        }

    })
})


router.delete("/:id", checkAuth, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: "post deleted successfuly" });
        } else {
            res.status(401).json({ message: "not Authorized" });
        }


    })
})

module.exports = router;