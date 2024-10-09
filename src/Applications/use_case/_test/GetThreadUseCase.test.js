const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const thread = [{
      id: 'thread-123',
      title: 'title-test',
      body: 'body-test',
      date: '2024-10-07 20:00:00',
      username: 'user-123',
    }];
    const mockGetThread = new GetThread({...thread[0], 
      comments: [{
          id: 'thread-123',
          content: 'comment-test-123',
          is_delete: false,
          date: '2024-10-07 20:02:00',
          username: 'user-123',
        },{
          id: 'thread-456',
          content: '**komentar telah dihapus**',
          is_delete: true,
          date: '2024-10-07 20:20:00',
          username: 'user-456',
      }]
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread[0]));
    mockCommentRepository.findCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'thread-123',
        content: 'comment-test-123',
        is_delete: false,
        date: '2024-10-07 20:02:00',
        username: 'user-123',
      },{
        id: 'thread-456',
        content: 'comment-test-456',
        is_delete: true,
        date: '2024-10-07 20:20:00',
        username: 'user-456',
      },
     ]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(threadId);

    // Assert
    expect(getThread).toStrictEqual(mockGetThread);
    expect(mockThreadRepository.findThreadById)
      .toBeCalledWith(threadId);
    expect(mockCommentRepository.findCommentByThreadId)
      .toBeCalledWith(threadId);
  });
});
