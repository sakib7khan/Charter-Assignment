import { calculateRewards } from '../../utils/calculateRewards';
import { render } from '@testing-library/react';

describe('calculateRewards', () => {
  it('returns 0 rewards for amounts <= 50', () => {
    expect(calculateRewards(0)).toBe(0);
    expect(calculateRewards(30)).toBe(0);
    expect(calculateRewards(50)).toBe(0);
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(<calculateRewards />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('returns correct rewards for amounts > 50 and <= 100', () => {
    expect(calculateRewards(60)).toBe(10); // (60 - 50) * 1 = 10
    expect(calculateRewards(75)).toBe(25); // (75 - 50) * 1 = 25
    expect(calculateRewards(100)).toBe(50); // (100 - 50) * 1 = 50
  });

  it('returns correct rewards for amounts > 100', () => {
    expect(calculateRewards(120)).toBe(90); // (120 - 100) * 2 + 50 = 40 + 50
    expect(calculateRewards(200)).toBe(250); // (200 - 100) * 2 + 50 = 200 + 50
    expect(calculateRewards(101)).toBe(52); // (1 * 2) + 50 = 52
  });

  it('returns floor of calculated rewards', () => {
    expect(calculateRewards(120.75)).toBe(Math.floor((120.75 - 100) * 2 + 50));
    expect(calculateRewards(99.99)).toBe(Math.floor((99.99 - 50) * 1));
  });
});
