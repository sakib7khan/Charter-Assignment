import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../../api/fetchTransaction';
import { calculateRewards } from '../../utils/calculateRewards';
import {
  Container,
  Title,
  Table,
  Button,
  Spinner,
  ErrorMessage,
  Info,
} from '../../styles/stylesComponents';

const TransactionTable = ({ customerId, selectedMonth, selectedYear }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 3;

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchTransactions()
      .then((data) => {
        let filtered = data.filter((txn) => txn.customerId === customerId);

        if (selectedMonth) {
          filtered = filtered.filter((txn) => {
            const txnMonth = new Date(txn.date).toLocaleString('default', {
              month: 'long',
            });
            return txnMonth === selectedMonth;
          });
        }

        if (selectedYear) {
          filtered = filtered.filter(
            (txn) =>
              new Date(txn.date).getFullYear().toString() === selectedYear
          );
        }

        setTransactions(filtered);
        setPage(1);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load transactions.');
        setLoading(false);
      });
  }, [customerId, selectedMonth, selectedYear]);

  const paginatedTxns = transactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalRewards = transactions.reduce(
    (acc, txn) => acc + calculateRewards(txn.amount),
    0
  );

  const customerName = transactions[0]?.customerName || customerId;

  return (
    <Container>
      <Title>Transactions for {customerName}</Title>
      {selectedMonth && (
        <Info>
          Filtered by Month: <strong>{selectedMonth}</strong>
        </Info>
      )}
      {selectedYear && (
        <Info>
          Filtered by Year: <strong>{selectedYear}</strong>
        </Info>
      )}

      {loading && <Spinner data-testid="loading-spinner">Loading transactions...</Spinner>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!loading && !error && transactions.length === 0 && (
        <Info>No transactions found for the selected filters.</Info>
      )}

      {!loading && !error && transactions.length > 0 && (
        <>
          <Info>Total Transactions: {transactions.length}</Info>
          <Info>Total Rewards: {totalRewards}</Info>

          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount ($)</th>
                <th>Date</th>
                <th>Rewards</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTxns.map((txn) => (
                <tr key={txn.transactionId}>
                  <td>{txn.transactionId}</td>
                  <td>{txn.amount.toFixed(2)}</td>
                  <td>{txn.date}</td>
                  <td>{calculateRewards(txn.amount)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div style={{ marginTop: '1rem' }}>
            <Button
              data-testid='prev-button'
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <Button
              data-testid='next-button'
              onClick={() => setPage((p) => p + 1)}
              disabled={page * pageSize >= transactions.length}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default TransactionTable;
