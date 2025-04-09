import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../../api/fetchTransaction';
import { Container, Title, Button, Spinner, ErrorMessage } from '../../styles/stylesComponents';

const CustomerList = ({ onSelectCustomer, selectedCustomer }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions()
      .then((data) => {
        const uniqueCustomers = Array.from(
          new Map(data.map((txn) => [txn.customerId, { id: txn.customerId, name: txn.customerName }])).values()
        );
        setCustomers(uniqueCustomers);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error loading customers.');
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner>Loading customers...</Spinner>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container data-testid="customer-list">
      <Title>Select Customer</Title>
      {customers.map((customer) => (
        <Button
          key={customer.id}
          onClick={() => onSelectCustomer(customer.id)}
          active={selectedCustomer === customer.id}
          data-testid= "customer-button"
        >
          {customer.name}
        </Button>
      ))}
    </Container>
  );
};

export default CustomerList;
