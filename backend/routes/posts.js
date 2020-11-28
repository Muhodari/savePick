const express = require('express');
const PostController = require("../controllers/posts")
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file")
const router = express();





router.post("", checkAuth, extractFile, PostController.createPost);
router.put('/:id', checkAuth, extractFile, PostController.updatePost);
router.get("", checkAuth, PostController.getPosts);
router.get('/:id', PostController.getPost)
router.get('/file/:filePath', checkAuth, PostController.downloadPost);
router.delete("/:id", checkAuth, PostController.deletePost)

module.exports = router;