import { SafeFlagPipe } from './safe-flag.pipe';

describe('SafeFlagPipe', () => {
  it('create an instance', () => {
    const pipe = new SafeFlagPipe();
    expect(pipe).toBeTruthy();
  });
});
