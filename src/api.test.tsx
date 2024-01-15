import nock from 'nock';
import { generateTileSet, getTheme } from './api';
import { mockTheme, mockTileSetData } from './testHelpers';
import { Theme } from './types/Theme';

describe('generateTileSet', () => {
  it('gets generated tile set', async () => {
    const expectedResponse = mockTileSetData([[['a', 'b'], []]]);
    nock('http://127.0.0.1:8000')
      .get('/theme/test/generate?rowSize=5&columnSize=6')
      .reply(200, expectedResponse);
    const actualResponse = await generateTileSet('test');
    expect(actualResponse).toEqual(expectedResponse);
  });

  it('returns undefined if not 200', async () => {
    nock('http://127.0.0.1:8000')
      .get('/theme/test/generate?rowSize=5&columnSize=6')
      .reply(422);
    const actualResponse = await generateTileSet('test');
    expect(actualResponse).toBeUndefined();
  });
});

describe('getTheme', () => {
  it('gets generated tile set', async () => {
    const expectedResponse: Theme = mockTheme;
    nock('http://127.0.0.1:8000')
      .get('/theme/test')
      .reply(200, expectedResponse);
    const actualResponse = await getTheme('test');
    expect(actualResponse).toEqual(expectedResponse);
  });

  it('returns undefined if not 200', async () => {
    nock('http://127.0.0.1:8000').get('/theme/test').reply(422);
    const actualResponse = await getTheme('test');
    expect(actualResponse).toBeUndefined();
  });
});
