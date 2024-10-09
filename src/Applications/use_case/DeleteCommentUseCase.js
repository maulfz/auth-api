class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(username, threadId, commentId) {
    const comment = await this._commentRepository.findCommentById(commentId);
    if (comment.owner !== username) {
      throw new Error('AUTHENTICATION.UNAUTHORIZED');
    }

    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.deleteCommentById(commentId);
    return { status: 'success' };
  }
}

module.exports = DeleteCommentUseCase;
