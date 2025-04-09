import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CustomerList from '../../components/CustomerList/customerList';
import { fetchTransactions } from '../../api/fetchTransaction';

jest.mock('../../api/fetchTransaction');

const mockTransactions = [
  { customerId: '1', customerName: 'Alice', amount: 120, date: '2024-01-01' },
  { customerId: '2', customerName: 'Bob', amount: 90, date: '2024-01-02' },
  { customerId: '1', customerName: 'Alice', amount: 50, date: '2024-01-03' },
];

describe('CustomerList Component', () => {
  it('should show loading initially', () => {
    fetchTransactions.mockReturnValue(new Promise(() => {})); // pending promise
    render(<CustomerList onSelectCustomer={jest.fn()} selectedCustomer={null} />);
    expect(screen.getByText('Loading customers...')).toBeInTheDocument();
  });

  it('should show error if fetch fails', async () => {
    fetchTransactions.mockRejectedValueOnce(new Error('Failed'));
    render(<CustomerList onSelectCustomer={jest.fn()} selectedCustomer={null} />);
    const error = await screen.findByText('Error loading customers.');
    expect(error).toBeInTheDocument();
  });

  it("matches the snapshot", () => {
    fetchTransactions.mockResolvedValueOnce([]);
    const { asFragment } = render(<CustomerList onSelectCustomer={jest.fn()} selectedCustomer={null} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render unique customers from transactions', async () => {
    fetchTransactions.mockResolvedValueOnce(mockTransactions);
    render(<CustomerList onSelectCustomer={jest.fn()} selectedCustomer={null} />);
    await waitFor(() => {
      const buttons = screen.getAllByTestId('customer-button');
      expect(buttons.length).toBe(2); // Alice and Bob (unique)
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  it('should trigger onSelectCustomer when button clicked', async () => {
    const mockSelect = jest.fn();
    fetchTransactions.mockResolvedValueOnce(mockTransactions);
    render(<CustomerList onSelectCustomer={mockSelect} selectedCustomer={null} />);
    const buttons = await screen.findAllByTestId('customer-button');
    fireEvent.click(buttons[1]); // Click Bob
    expect(mockSelect).toHaveBeenCalledWith('2');
  });
});
