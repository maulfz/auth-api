const Comment = require('../Comment');

describe('a Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: true,
      owner: new Date(),
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'comment testing',
      owner: 'dicoding',
    };

    // Action
    const { id, content, owner } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id );
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
