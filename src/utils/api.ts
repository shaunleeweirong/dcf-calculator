import axios from 'axios';
import { StockData } from '../types';

const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Simple in-memory cache with timestamp
interface CachedStockData {
  data: StockData;
  timestamp: number;
}
const stockDataCache = new Map<string, CachedStockData>();
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// Define interfaces for the FMP API responses for better type safety
interface CashFlowStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  fillingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  netIncome: number;
  depreciationAndAmortization: number;
  deferredIncomeTax: number;
  stockBasedCompensation: number;
  changeInWorkingCapital: number;
  accountsReceivables: number;
  inventory: number;
  accountsPayables: number;
  otherWorkingCapital: number;
  otherNonCashItems: number;
  netCashProvidedByOperatingActivities: number;
  investmentsInPropertyPlantAndEquipment: number;
  acquisitionsNet: number;
  purchasesOfInvestments: number;
  salesMaturitiesOfInvestments: number;
  otherInvestingActivities: number;
  netCashUsedForInvestingActivities: number;
  debtRepayment: number;
  commonStockIssued: number;
  commonStockRepurchased: number;
  dividendsPaid: number;
  otherFinancingActivities: number;
  netCashUsedProvidedByFinancingActivities: number;
  effectOfForexChangesOnCash: number;
  netChangeInCash: number;
  cashAtEndOfPeriod: number;
  cashAtBeginningOfPeriod: number;
  operatingCashFlow: number;
  capitalExpenditure: number;
  freeCashFlow: number;
  link: string;
  finalLink: string;
}

interface Quote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  volume: number;
  avgVolume: number;
  exchange: string;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  earningsAnnouncement: string;
  sharesOutstanding: number;
  timestamp: number;
}

export const fetchStockData = async (ticker: string): Promise<StockData> => {
  if (!FMP_API_KEY) {
    throw new Error('Financial Modeling Prep API key is missing. Please set VITE_FMP_API_KEY in your .env file.');
  }

  if (!ticker) {
    throw new Error('Stock ticker cannot be empty.');
  }

  const upperCaseTicker = ticker.toUpperCase();
  const cacheKey = upperCaseTicker;

  // Check cache first
  const cachedItem = stockDataCache.get(cacheKey);
  if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION_MS) {
    console.log(`Cache hit for ${cacheKey}`);
    return cachedItem.data;
  }

  console.log(`Cache miss for ${cacheKey}. Fetching from API...`);
  try {
    // Fetch FCF TTM
    const fcfResponse = await axios.get<CashFlowStatement[]>(
      `${BASE_URL}/cash-flow-statement/${upperCaseTicker}?period=quarter&limit=4&apikey=${FMP_API_KEY}`
    );
    
    if (fcfResponse.data.length === 0) {
      throw new Error(`No cash flow data found for ticker: ${upperCaseTicker}`);
    }

    // Calculate TTM FCF from the last 4 quarters
    const fcfTTM = fcfResponse.data
      .slice(0, 4)
      .reduce((sum, quarter) => sum + (quarter.freeCashFlow || 0), 0);

    // Fetch current price and shares outstanding
    const quoteResponse = await axios.get<Quote[]>(
      `${BASE_URL}/quote/${upperCaseTicker}?apikey=${FMP_API_KEY}`
    );

    if (quoteResponse.data.length === 0) {
      throw new Error(`No quote data found for ticker: ${upperCaseTicker}`);
    }
    
    const { price: currentPrice, sharesOutstanding, marketCap } = quoteResponse.data[0];

    if (typeof currentPrice !== 'number' || typeof sharesOutstanding !== 'number' || typeof marketCap !== 'number') {
      throw new Error(`Invalid quote data structure received for ticker: ${upperCaseTicker}`);
    }

    const fetchedData: StockData = {
      freeCashFlowTTM: fcfTTM,
      currentPrice,
      sharesOutstanding,
      marketCap,
    };

    // Store in cache
    stockDataCache.set(cacheKey, { data: fetchedData, timestamp: Date.now() });

    return fetchedData;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Invalid API key or insufficient permissions. Please check your Financial Modeling Prep API key.');
      } else if (error.response?.status === 404) {
        // FMP API sometimes returns 404 even for valid tickers if data isn't available
        // Check specific conditions if possible, otherwise assume ticker might be invalid
         throw new Error(`Stock ticker not found or data unavailable: ${upperCaseTicker}. Please check the ticker symbol.`);
      }
    }
    // Re-throw generic error if it's not an Axios error or a specific handled status
    throw new Error('Failed to fetch stock data. An unexpected error occurred.');
  }
}; 