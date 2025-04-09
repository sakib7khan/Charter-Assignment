import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';

test('App component snapshot', () => {
  const { container } = render(<App />);
  expect(container).toMatchSnapshot();
});
