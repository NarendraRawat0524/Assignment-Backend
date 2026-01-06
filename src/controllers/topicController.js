import Topic from '../models/Topic.js';

export const getAllTopics = async (req, res) => {
  try {
    const { category, sort } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    let topics = Topic.find(query).populate('author', 'username email');

    if (sort === 'popular') {
      topics = topics.sort({ viewCount: -1 });
    } else if (sort === 'recent') {
      topics = topics.sort({ createdAt: -1 });
    }

    const result = await topics.exec();

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('author', 'username email reputation');

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    topic.viewCount += 1;
    await topic.save();

    res.status(200).json({
      success: true,
      data: topic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createTopic = async (req, res) => {
  try {
    const { title, content, category, author } = req.body;

    if (!title || !content || !category || !author) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, category, and author are required'
      });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const topic = await Topic.create({
      title,
      content,
      category,
      author,
      slug
    });

    const populatedTopic = await Topic.findById(topic._id).populate('author', 'username email');

    res.status(201).json({
      success: true,
      data: populatedTopic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateTopic = async (req, res) => {
  try {
    const { title, content, category, isPinned, isLocked } = req.body;

    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      { title, content, category, isPinned, isLocked },
      { new: true, runValidators: true }
    ).populate('author', 'username email');

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    res.status(200).json({
      success: true,
      data: topic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Topic deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
