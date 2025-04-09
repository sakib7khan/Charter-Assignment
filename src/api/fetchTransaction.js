export const fetchTransactions = async () => {
  const res = await fetch('http://localhost:3005/transactions');
  if (!res.ok) throw new Error('API fetch failed');
  return await res.json();
};
