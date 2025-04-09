import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../../api/fetchTransaction';
import {
  Select,
  Container,
  Spinner,
  ErrorMessage,
} from '../../styles/stylesComponents';

const FilterBar = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}) => {
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions()
      .then((data) => {
        const monthSet = new Set();
        const yearSet = new Set();

        data.forEach((txn) => {
          const date = new Date(txn.date);
          const monthName = date.toLocaleString('default', { month: 'long' });
          const year = date.getFullYear();
          monthSet.add(monthName);
          yearSet.add(year);
        });

        // Sort months based on calendar order
        const allMonths = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];

        const sortedMonths = allMonths.filter((m) => monthSet.has(m));
        const sortedYears = Array.from(yearSet).sort((a, b) => b - a);

        setMonths(sortedMonths);
        setYears(sortedYears);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load filters.');
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner>Loading filters...</Spinner>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      <Select
        data-testid='month-select'
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
      >
        <option value=''>All Months</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </Select>

      <Select
        data-testid='year-select'
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
      >
        <option value=''>All Years</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>
    </Container>
  );
};

export default FilterBar;
