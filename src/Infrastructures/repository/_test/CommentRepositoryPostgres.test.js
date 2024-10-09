const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const Comment = require('../../../Domains/comments/entities/Comment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  // afterEach(async () => {
  //   await CommentsTableTestHelper.cleanTable();
  // });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return comment correctly', async () => {
      const newComment = new NewComment({
        content: 'comment value',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const threadId = 'thread-123';
      const addComment = await commentRepositoryPostgres.addComment(Object.assign(newComment, { accessToken: 'user-123' }), threadId);

      expect(addComment).toStrictEqual(new Comment({
        id: 'comment-123',
        content: 'comment value',
        owner: 'user-123'
      }));
      const addedComment = await CommentsTableTestHelper.findCommentsByThreadId('thread-123');
      expect(addedComment).toHaveLength(1);
    });
  });

  describe('findCommentById function', () => {
    it('should throw NotFoundError when id comment is invalid', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const id = 'comment-xxx';

      await expect(
        commentRepositoryPostgres.findCommentById(id),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return comment by selected id', async () => {
      const payload = {
        id: 'comment-456',
        threadId: 'thread-456',
        content: 'comment value', 
        createdDate: '2024-10-04 18:22:36',
        createdBy: 'user-456'
      }
      await CommentsTableTestHelper.addComment(payload);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comment = await commentRepositoryPostgres.findCommentById(payload.id);

      expect(comment).toStrictEqual({
        id: 'comment-456',
        content: 'comment value',
        owner: 'user-456',
        is_delete: false
      });
    });
  });

  describe('findCommentByThreadId function', () => {
    it('should return all comments based on thread_id', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const threadId = 'thread-456';
      const comments = await commentRepositoryPostgres.findCommentByThreadId(threadId);

      expect(comments).toHaveLength(comments?.length);
      const [comment1] = comments;
      expect(comment1).toStrictEqual({
        id: 'comment-456',
        content: 'comment value',
        date: '2024-10-04 18:22:36',
        username: 'user-456',
        is_delete: false,
      });
    });
  });

  describe('deleteComment function', () => {
    it('should return comment deleted successfully', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const id = 'comment-123';
      await commentRepositoryPostgres.deleteCommentById(id);

      const comment = await commentRepositoryPostgres.findCommentById(id);
      expect(comment).toStrictEqual({
        id: 'comment-123',
        content: 'comment value',
        owner: 'user-123',
        is_delete: true
      });
    });
  });
});
