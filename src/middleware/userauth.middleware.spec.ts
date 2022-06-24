import { UserauthMiddleware } from './userauth.middleware';

describe('UserauthMiddleware', () => {
  it('should be defined', () => {
    expect(new UserauthMiddleware()).toBeDefined();
  });
});
