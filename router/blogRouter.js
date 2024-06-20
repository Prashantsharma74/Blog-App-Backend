const express = require("express")
const { getBlogs, getBlogById, addBlog, deleteBlog, updateBlog } = require("../controller/blogController")
const { protect } = require("../middleware/authMiddleware")
const { searchBlog } = require("../controller/blogController")
const { paginatedBlog } = require("../controller/blogController")
const router = express.Router()

router.get("/", protect, getBlogs)
router.post("/addBlog", protect, addBlog)
router.post("/addBlog/:id", protect, getBlogById)
router.delete("/deleteblog/:id",deleteBlog)
router.put("/update/:id",updateBlog)
router.get('/search?keyword',searchBlog)
router.get('/paginated',paginatedBlog)

module.exports = router
