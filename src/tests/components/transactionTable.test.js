import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TransactionTable from '../../components/TransactionTable/transactionTable';
import { fetchTransactions } from '../../api/fetchTransaction';
import { calculateRewards } from '../../utils/calculateRewards';

jest.mock('../../api/fetchTransaction');
jest.mock('../../utils/calculateRewards');

const mockTransactions = [
  {
    transactionId: 'T1',
    customerId: 'C1',
    customerName: 'John Doe',
    amount: 120,
    date: '2023-08-10',
  },
  {
    transactionId: 'T2',
    customerId: 'C1',
    customerName: 'John Doe',
    amount: 80,
    date: '2023-08-15',
  },
  {
    transactionId: 'T3',
    customerId: 'C1',
    customerName: 'John Doe',
    amount: 150,
    date: '2023-08-20',
  },
  {
    transactionId: 'T4',
    customerId: 'C1',
    customerName: 'John Doe',
    amount: 200,
    date: '2023-08-25',
  },
];

describe('TransactionTable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    calculateRewards.mockImplementation((amount) => Math.floor(amount / 10));
  });

  it('displays loading spinner initially', () => {
    fetchTransactions.mockResolvedValue([]);
    render(<TransactionTable customerId='C1' />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders transactions and calculates rewards correctly', async () => {
    fetchTransactions.mockResolvedValue(mockTransactions);
    render(<TransactionTable customerId='C1' />);

    await waitFor(() => {
      expect(screen.getByText('Transactions for John Doe')).toBeInTheDocument();
    });

    // 3 items on page 1 (pagination)
    expect(screen.getAllByRole('row')).toHaveLength(4); // including header

    // Check rewards calculated
    expect(screen.getByText('12')).toBeInTheDocument(); // 120 => 12
    expect(screen.getByText('8')).toBeInTheDocument(); // 80 => 8
    expect(screen.getByText('15')).toBeInTheDocument(); // 150 => 15

    // Pagination buttons
    expect(screen.getByTestId('prev-button')).toBeDisabled();
    expect(screen.getByTestId('next-button')).toBeEnabled();
  });

  it('handles pagination correctly', async () => {
    fetchTransactions.mockResolvedValue(mockTransactions);
    render(<TransactionTable customerId='C1' />);

    await waitFor(() => screen.getByText('Transactions for John Doe'));

    // Click next
    fireEvent.click(screen.getByTestId('next-button'));

    // Check new row on page 2
    await waitFor(() => {
      expect(screen.getByText('T4')).toBeInTheDocument();
    });

    expect(screen.getByTestId('prev-button')).toBeEnabled();
    expect(screen.getByTestId('next-button')).toBeDisabled();
  });

  it('matches the snapshot', () => {
    fetchTransactions.mockResolvedValue(mockTransactions);
    const { asFragment } = render(<TransactionTable customerId='C1' />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('filters by selected month and year', async () => {
    fetchTransactions.mockResolvedValue(mockTransactions);
    render(
      <TransactionTable
        customerId='C1'
        selectedMonth='August'
        selectedYear='2023'
      />
    );

    await waitFor(() => screen.getByText('Filtered by Month:'));
    expect(screen.getByText('Filtered by Year:')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    expect(screen.getAllByRole('row')).toHaveLength(4); // 3 txns on page 1
  });

  it('displays "no transactions" message when list is empty', async () => {
    fetchTransactions.mockResolvedValue([]);
    render(<TransactionTable customerId='C1' />);

    await waitFor(() => screen.getByText(/no transactions found/i));
  });

  it('handles fetch error', async () => {
    fetchTransactions.mockRejectedValue(new Error('API failed'));
    render(<TransactionTable customerId='C1' />);

    await waitFor(() => screen.getByText('Failed to load transactions.'));
  });
});
