const express = require("express");
const router = express.Router();

const session = require("express-session");
const user = require("../controllers/registerc");
const UserData = require("../models/register");
const auth = require("../middleware/auth");
const Blogpost = require("../models/blogpost");
router.use(
  session({
    secret: process.env.Secret_key,
    resave: false,
    saveUninitialized: true,
  })
);

const checkAuth = (req, res, next) => {
  if (req.session.user_id) {
    UserData.findById(req.session.user_id)
      .then((userData) => {
        req.user = userData;
        next();
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  } else {
    next();
  }
};

router.use(checkAuth);

router.get("/", async (req, res) => {
  try {
    // Retrieve the most recent blog posts
    const recentPosts = await Blogpost.find({}).limit(3);
    recentPosts.reverse();
    const posts = await Blogpost.find({});
    posts.reverse();

    res.render("home", { Post: posts, recentPosts, user: req.user });
  } catch (error) {
    // Handle any errors that occurred during the retrieval
    res.status(500).send("Internal Server Error");
  }
});

router.get("/about", (req, res) => {
  res.render("about", { user: req.user });
});

// render All blog posts

const blogpost = async (req, res) => {
  try {
    // Assuming Blogpost is a model or a collection representing blog posts
    const Post = await Blogpost.find({});
    Post.reverse();
    res.render("blog", { Post: Post, user: req.user });
  } catch (error) {
    // Handle any errors that occurred during the retrieval
    res.status(500).send("Internal Server Error");
  }
};
router.get("/blog", blogpost);

// comment button

router.post("/comment/:post_id", authenticateUser, async (req, res) => {
  try {
    const postId = req.params.post_id;
    const { comment } = req.body;
    const newComment = {
      user: req.user.id,
      content: comment,
    };

    const datasave = await Blogpost.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment } },
      { new: true }
    );

    res.status(200).send({ success: true, msg: "Comment added!" });
  } catch (error) {
    console.log("Error:", error);
    res.status(200).send({ success: false, msg: error.message });
  }
});

router.get("/blog/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blogpost.findById(postId).populate(
      "comments.user",
      "name image"
    );

    if (post) {
      post.views++;
      await post.save();

      const recentPosts = await Blogpost.find({ _id: { $ne: postId } }).limit(
        3
      );
      recentPosts.reverse();
      
      const comments = post.comments.reverse();

      res.render("blog-post", { post, recentPosts, comments, user: req.user });
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/blog/:id", authenticateUser, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id; // Assuming you have user authentication and can access the user ID

    const post = await Blogpost.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (post.likedBy.includes(userId)) {
      // User has already liked the post, handle accordingly (e.g., display message)
      return res.redirect(`/blog/${postId}`);
    }

    if (post.dislikedBy.includes(userId)) {
      // User has previously disliked the post, remove dislike
      post.dislikes--;
      post.dislikedBy.pull(userId);
    }

    // Add user to likedBy array and increment likes
    post.likes++;
    post.likedBy.push(userId);
    await post.save();

    res.redirect(`/blog/${postId}`);
  } catch (error) {
    // console.log("🚀 ~ file: index.js:160 ~ router.post ~ error:", error)
    res.status(500).send("Internal Server Error");
  }
});

router.post("/blog/:id", authenticateUser, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id; // Assuming you have user authentication and can access the user ID

    const post = await Blogpost.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (post.dislikedBy.includes(userId)) {
      // User has already disliked the post, handle accordingly (e.g., display message)
      return res.redirect(`/blog/${postId}`);
    }

    if (post.likedBy.includes(userId)) {
      // User has previously liked the post, remove like
      post.likes--;
      post.likedBy.pull(userId);
    }

    // Add user to dislikedBy array and increment dislikes
    post.dislikes++;
    post.dislikedBy.push(userId);
    await post.save();

    res.redirect(`/blog/${postId}`);
  } catch (error) {
    // console.log("🚀 ~ file: index.js:192 ~ router.post ~ error:", error)
    res.status(500).send("Internal Server Error");
  }
});

// Middleware to authenticate user
function authenticateUser(req, res, next) {
  if (req.user) {
    next();
  } else {
    
    res.redirect("/signin"); 
  }
}
router.get("/contact",auth.isLogin, (req, res) => {
  res.render("contact", { user: req.user });
});

router.get("/Privacy&Policy", auth.isLogin, (req, res) => {
  res.render("privacy", { user: req.user });
});

router.get("/terms&Conditions", auth.isLogin, (req, res) => {
  res.render("terms", { user: req.user });
});

router.get("/logout", auth.isLogin, user.userLogout);

router.get("/forget", auth.isLogout, (req, res) => {
  res.render("forget");
});

router.get("/forgetpass", auth.isLogout, user.forgetpassLoad);

router.get("/verification", (req, res) => {
  res.render("verification");
});

router.get("/edit", user.editLoad);

// router.get('/delete-user', user.deleteuser);

router.get("/signin", auth.isLogout, (req, res) => {
  res.render("signin");
});

// userprofile Data
router.get("/userprofile", auth.isLogin, async (req, res) => {
  try {
    const userDatas = await UserData.findById(req.session.user_id);
    res.render("userprofile", { user: userDatas });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
