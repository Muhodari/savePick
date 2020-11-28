const Post = require("../models/post");
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

// var http = require('http');
// var fs = require('fs');


exports.createPost = (req, res, next) => {
    console.log(req.file.filename);
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
    }).catch(error => {
        res.status(500).json({
            message: "creating a post failed"
        })
    });
}

//  download function



exports.downloadPost = async function(req, res, next) {

    const filePath = path.join(__dirname, '../images/' + req.params.filePath);
    console.log(filePath);
    res.status(200).sendFile(filePath);
}

// update user
exports.updatePost = (req, res, next) => {
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


    Post.updateOne({
        _id: req.params.id,
        creator: req.userData.userId
    }, post).then(result => {

        if (result.n > 0) {
            res.status(200).json({
                message: "post updated successfuly"
            });
        } else {
            res.status(401).json({
                message: "not Authorized"
            });
        }
    }).catch(error => {

        res.status(500).json({
            message: "updating post failed"
        })
    });
}

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedPosts;
    const postQuery = Post.find({ creator: req.userData.userId });

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
        .catch(error => {

            res.status(500).json({
                message: "fetching posts failed"
            })
        })
}

// post at given id
exports.getPost = (req, res, next) => {
    try {

        Post.find({
            creator: req.params.id
        }).then(post => {
            console.log(post)
            return res.send(post)
        });
    } catch (error) {
        console.log("error ngiyi : ", error)
        res.send(error.toString())
    }

}


exports.deletePost = (req, res, next) => {
    Post.deleteOne({
        _id: req.params.id,
        creator: req.userData.userId
    }).then(result => {
        if (result.n > 0) {
            res.status(200).json({
                message: "post deleted successfuly"
            });
        } else {
            res.status(401).json({
                message: "not Authorized"
            });
        }
    }).catch(error => {

        res.status(500).json({
            message: "deleting post failed"
        })
    })
}