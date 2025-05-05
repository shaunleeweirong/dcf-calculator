export interface StockData {
  freeCashFlowTTM: number;
  currentPrice: number;
  sharesOutstanding: number;
  marketCap: number;
}

export interface DCFInputs {
  ticker: string;
  terminalGrowthRate: number;
  discountRate: number;
  growthRates: number[] | number;
}

export interface YearlyData {
  year: number;
  fcf: number;
  growthRate: number;
  discountedValue: number;
}

export interface TerminalYearData {
  fcf: number;
  terminalValue: number;
  discountedTerminalValue: number;
}

export interface DCFCalculationDetails {
  yearlyData: YearlyData[];
  terminalYear: TerminalYearData;
  presentValueOfFCF: number;
  totalPresentValue: number;
  sharesOutstanding: number;
}

export interface DCFResults {
  intrinsicValue: number;
  currentPrice: number;
  percentageDifference: number;
  verdict: 'Undervalued' | 'Overvalued';
  calculationDetails: DCFCalculationDetails;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
} 