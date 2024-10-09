const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, username) {
    const newThread = new NewThread(useCasePayload);
    // await this._threadRepository.verifyAvailableTitle(newThread.title);
    Object.assign(newThread, { accessToken: username });
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
