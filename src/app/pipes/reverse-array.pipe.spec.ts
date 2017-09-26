import { ReverseArrayPipe } from './reverse-array.pipe';

describe('ReverseArrayPipe', () => {
  it('create an instance', () => {
    const pipe = new ReverseArrayPipe();
    expect(pipe).toBeTruthy();
  });
});
