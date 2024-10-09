const AuthenticationTokenManager = require('../../../../Applications/security/AuthenticationTokenManager');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const AuthenticationError = require('../../../../Commons/exceptions/AuthenticationError');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new AuthenticationError('Missing authentication');
    }

    const bearerToken = authorization.replace('Bearer ', '');
    const authenticationTokenManager = this._container.getInstance(AuthenticationTokenManager.name);
    await authenticationTokenManager.verifyAccessToken(bearerToken);
    const artifact = await authenticationTokenManager.decodePayload(bearerToken);

    const threadId = request.params?.threadId;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(
      threadId,
      request.payload,
      artifact.username,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new AuthenticationError('Missing authentication');
    }

    const bearerToken = authorization.replace('Bearer ', '');
    const authenticationTokenManager = this._container.getInstance(AuthenticationTokenManager.name);
    await authenticationTokenManager.verifyAccessToken(bearerToken);
    const artifact = await authenticationTokenManager.decodePayload(bearerToken);

    const { threadId, commentId } = request.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(artifact.username, threadId, commentId);
    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
