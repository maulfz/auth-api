const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const Thread = require('../../Domains/threads/entities/Thread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyThreadAvailability(threadId) {
    const query = {
      text: 'SELECT title FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async addThread(newThread) {
    const { title, body, accessToken } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const createdDate = new Date();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, created_by as owner',
      values: [id, title, body, createdDate, accessToken],
    };

    const result = await this._pool.query(query);

    return new Thread({ ...result.rows[0] });
  }

  async findThreadById(id) {
    const query = {
      text: 'SELECT id, title, body, created_on::text as date, created_by as username FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('id thread tidak valid');
    }
    return { ...result.rows[0] };
  }
}

module.exports = ThreadRepositoryPostgres;
