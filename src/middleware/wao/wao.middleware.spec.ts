import { WaoMiddleware } from './wao.middleware';

describe('WaoMiddleware', () => {
  it('should be defined', () => {
    expect(new WaoMiddleware()).toBeDefined();
  });
});
