const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw NotFoundError when thread not exists', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread exists', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id:'thread-123', title: 'testing-thread' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addThread function', () => {
    it('should persist new thread and return thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'testing',
        body: 'description testing',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addThread = await threadRepositoryPostgres.addThread(Object.assign(newThread, { accessToken: 'user-123' }));

      // Assert
      expect(addThread).toStrictEqual(new Thread({
        id: 'thread-123',
        title: 'testing',
        owner: 'user-123',
      }));
      const addedThread = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(addedThread).toHaveLength(1);
    });
  });

  describe('findThreadById', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.findThreadById('dicoding'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return details when thread is found', async () => {
      // Arrange
      const payload = {
        id: 'thread-456',
        title: 'test title', 
        body: 'test body description', 
        createdDate: '2024-10-04 18:22:36',
        createdBy: 'user-456'
      }
      await ThreadsTableTestHelper.addThread(payload);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.findThreadById('thread-456');

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-456', 
        title: 'test title', 
        body: 'test body description', 
        date : payload.createdDate,
        username:'user-456',
      });
    });
  });
});
