const Blog = require("../model/blogSchema");
const User = require("../model/userSchema");

// All Blogs
exports.getBlogs = async (req, res) => {
  try {
    const query = {};
    if (req.query.user_id) {
      query.user = req.query.user_id;
    }

    const blogs = await Blog.find(query).populate("user", "username");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Blog by Id
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "user",
      "username"
    );
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Blogs
exports.addBlog = async (req, res) => {
  try {
    const { title, content, tags, category } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ error: "Title and content are required fields" });
    }

    const newBlog = new Blog({
      title,
      content,
      user: req.user.id,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Blogs
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, tags, category } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ error: "Title and content are required fields" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        tags: tags || [],
        category: category || "",
        updated_at: new Date(),
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json({ message: "Blog updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Blogs
exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search Blogs
exports.searchBlog = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ error: "Keyword is required" });
    }

    // Search for blogs matching the keyword in title, content, or tags
    const blogs = await Blog.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } }, // Case-insensitive search
        { content: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get blogs with pagination
exports.paginatedBlog = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number, default to 1
  const limit = parseInt(req.query.limit) || 10; // Number of blogs per page, default to 10

  try {
    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    const blogs = await Blog.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      totalPages,
      currentPage: page,
      blogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
