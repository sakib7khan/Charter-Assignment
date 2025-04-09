import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import FilterBar from '../../components/FilterBar/filterBar';
import { fetchTransactions } from '../../api/fetchTransaction';

// Mock the fetchTransactions API
jest.mock('../../api/fetchTransaction');

const mockTransactions = [
  { customerId: '1', amount: 120, date: '2024-01-15' },
  { customerId: '1', amount: 90, date: '2025-02-20' },
  { customerId: '2', amount: 150, date: '2025-03-10' },
];

const setup = (props = {}) => {
  return render(
    <FilterBar
      selectedMonth={props.selectedMonth || ''}
      selectedYear={props.selectedYear || ''}
      onMonthChange={props.onMonthChange || jest.fn()}
      onYearChange={props.onYearChange || jest.fn()}
    />
  );
};

describe('FilterBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

 
  it('renders loading state initially', async () => {
    fetchTransactions.mockReturnValue(new Promise(() => {})); // never resolves
    setup();
    expect(screen.getByText(/Loading filters/i)).toBeInTheDocument();
  });

  it('renders error state if fetch fails', async () => {
    fetchTransactions.mockRejectedValue(new Error('Failed to fetch'));
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Failed to load filters/i)).toBeInTheDocument();
    });
  });

  it('renders month and year options after successful fetch', async () => {
    fetchTransactions.mockResolvedValue(mockTransactions);
    setup();

    await waitFor(() => {
      expect(screen.getByTestId('month-select')).toBeInTheDocument();
      expect(screen.getByTestId('year-select')).toBeInTheDocument();
    });

    const monthOptions = screen.getAllByRole('option');
    expect(monthOptions.length).toBeGreaterThan(2); // All + at least 2 options

    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('February')).toBeInTheDocument();
    expect(screen.getByText('March')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  it('calls onMonthChange when month is changed', async () => {
    const onMonthChangeMock = jest.fn();
    fetchTransactions.mockResolvedValue(mockTransactions);
    setup({ onMonthChange: onMonthChangeMock });

    await waitFor(() => screen.getByTestId('month-select'));

    fireEvent.change(screen.getByTestId('month-select'), {
      target: { value: 'January' },
    });

    expect(onMonthChangeMock).toHaveBeenCalledWith('January');
  });

  it('calls onYearChange when year is changed', async () => {
    const onYearChangeMock = jest.fn();
    fetchTransactions.mockResolvedValue(mockTransactions);
    setup({ onYearChange: onYearChangeMock });

    await waitFor(() => screen.getByTestId('year-select'));

    fireEvent.change(screen.getByTestId('year-select'), {
      target: { value: '2025' },
    });

    expect(onYearChangeMock).toHaveBeenCalledWith('2025');
  });
});
