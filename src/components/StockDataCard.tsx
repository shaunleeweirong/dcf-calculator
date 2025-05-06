import React from 'react';
import { StockData } from '../types';
import Card from './Card';

interface StockDataCardProps {
  data: StockData;
  className?: string;
}

const StockDataCard: React.FC<StockDataCardProps> = ({ data, className = '' }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
      notation: value > 1000000 ? 'compact' : 'standard',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      notation: value > 1000000 ? 'compact' : 'standard',
    }).format(value);
  };

  return (
    <Card title="Stock Data" className={className}>
      <div className="space-y-3">
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Free Cash Flow (TTM)
          </span>
          <span className="font-medium">
            {formatCurrency(data.freeCashFlowTTM)}
          </span>
        </div>
        
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Current Price
          </span>
          <span className="font-medium">
            {formatCurrency(data.currentPrice)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Shares Outstanding
          </span>
          <span className="font-medium">
            {formatNumber(data.sharesOutstanding)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default StockDataCard; 