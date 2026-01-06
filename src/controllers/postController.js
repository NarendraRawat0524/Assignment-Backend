import Post from '../models/Post.js';
import Topic from '../models/Topic.js';

export const getPostsByTopic = async (req, res) => {
  try {
    const posts = await Post.find({ topic: req.params.topicId })
      .populate('author', 'username email reputation')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, author, topic } = req.body;

    if (!content || !author || !topic) {
      return res.status(400).json({
        success: false,
        message: 'Content, author, and topic are required'
      });
    }

    const topicExists = await Topic.findById(topic);
    if (!topicExists) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    if (topicExists.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'Topic is locked, cannot add new posts'
      });
    }

    const post = await Post.create({ content, author, topic });

    topicExists.postCount += 1;
    await topicExists.save();

    const populatedPost = await Post.findById(post._id).populate('author', 'username email');

    res.status(201).json({
      success: true,
      data: populatedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { content } = req.body;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        content,
        isEdited: true,
        editedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('author', 'username email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const votePost = async (req, res) => {
  try {
    const { voteType } = req.body;

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vote type. Use "upvote" or "downvote"'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (voteType === 'upvote') {
      post.upvotes += 1;
    } else {
      post.downvotes += 1;
    }

    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const topic = await Topic.findById(post.topic);
    if (topic) {
      topic.postCount = Math.max(0, topic.postCount - 1);
      await topic.save();
    }

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
