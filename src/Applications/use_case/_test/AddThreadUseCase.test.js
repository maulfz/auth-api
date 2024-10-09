const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const username = 'user-123';
    const useCasePayload = {
      title: 'first title',
      body: 'body for description',
    };
    const mockNewThread = new NewThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    // mockThreadRepository.verifyAvailableTitle = jest.fn()
    //   .mockImplementation(() => Promise.resolve(useCasePayload.title));
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new NewThread({
          id: 'thread-123',
          title: useCasePayload.title,
          body: useCasePayload.body,
        })
      ));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const newThread = await addThreadUseCase.execute(useCasePayload, username);

    // Assert
    expect(newThread).toStrictEqual(mockNewThread);
    // expect(mockThreadRepository.verifyAvailableTitle)
    //   .toBeCalledWith(useCasePayload.title);

    expect(mockThreadRepository.addThread).toBeCalledWith(
      Object.assign(new NewThread(useCasePayload), { accessToken: username })
    );
  });
});
