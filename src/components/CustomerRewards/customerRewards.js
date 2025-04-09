// customerRewards.js

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchTransactions } from '../../api/fetchTransaction';
import { calculateRewards } from '../../utils/calculateRewards';
import { Container, Title, Table, Spinner, ErrorMessage } from '../../styles/stylesComponents';

const CustomerRewards = ({ customerId, selectedMonth, selectedYear }) => {
  const [monthlyRewards, setMonthlyRewards] = useState({});
  const [totalRewards, setTotalRewards] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions()
      .then((data) => {
        const filtered = data.filter((txn) => txn.customerId === customerId);
        const rewardsPerMonth = {};
        let total = 0;

        filtered.forEach((txn) => {
          const date = new Date(txn.date);
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();

          if (year !== parseInt(selectedYear)) return;

          const key = `${month}-${year}`;
          const rewards = calculateRewards(txn.amount);

          if (!rewardsPerMonth[key]) rewardsPerMonth[key] = 0;
          rewardsPerMonth[key] += rewards;
          total += rewards;
        });

        setMonthlyRewards(rewardsPerMonth);
        setTotalRewards(total);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error loading rewards.');
        setLoading(false);
      });
  }, [customerId, selectedYear]);

  if (loading) return <Spinner data-testid="loading-spinner">Loading rewards...</Spinner>;
  if (error) return <ErrorMessage data-testid="error-message">{error}</ErrorMessage>;

  return (
    <Container data-testid="customer-rewards-container">
      <Title data-testid="rewards-title">Rewards Summary for {customerId}</Title>
      <h3 data-testid="total-rewards">Total Rewards: {totalRewards}</h3>
      <Table data-testid="rewards-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Rewards</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(monthlyRewards).map(([monthKey, points]) => (
            <tr key={monthKey} data-testid={`reward-row-${monthKey}`}>
              <td data-testid={`month-${monthKey}`}>{monthKey}</td>
              <td data-testid={`points-${monthKey}`}>{points}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

CustomerRewards.propTypes = {
  customerId: PropTypes.string.isRequired,
  selectedMonth: PropTypes.string.isRequired,
  selectedYear: PropTypes.string.isRequired
};

export default CustomerRewards;
