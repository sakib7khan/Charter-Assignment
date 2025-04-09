export const calculateRewards = (amount) => {
  let rewards = 0;

  if (amount > 100) {
    rewards += (amount - 100) * 2;
    rewards += 50; // for the $50–$100 range
  } else if (amount > 50) {
    rewards += (amount - 50) * 1;
  }

  return Math.floor(rewards);
};
