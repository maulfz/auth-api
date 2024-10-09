const GetThread = require('../../Domains/threads/entities/GetThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.findThreadById(threadId);
    const comments = await this._commentRepository.findCommentByThreadId(threadId);
    const mappedComments = comments.map(el => (
      {...el, content: el.is_delete === true ? '**komentar telah dihapus**' : el.content}
    ));
    return new GetThread({...thread, ...{comments: mappedComments}});
  }
}

module.exports = GetThreadUseCase;
