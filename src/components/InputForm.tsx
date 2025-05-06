import React, { useState } from 'react';
import { DCFInputs, StockData } from '../types';
import TextField from './TextField';
import Button from './Button';
import Card from './Card';

interface InputFormProps {
  onSubmit: (inputs: DCFInputs, stockData: StockData) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [useDetailedGrowth, setUseDetailedGrowth] = useState(false);
  const [inputs, setInputs] = useState<DCFInputs>({
    ticker: '',
    terminalGrowthRate: 2.5,
    discountRate: 10,
    growthRates: useDetailedGrowth ? Array(10).fill(10) : 10,
  });
  
  // Stock data state without market cap
  const [stockData, setStockData] = useState<StockData>({
    freeCashFlowTTM: 0,
    currentPrice: 0,
    sharesOutstanding: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'ticker') {
      setInputs(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else if (['freeCashFlowTTM', 'currentPrice', 'sharesOutstanding'].includes(name)) {
      // Handle stock data inputs
      setStockData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    }
  };

  const handleGrowthRateChange = (index: number, value: string) => {
    if (useDetailedGrowth) {
      const newGrowthRates = [...(inputs.growthRates as number[])];
      newGrowthRates[index] = parseFloat(value) || 0;
      setInputs(prev => ({ ...prev, growthRates: newGrowthRates }));
    } else {
      setInputs(prev => ({ ...prev, growthRates: parseFloat(value) || 0 }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs, stockData);
  };

  const toggleGrowthInputMode = () => {
    setUseDetailedGrowth(!useDetailedGrowth);
    setInputs(prev => ({
      ...prev,
      growthRates: !useDetailedGrowth ? Array(10).fill(10) : 10,
    }));
  };

  return (
    <Card title="Calculation Inputs">
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          id="ticker"
          name="ticker"
          label="Stock Ticker"
          value={inputs.ticker}
          onChange={handleInputChange}
          placeholder="e.g., AAPL"
          required
        />

        {/* Financial data inputs that would have been fetched from the API */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Stock Financial Data</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Enter financial values in millions USD (e.g., for $6.8 billion, enter 6800)
          </p>
          
          <TextField
            id="currentPrice"
            name="currentPrice"
            label="Current Stock Price ($)"
            type="number"
            value={stockData.currentPrice}
            onChange={handleInputChange}
            step="0.01"
            min={0}
            required
            helperText="Enter the current market price per share in dollars"
          />
          
          <TextField
            id="freeCashFlowTTM"
            name="freeCashFlowTTM"
            label="Free Cash Flow TTM (in millions $)"
            type="number"
            value={stockData.freeCashFlowTTM}
            onChange={handleInputChange}
            step="1"
            required
            helperText="Trailing 12 months free cash flow in millions USD"
          />
          
          <TextField
            id="sharesOutstanding"
            name="sharesOutstanding"
            label="Shares Outstanding (in millions)"
            type="number"
            value={stockData.sharesOutstanding}
            onChange={handleInputChange}
            step="1"
            min={0}
            required
            helperText="Total shares outstanding in millions"
          />
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">DCF Parameters</h3>
          
          <TextField
            id="discountRate"
            name="discountRate"
            label="Discount Rate (%)"
            type="number"
            value={inputs.discountRate}
            onChange={handleInputChange}
            step="0.1"
            min={0}
            required
            helperText="Typically between 8-12% for most companies"
          />

          <TextField
            id="terminalGrowthRate"
            name="terminalGrowthRate"
            label="Terminal Growth Rate (%)"
            type="number"
            value={inputs.terminalGrowthRate}
            onChange={handleInputChange}
            step="0.1"
            required
            helperText="Long-term growth rate, typically between 2-4%"
          />

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Growth Rates (%)
              </label>
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={toggleGrowthInputMode}
              >
                {useDetailedGrowth ? 'Use Single Rate' : 'Use Detailed Rates'}
              </Button>
            </div>

            {useDetailedGrowth ? (
              <div className="space-y-2">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <label className="w-20 text-sm text-gray-600 dark:text-gray-400">Year {i + 1}</label>
                    <TextField
                      id={`growthRate-${i}`}
                      name={`growthRate-${i}`}
                      label=""
                      type="number"
                      value={(inputs.growthRates as number[])[i]}
                      onChange={(e) => handleGrowthRateChange(i, e.target.value)}
                      step="0.1"
                      required
                      className="flex-grow"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <TextField
                id="growthRate"
                name="growthRate"
                label=""
                type="number"
                value={inputs.growthRates as number}
                onChange={(e) => handleGrowthRateChange(0, e.target.value)}
                step="0.1"
                required
                helperText="Annual growth rate for years 1-10"
              />
            )}
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Calculating...' : 'Calculate DCF'}
        </Button>
      </form>
    </Card>
  );
};

export default InputForm; 