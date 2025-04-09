import styled from 'styled-components';

export const Container = styled.div`
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background: #fefefe;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
  }

  th {
    background-color: #f5f5f5;
    color: #333;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

export const Select = styled.select`
  padding: 8px 12px;
  margin-right: 10px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #888;
  }
`;

export const Button = styled.button`
  padding: 10px 16px;
  margin: 5px;
  font-size: 14px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

export const Spinner = styled.div`
  margin: 1rem 0;
  font-style: italic;
  color: #666;
  text-align: center;
`;

export const ErrorMessage = styled.div`
  color: red;
  font-weight: bold;
  margin-top: 1rem;
  text-align: center;
`;

export const Info = styled.div`
  margin: 10px 0;
  font-size: 16px;
  color: #444;
  text-align: center;
`;
