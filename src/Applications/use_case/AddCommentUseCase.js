const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, useCasePayload, username) {
    await this._threadRepository.verifyThreadAvailability(threadId);
    const newComment = new NewComment(useCasePayload);
    Object.assign(newComment, { accessToken: username });
    return this._commentRepository.addComment(newComment, threadId);
  }
}

module.exports = AddCommentUseCase;
