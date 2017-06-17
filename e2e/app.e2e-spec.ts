import { CricketerlkClientPage } from './app.po';

describe('cricketerlk-client App', () => {
  let page: CricketerlkClientPage;

  beforeEach(() => {
    page = new CricketerlkClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
