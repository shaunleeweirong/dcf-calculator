import React from 'react';
import { DCFResults } from '../types';
import { Line } from 'react-chartjs-2';
import Card from './Card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ResultsDisplayProps {
  results: DCFResults;
  className?: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, className = '' }) => {
  const { 
    intrinsicValue, 
    currentPrice, 
    percentageDifference, 
    verdict,
    calculationDetails
  } = results;

  const { yearlyData, terminalYear, presentValueOfFCF, totalPresentValue, sharesOutstanding } = calculationDetails;

  const chartData = {
    labels: ['Current Price', 'Intrinsic Value'],
    datasets: [
      {
        label: 'Stock Value Comparison',
        data: [currentPrice, intrinsicValue],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions: import('chart.js').ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Price Comparison',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
    // Add accessibility features
    // This is basic, Chart.js has limited built-in accessibility features
    // Consider generating a text summary or table alternative
    // Example: Using aria-label on the canvas element
    // canvasElement.setAttribute('aria-label', 'Line chart comparing Current Price and Intrinsic Value');
  };

  // Format numbers with commas and fixed decimal places
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };

  return (
    <div className="space-y-8">
      {/* Main value comparison card */}
      <Card title="Valuation Results" className={className}>
        <div className="grid gap-4 md:grid-cols-2 mb-6" role="group" aria-label="Valuation Metrics">
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300" id="current-price-label">
              Current Share Price
            </p>
            <p className="text-2xl font-bold" aria-labelledby="current-price-label">
              {formatCurrency(currentPrice)}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300" id="intrinsic-value-label">
              Estimated Intrinsic Value
            </p>
            <p className="text-2xl font-bold" aria-labelledby="intrinsic-value-label">
              {formatCurrency(intrinsicValue)}
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <div 
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              verdict === 'Undervalued'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            }`}
            role="status"
            aria-live="polite"
          >
            <span className="font-bold mr-1">Implied Growth Rate:</span> {formatPercentage(yearlyData[0].growthRate)}
            <span className="mx-2">|</span>
            {verdict}
            <span className="ml-2" aria-label={`Percentage difference: ${percentageDifference > 0 ? 'plus' : 'minus'} ${Math.abs(percentageDifference).toFixed(2)} percent`}>
              ({percentageDifference > 0 ? '+' : ''}{percentageDifference.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        <div className="h-64 relative">
          <Line data={chartData} options={chartOptions} aria-label="Line chart comparing Current Price and Intrinsic Value" />
        </div>
      </Card>

      {/* Cash flow breakdown card */}
      <Card title="Free Cash Flow Data" className={className}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Year</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Free Cash Flow</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Assumed Growth</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Discounted Value</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {yearlyData.map((year) => (
                <tr key={year.year}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{year.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{formatLargeNumber(year.fcf)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{formatPercentage(year.growthRate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{formatLargeNumber(year.discountedValue)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">Terminal Year</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">{formatLargeNumber(terminalYear.fcf)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">{formatLargeNumber(terminalYear.discountedTerminalValue)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
            <h4 className="text-lg font-semibold mb-2">Present Value Summary</h4>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Present Value of Year 1-10 Cash Flows:</span>
                <span className="font-medium">{formatLargeNumber(presentValueOfFCF)}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Discounted Terminal Value:</span>
                <span className="font-medium">{formatLargeNumber(terminalYear.discountedTerminalValue)}</span>
              </li>
              <li className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="text-gray-600 dark:text-gray-400">Total Present Value of Cash Flows:</span>
                <span className="font-bold">{formatLargeNumber(totalPresentValue)}</span>
              </li>
            </ul>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
            <h4 className="text-lg font-semibold mb-2">Per Share Value</h4>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Number of Shares (Millions):</span>
                <span className="font-medium">{sharesOutstanding.toLocaleString()}</span>
              </li>
              <li className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="text-gray-600 dark:text-gray-400">Estimated Intrinsic Value:</span>
                <span className="font-bold text-xl">{formatCurrency(intrinsicValue)}</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultsDisplay; 