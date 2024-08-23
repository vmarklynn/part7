const blogsRouter = require("express").Router();
const { userExtractor } = require("../utils/middleware");
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  const blogToDelete = await Blog.findById(request.params.id);

  if (user.id.toString() === blogToDelete.user.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
  } else {
    return response.status(401).send({ error: "unauthorized user" });
  }

  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const newBlog = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
    new: true,
  });

  response.json(updatedBlog);
});

module.exports = blogsRouter;
