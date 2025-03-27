import { generateRandomCode } from '@src/shared/helpers/shortUrl.helper';

describe('Test of create shortCode of url', () => {
  it('Test create shortCode url', () => {
    const hash = generateRandomCode(6);
    const secondHash = generateRandomCode(8);

    expect(hash).toHaveLength(6);
    expect(secondHash).toHaveLength(8);
  });
});
