// App.js

import React, { useState } from 'react';
import CustomerList from './components/CustomerList/customerList';
import CustomerRewards from './components/CustomerRewards/customerRewards';
import FilterBar from './components/FilterBar/filterBar';
import TransactionTable from './components/TransactionTable/transactionTable';
import { Container, Title } from './styles/stylesComponents';

const App = () => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');

  const handleSelectCustomer = (id, name) => {
    setSelectedCustomer(id);
    setSelectedCustomerName(name);
  };

  return (
    <Container>
      <Title>🏆 Rewards Tracker</Title>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        <div style={{ flex: '1 1 40%' }}>
          <CustomerList onSelectCustomer={handleSelectCustomer} />
        </div>
        <div style={{ flex: '1 1 40%', textAlign: 'right' }}>
          <FilterBar
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </div>
      </div>

      {selectedCustomer && (
        <>
          {/* 👇 Transactions table will come first */}
          <TransactionTable
            customerId={selectedCustomer}
            customerName={selectedCustomerName}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />

          {/* 👇 Rewards Summary comes after transactions */}
          <CustomerRewards
            customerId={selectedCustomer}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </>
      )}
    </Container>
  );
};

export default App;
