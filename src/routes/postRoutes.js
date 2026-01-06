import express from 'express';
import {
  getPostsByTopic,
  createPost,
  updatePost,
  votePost,
  deletePost
} from '../controllers/postController.js';

const router = express.Router();

router.route('/topic/:topicId')
  .get(getPostsByTopic);

router.route('/')
  .post(createPost);

router.route('/:id')
  .put(updatePost)
  .delete(deletePost);

router.route('/:id/vote')
  .post(votePost);

export default router;
