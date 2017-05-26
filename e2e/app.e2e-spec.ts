import { SSPage } from './app.po';

describe('ss App', () => {
  let page: SSPage;

  beforeEach(() => {
    page = new SSPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
