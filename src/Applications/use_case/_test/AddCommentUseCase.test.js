const NewComment = require('../../../Domains/comments/entities/NewComment');
const Comment = require('../../../Domains/comments/entities/Comment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const username = 'user-123';
    const threadId = 'thread-123';
    const useCasePayload = { content: 'content-comment-123' };
    const mockComment = new Comment({
      id: 'comment-123',
      owner: username,
      content: useCasePayload.content,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new Comment({
        id: 'comment-123',
        owner: username,
        content: useCasePayload.content,
      })));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const newComment = await addCommentUseCase.execute(
      threadId,
      useCasePayload,
      username,
    );

    // Assert
    expect(newComment).toStrictEqual(mockComment);
    expect(mockThreadRepository.verifyThreadAvailability)
      .toBeCalledWith(threadId);

    expect(mockCommentRepository.addComment).toBeCalledWith(
      Object.assign(new NewComment(useCasePayload), { accessToken: username }),
      threadId,
    );
  });
});
