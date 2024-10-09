const Comment = require('../../../Domains/comments/entities/Comment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('DeleteCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const username = 'user-123';

    const threadId = 'thread-123';

    const id = 'comment-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({id, content: 'comment-content', owner:  username}));
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const deleteComment = await deleteCommentUseCase.execute(username, threadId, id);

    // Assert
    expect(deleteComment).toStrictEqual({ status: 'success' });
    expect(mockCommentRepository.findCommentById)
      .toBeCalledWith(id);
    expect(mockThreadRepository.verifyThreadAvailability)
      .toBeCalledWith(threadId);

    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(id);
  });

  it('should throw AuthorizationError', async () => {
    // Arrange
    const username = 'user-123';
    const threadId = 'thread-123';
    const id = 'comment-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({id, content: 'comment-content', owner: 'user-456'}));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(username, threadId, id))
      .rejects
      .toThrowError('AUTHENTICATION.UNAUTHORIZED');
    expect(mockCommentRepository.findCommentById)
      .toBeCalledWith(id);
  });
});
