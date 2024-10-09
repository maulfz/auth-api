const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const Comment = require('../../Domains/comments/entities/Comment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment, threadId) {
    const { content, accessToken } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const createdDate = new Date();
    const isDelete = false;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, created_by as owner',
      values: [id, threadId, content, isDelete, createdDate, accessToken],
    };

    const result = await this._pool.query(query);
    return new Comment({ ...result.rows[0] });
  }

  async findCommentById(id) {
    const query = {
      text: 'SELECT id, content, created_by as owner, is_delete FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('id comment tidak valid');
    }
    return ({ ...result.rows[0] });
  }

  async findCommentByThreadId(threadId) {
    const query = {
      text: 'SELECT id, content, created_on::text as date, created_by as username, is_delete FROM comments WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return (result.rows);
  }

  async deleteCommentById(id) {
    const isDelete = true;

    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2',
      values: [isDelete, id],
    };

    await this._pool.query(query);

    return { status: 'success' };
  }
}

module.exports = CommentRepositoryPostgres;
