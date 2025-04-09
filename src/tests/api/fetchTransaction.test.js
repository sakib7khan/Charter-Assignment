// src/api/fetchTransactions.test.js

import { fetchTransactions } from '../../api/fetchTransaction';

describe('fetchTransactions', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should fetch transaction data successfully', async () => {
    const mockData = [
      {
        transactionId: 'T001',
        customerId: 'C001',
        amount: 120,
        date: '2025-01-15',
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchTransactions();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3005/transactions');
    expect(result).toEqual(mockData);
  });

  test('should throw error when API response is not OK', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    await expect(fetchTransactions()).rejects.toThrow('API fetch failed');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('should throw error when fetch itself fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchTransactions()).rejects.toThrow('Network error');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
