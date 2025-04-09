import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CustomerRewards from '../../components/CustomerRewards/customerRewards';
import * as fetchAPI from '../../api/fetchTransaction';
import '@testing-library/jest-dom';

// Mock data
const mockTransactions = [
  { transactionId: 'T1', customerId: 'C001', amount: 120, date: '2025-01-15' },
  { transactionId: 'T2', customerId: 'C001', amount: 80, date: '2025-01-20' },
  { transactionId: 'T3', customerId: 'C001', amount: 50, date: '2025-02-10' },
];

// Utility mock
jest.mock('../../api/fetchTransaction');

describe('CustomerRewards Component', () => {
  afterEach(() => jest.clearAllMocks());

  const customerId = 'C001';
  const selectedYear = '2025';
  const selectedMonth = 'Jan';

  it('renders loading spinner initially', async () => {
    fetchAPI.fetchTransactions.mockReturnValue(new Promise(() => {}));

    render(
      <CustomerRewards
        customerId={customerId}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error message on API failure', async () => {
    fetchAPI.fetchTransactions.mockRejectedValueOnce(new Error('Failed'));

    render(
      <CustomerRewards
        customerId={customerId}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    );
    await waitFor(() =>
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    );
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Error loading rewards.'
    );
  });

  it('renders correct total and table rows', async () => {
    fetchAPI.fetchTransactions.mockResolvedValueOnce(mockTransactions);

    render(
      <CustomerRewards
        customerId={customerId}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    );

    await waitFor(() =>
      expect(
        screen.getByTestId('customer-rewards-container')
      ).toBeInTheDocument()
    );

    // Check Title
    expect(screen.getByTestId('rewards-title')).toHaveTextContent(
      `Rewards Summary for ${customerId}`
    );

    // Check Total Rewards
    const reward1 = 90; // 120 -> 50 over 50 = 50 pts + 2*20 = 40 => 90
    const reward2 = 30; // 80 -> 50 over 50 = 30
    const reward3 = 0; // 50 -> No reward

    expect(screen.getByTestId('total-rewards')).toHaveTextContent(
      `Total Rewards: ${reward1 + reward2}`
    );

    // Table rows
    expect(screen.getByTestId('month-Jan-2025')).toBeInTheDocument();
    expect(screen.getByTestId('points-Jan-2025')).toHaveTextContent(
      reward1 + reward2
    );

    expect(screen.getByTestId('month-Feb-2025')).toBeInTheDocument();
    expect(screen.getByTestId('points-Feb-2025')).toHaveTextContent('0');
  });
  it('matches the snapshot', () => {
    fetchAPI.fetchTransactions.mockResolvedValueOnce(mockTransactions);
    const { asFragment } = render(<CustomerRewards />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('does not include transactions from other years', async () => {
    fetchAPI.fetchTransactions.mockResolvedValueOnce([
      ...mockTransactions,
      {
        transactionId: 'T4',
        customerId: 'C001',
        amount: 200,
        date: '2024-12-01',
      }, // Should be ignored
    ]);

    render(
      <CustomerRewards
        customerId={customerId}
        selectedMonth={selectedMonth}
        selectedYear='2025'
      />
    );
    await waitFor(() =>
      expect(
        screen.getByTestId('customer-rewards-container')
      ).toBeInTheDocument()
    );

    expect(screen.queryByText('Dec-2024')).not.toBeInTheDocument();
  });
});
