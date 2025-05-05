import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import DCFCalculator from './components/DCFCalculator';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <div className="max-w-5xl mx-auto">
          <DCFCalculator />
        </div>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
