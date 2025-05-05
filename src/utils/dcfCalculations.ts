import { DCFInputs, DCFResults } from '../types';

interface ExtendedDCFInputs extends DCFInputs {
  freeCashFlowTTM: number;
  sharesOutstanding: number;
  currentPrice: number;
}

export const calculateDCF = (inputs: ExtendedDCFInputs): DCFResults => {
  const {
    freeCashFlowTTM,
    discountRate,
    terminalGrowthRate,
    growthRates,
    sharesOutstanding,
    currentPrice,
  } = inputs;

  // Convert rates to decimals
  const r = discountRate / 100;
  const g = terminalGrowthRate / 100;
  const growthRate = Array.isArray(growthRates) 
    ? growthRates.map(rate => rate / 100)
    : growthRates / 100;
  
  // Initialize arrays for calculations
  const projectedCashFlows: number[] = [];
  const discountedCashFlows: number[] = [];
  
  // Calculate projected cash flows for years 1-10
  let currentFCF = freeCashFlowTTM;
  
  for (let year = 1; year <= 10; year++) {
    // If we have detailed growth rates, use the specific year's rate
    // Otherwise use the single growth rate
    const yearGrowthRate = Array.isArray(growthRate) 
      ? growthRate[year - 1]
      : growthRate;
    
    // Calculate the projected FCF for this year
    const projectedFCF = currentFCF * (1 + yearGrowthRate);
    projectedCashFlows.push(projectedFCF);
    
    // Calculate the discount factor and discounted FCF
    const discountFactor = Math.pow(1 + r, year);
    const discountedFCF = projectedFCF / discountFactor;
    discountedCashFlows.push(discountedFCF);
    
    // Update the current FCF for the next iteration
    currentFCF = projectedFCF;
  }
  
  // Calculate terminal value using the Gordon Growth Model
  // Formula: TV = FCF_n+1 / (r - g) = FCF_n * (1 + g) / (r - g)
  const lastYearFCF = projectedCashFlows[9]; // Year 10's FCF
  const terminalValue = (lastYearFCF * (1 + g)) / (r - g);
  
  // Discount the terminal value back to present value
  const discountedTerminalValue = terminalValue / Math.pow(1 + r, 10);
  
  // Calculate the sum of the present value of projected cash flows (years 1-10)
  const presentValueOfFCF = discountedCashFlows.reduce((sum, dcf) => sum + dcf, 0);
  
  // Calculate total present value (PV of FCF + PV of terminal value)
  const totalPresentValue = presentValueOfFCF + discountedTerminalValue;
  
  // Calculate intrinsic value per share
  const intrinsicValue = totalPresentValue / sharesOutstanding;
  
  // Calculate percentage difference to determine if the stock is undervalued or overvalued
  const percentageDifference = ((intrinsicValue - currentPrice) / currentPrice) * 100;
  
  return {
    intrinsicValue,
    currentPrice,
    percentageDifference,
    verdict: percentageDifference > 0 ? 'Undervalued' : 'Overvalued',
    // Add detailed calculation breakdown to match the screenshot
    calculationDetails: {
      yearlyData: Array.from({ length: 10 }, (_, i) => ({
        year: i + 1,
        fcf: projectedCashFlows[i],
        growthRate: Array.isArray(growthRate) ? growthRate[i] * 100 : growthRate * 100,
        discountedValue: discountedCashFlows[i],
      })),
      terminalYear: {
        fcf: lastYearFCF * (1 + g),
        terminalValue: terminalValue,
        discountedTerminalValue: discountedTerminalValue,
      },
      presentValueOfFCF,
      totalPresentValue,
      sharesOutstanding,
    }
  };
}; 