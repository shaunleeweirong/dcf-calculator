# DCF Calculator

A web-based Discounted Cash Flow (DCF) calculator for retail investors to evaluate stock valuations quickly and intuitively.

## Features

- Automated financial data fetching (Free Cash Flow, Share Price, Market Cap)
- Simple or detailed growth rate inputs
- Real-time DCF calculations
- Visual results with charts
- Dark/Light theme support
- Mobile-responsive design

## Prerequisites

- Node.js (v14 or higher)
- Financial Modeling Prep API key (get one at [financialmodelingprep.com](https://financialmodelingprep.com/developer/docs/))

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dcf-calculator.git
   cd dcf-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your FMP API key:
   ```
   VITE_FMP_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Enter a stock ticker (e.g., AAPL)
2. Set your discount rate (typically 8-12%)
3. Set terminal growth rate (typically 2-4%)
4. Choose between single growth rate or detailed year-by-year projections
5. Click "Calculate DCF" to see results

## Technical Stack

- React with TypeScript
- Tailwind CSS for styling
- Chart.js for data visualization
- Axios for API calls
- Financial Modeling Prep API for stock data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
