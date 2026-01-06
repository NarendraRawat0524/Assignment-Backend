import express from 'express';
import {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic
} from '../controllers/topicController.js';

const router = express.Router();

router.route('/')
  .get(getAllTopics)
  .post(createTopic);

router.route('/:id')
  .get(getTopicById)
  .put(updateTopic)
  .delete(deleteTopic);

export default router;
