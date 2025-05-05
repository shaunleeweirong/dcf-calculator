import React, { useState } from 'react';
import { DCFInputs, DCFResults, StockData } from '../types';
import InputForm from './InputForm';
import ResultsDisplay from './ResultsDisplay';
import StockDataCard from './StockDataCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { calculateDCF } from '../utils/dcfCalculations';

const DCFCalculator: React.FC = () => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [results, setResults] = useState<DCFResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: DCFInputs, manualStockData: StockData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate the manually entered data
      if (manualStockData.freeCashFlowTTM <= 0) {
        throw new Error('Free Cash Flow must be greater than zero');
      }
      
      if (manualStockData.currentPrice <= 0) {
        throw new Error('Stock price must be greater than zero');
      }
      
      if (manualStockData.sharesOutstanding <= 0) {
        throw new Error('Shares outstanding must be greater than zero');
      }
      
      setStockData(manualStockData);
      
      // Calculate DCF using the manually entered data
      const dcfResults = calculateDCF({
        ...inputs,
        freeCashFlowTTM: manualStockData.freeCashFlowTTM,
        sharesOutstanding: manualStockData.sharesOutstanding,
        currentPrice: manualStockData.currentPrice,
      });
      
      setResults(dcfResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      
      {/* Input Form Section */}
      <div className="lg:order-1">
        <InputForm onSubmit={handleCalculate} isLoading={isLoading} />
      </div>
      
      {/* Results and Data Section */}
      <div className="lg:order-2 space-y-6">
        {error && (
          <ErrorMessage message={error} onDismiss={handleDismissError} />
        )}
        
        {isLoading && <LoadingSpinner message="Calculating DCF..." />}
        
        {stockData && (
          <StockDataCard data={stockData} />
        )}
        
        {results && (
          <ResultsDisplay results={results} />
        )}
        
        {!isLoading && !error && !stockData && !results && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p>Enter financial data and parameters to start the calculation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DCFCalculator; 