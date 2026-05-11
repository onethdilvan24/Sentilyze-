export type MarketType = "Stock" | "Crypto" | "Forex";

export interface MarketSymbol {
  symbol: string;
  name: string;
  type: MarketType;
  aliases?: string[];
}

const MARKET_SYMBOLS: MarketSymbol[] = [
  // === STOCKS (~150) ===
  // Tech Giants
  { symbol: "AAPL", name: "Apple Inc.", type: "Stock" },
  { symbol: "MSFT", name: "Microsoft Corporation", type: "Stock" },
  { symbol: "GOOGL", name: "Alphabet Inc. (Google)", type: "Stock", aliases: ["GOOG"] },
  { symbol: "AMZN", name: "Amazon.com Inc.", type: "Stock" },
  { symbol: "META", name: "Meta Platforms Inc. (Facebook)", type: "Stock", aliases: ["FB"] },
  { symbol: "NVDA", name: "NVIDIA Corporation", type: "Stock" },
  { symbol: "TSLA", name: "Tesla Inc.", type: "Stock" },
  { symbol: "AMD", name: "Advanced Micro Devices", type: "Stock" },
  { symbol: "INTC", name: "Intel Corporation", type: "Stock" },
  { symbol: "CRM", name: "Salesforce Inc.", type: "Stock" },
  { symbol: "ORCL", name: "Oracle Corporation", type: "Stock" },
  { symbol: "ADBE", name: "Adobe Inc.", type: "Stock" },
  { symbol: "CSCO", name: "Cisco Systems Inc.", type: "Stock" },
  { symbol: "IBM", name: "International Business Machines", type: "Stock" },
  { symbol: "QCOM", name: "Qualcomm Inc.", type: "Stock" },
  { symbol: "TXN", name: "Texas Instruments", type: "Stock" },
  { symbol: "AVGO", name: "Broadcom Inc.", type: "Stock" },
  { symbol: "NOW", name: "ServiceNow Inc.", type: "Stock" },
  { symbol: "UBER", name: "Uber Technologies", type: "Stock" },
  { symbol: "LYFT", name: "Lyft Inc.", type: "Stock" },
  { symbol: "SHOP", name: "Shopify Inc.", type: "Stock" },
  { symbol: "SQ", name: "Block Inc. (Square)", type: "Stock" },
  { symbol: "PYPL", name: "PayPal Holdings", type: "Stock" },
  { symbol: "SNAP", name: "Snap Inc.", type: "Stock" },
  { symbol: "PINS", name: "Pinterest Inc.", type: "Stock" },
  { symbol: "TWLO", name: "Twilio Inc.", type: "Stock" },
  { symbol: "ZM", name: "Zoom Video Communications", type: "Stock" },
  { symbol: "DOCU", name: "DocuSign Inc.", type: "Stock" },
  { symbol: "PLTR", name: "Palantir Technologies", type: "Stock" },
  { symbol: "SNOW", name: "Snowflake Inc.", type: "Stock" },
  { symbol: "NET", name: "Cloudflare Inc.", type: "Stock" },
  { symbol: "CRWD", name: "CrowdStrike Holdings", type: "Stock" },
  { symbol: "DDOG", name: "Datadog Inc.", type: "Stock" },
  { symbol: "MDB", name: "MongoDB Inc.", type: "Stock" },
  { symbol: "OKTA", name: "Okta Inc.", type: "Stock" },
  { symbol: "ZS", name: "Zscaler Inc.", type: "Stock" },
  { symbol: "PANW", name: "Palo Alto Networks", type: "Stock" },

  // Entertainment & Media
  { symbol: "NFLX", name: "Netflix Inc.", type: "Stock" },
  { symbol: "DIS", name: "The Walt Disney Company", type: "Stock" },
  { symbol: "CMCSA", name: "Comcast Corporation", type: "Stock" },
  { symbol: "WBD", name: "Warner Bros. Discovery", type: "Stock" },
  { symbol: "PARA", name: "Paramount Global", type: "Stock" },
  { symbol: "SPOT", name: "Spotify Technology", type: "Stock" },
  { symbol: "ROKU", name: "Roku Inc.", type: "Stock" },
  { symbol: "EA", name: "Electronic Arts", type: "Stock" },
  { symbol: "ATVI", name: "Activision Blizzard", type: "Stock" },
  { symbol: "TTWO", name: "Take-Two Interactive", type: "Stock" },
  { symbol: "RBLX", name: "Roblox Corporation", type: "Stock" },

  // Finance
  { symbol: "JPM", name: "JPMorgan Chase & Co.", type: "Stock" },
  { symbol: "BAC", name: "Bank of America", type: "Stock" },
  { symbol: "WFC", name: "Wells Fargo & Company", type: "Stock" },
  { symbol: "C", name: "Citigroup Inc.", type: "Stock" },
  { symbol: "GS", name: "Goldman Sachs", type: "Stock" },
  { symbol: "MS", name: "Morgan Stanley", type: "Stock" },
  { symbol: "V", name: "Visa Inc.", type: "Stock" },
  { symbol: "MA", name: "Mastercard Inc.", type: "Stock" },
  { symbol: "AXP", name: "American Express", type: "Stock" },
  { symbol: "BLK", name: "BlackRock Inc.", type: "Stock" },
  { symbol: "SCHW", name: "Charles Schwab", type: "Stock" },
  { symbol: "USB", name: "U.S. Bancorp", type: "Stock" },
  { symbol: "PNC", name: "PNC Financial Services", type: "Stock" },
  { symbol: "TFC", name: "Truist Financial", type: "Stock" },
  { symbol: "COF", name: "Capital One Financial", type: "Stock" },

  // Healthcare & Pharma
  { symbol: "JNJ", name: "Johnson & Johnson", type: "Stock" },
  { symbol: "UNH", name: "UnitedHealth Group", type: "Stock" },
  { symbol: "PFE", name: "Pfizer Inc.", type: "Stock" },
  { symbol: "ABBV", name: "AbbVie Inc.", type: "Stock" },
  { symbol: "MRK", name: "Merck & Co.", type: "Stock" },
  { symbol: "LLY", name: "Eli Lilly and Company", type: "Stock" },
  { symbol: "TMO", name: "Thermo Fisher Scientific", type: "Stock" },
  { symbol: "ABT", name: "Abbott Laboratories", type: "Stock" },
  { symbol: "DHR", name: "Danaher Corporation", type: "Stock" },
  { symbol: "BMY", name: "Bristol-Myers Squibb", type: "Stock" },
  { symbol: "AMGN", name: "Amgen Inc.", type: "Stock" },
  { symbol: "GILD", name: "Gilead Sciences", type: "Stock" },
  { symbol: "MRNA", name: "Moderna Inc.", type: "Stock" },
  { symbol: "REGN", name: "Regeneron Pharmaceuticals", type: "Stock" },
  { symbol: "VRTX", name: "Vertex Pharmaceuticals", type: "Stock" },
  { symbol: "BIIB", name: "Biogen Inc.", type: "Stock" },
  { symbol: "ISRG", name: "Intuitive Surgical", type: "Stock" },
  { symbol: "CVS", name: "CVS Health Corporation", type: "Stock" },
  { symbol: "CI", name: "Cigna Group", type: "Stock" },
  { symbol: "HUM", name: "Humana Inc.", type: "Stock" },

  // Consumer & Retail
  { symbol: "WMT", name: "Walmart Inc.", type: "Stock" },
  { symbol: "COST", name: "Costco Wholesale", type: "Stock" },
  { symbol: "TGT", name: "Target Corporation", type: "Stock" },
  { symbol: "HD", name: "The Home Depot", type: "Stock" },
  { symbol: "LOW", name: "Lowe's Companies", type: "Stock" },
  { symbol: "NKE", name: "Nike Inc.", type: "Stock" },
  { symbol: "SBUX", name: "Starbucks Corporation", type: "Stock" },
  { symbol: "MCD", name: "McDonald's Corporation", type: "Stock" },
  { symbol: "KO", name: "Coca-Cola Company", type: "Stock" },
  { symbol: "PEP", name: "PepsiCo Inc.", type: "Stock" },
  { symbol: "PG", name: "Procter & Gamble", type: "Stock" },
  { symbol: "CL", name: "Colgate-Palmolive", type: "Stock" },
  { symbol: "KMB", name: "Kimberly-Clark", type: "Stock" },
  { symbol: "EL", name: "Estée Lauder Companies", type: "Stock" },
  { symbol: "LULU", name: "Lululemon Athletica", type: "Stock" },
  { symbol: "TJX", name: "TJX Companies", type: "Stock" },
  { symbol: "ROST", name: "Ross Stores", type: "Stock" },
  { symbol: "DG", name: "Dollar General", type: "Stock" },
  { symbol: "DLTR", name: "Dollar Tree", type: "Stock" },
  { symbol: "YUM", name: "Yum! Brands", type: "Stock" },
  { symbol: "CMG", name: "Chipotle Mexican Grill", type: "Stock" },
  { symbol: "DPZ", name: "Domino's Pizza", type: "Stock" },

  // Industrial & Manufacturing
  { symbol: "BA", name: "Boeing Company", type: "Stock" },
  { symbol: "CAT", name: "Caterpillar Inc.", type: "Stock" },
  { symbol: "DE", name: "Deere & Company", type: "Stock" },
  { symbol: "MMM", name: "3M Company", type: "Stock" },
  { symbol: "HON", name: "Honeywell International", type: "Stock" },
  { symbol: "GE", name: "General Electric", type: "Stock" },
  { symbol: "LMT", name: "Lockheed Martin", type: "Stock" },
  { symbol: "RTX", name: "RTX Corporation (Raytheon)", type: "Stock" },
  { symbol: "NOC", name: "Northrop Grumman", type: "Stock" },
  { symbol: "GD", name: "General Dynamics", type: "Stock" },
  { symbol: "UPS", name: "United Parcel Service", type: "Stock" },
  { symbol: "FDX", name: "FedEx Corporation", type: "Stock" },

  // Energy
  { symbol: "XOM", name: "Exxon Mobil Corporation", type: "Stock" },
  { symbol: "CVX", name: "Chevron Corporation", type: "Stock" },
  { symbol: "COP", name: "ConocoPhillips", type: "Stock" },
  { symbol: "SLB", name: "Schlumberger Limited", type: "Stock" },
  { symbol: "OXY", name: "Occidental Petroleum", type: "Stock" },
  { symbol: "EOG", name: "EOG Resources", type: "Stock" },
  { symbol: "PXD", name: "Pioneer Natural Resources", type: "Stock" },
  { symbol: "VLO", name: "Valero Energy", type: "Stock" },
  { symbol: "MPC", name: "Marathon Petroleum", type: "Stock" },
  { symbol: "PSX", name: "Phillips 66", type: "Stock" },

  // Automotive
  { symbol: "GM", name: "General Motors", type: "Stock" },
  { symbol: "F", name: "Ford Motor Company", type: "Stock" },
  { symbol: "RIVN", name: "Rivian Automotive", type: "Stock" },
  { symbol: "LCID", name: "Lucid Group", type: "Stock" },
  { symbol: "NIO", name: "NIO Inc.", type: "Stock" },
  { symbol: "TM", name: "Toyota Motor Corporation", type: "Stock" },

  // Telecom
  { symbol: "T", name: "AT&T Inc.", type: "Stock" },
  { symbol: "VZ", name: "Verizon Communications", type: "Stock" },
  { symbol: "TMUS", name: "T-Mobile US", type: "Stock" },

  // Real Estate & REITs
  { symbol: "AMT", name: "American Tower Corporation", type: "Stock" },
  { symbol: "PLD", name: "Prologis Inc.", type: "Stock" },
  { symbol: "CCI", name: "Crown Castle International", type: "Stock" },
  { symbol: "EQIX", name: "Equinix Inc.", type: "Stock" },
  { symbol: "SPG", name: "Simon Property Group", type: "Stock" },
  { symbol: "O", name: "Realty Income Corporation", type: "Stock" },

  // Airlines & Travel
  { symbol: "DAL", name: "Delta Air Lines", type: "Stock" },
  { symbol: "UAL", name: "United Airlines Holdings", type: "Stock" },
  { symbol: "AAL", name: "American Airlines Group", type: "Stock" },
  { symbol: "LUV", name: "Southwest Airlines", type: "Stock" },
  { symbol: "ABNB", name: "Airbnb Inc.", type: "Stock" },
  { symbol: "BKNG", name: "Booking Holdings", type: "Stock" },
  { symbol: "EXPE", name: "Expedia Group", type: "Stock" },
  { symbol: "MAR", name: "Marriott International", type: "Stock" },
  { symbol: "HLT", name: "Hilton Worldwide", type: "Stock" },

  // === CRYPTO (~40) ===
  { symbol: "BTC", name: "Bitcoin", type: "Crypto", aliases: ["XBT"] },
  { symbol: "ETH", name: "Ethereum", type: "Crypto" },
  { symbol: "BNB", name: "Binance Coin", type: "Crypto" },
  { symbol: "XRP", name: "Ripple", type: "Crypto" },
  { symbol: "ADA", name: "Cardano", type: "Crypto" },
  { symbol: "SOL", name: "Solana", type: "Crypto" },
  { symbol: "DOGE", name: "Dogecoin", type: "Crypto" },
  { symbol: "DOT", name: "Polkadot", type: "Crypto" },
  { symbol: "MATIC", name: "Polygon", type: "Crypto" },
  { symbol: "SHIB", name: "Shiba Inu", type: "Crypto" },
  { symbol: "TRX", name: "TRON", type: "Crypto" },
  { symbol: "AVAX", name: "Avalanche", type: "Crypto" },
  { symbol: "LINK", name: "Chainlink", type: "Crypto" },
  { symbol: "UNI", name: "Uniswap", type: "Crypto" },
  { symbol: "ATOM", name: "Cosmos", type: "Crypto" },
  { symbol: "LTC", name: "Litecoin", type: "Crypto" },
  { symbol: "ETC", name: "Ethereum Classic", type: "Crypto" },
  { symbol: "XLM", name: "Stellar Lumens", type: "Crypto" },
  { symbol: "BCH", name: "Bitcoin Cash", type: "Crypto" },
  { symbol: "ALGO", name: "Algorand", type: "Crypto" },
  { symbol: "VET", name: "VeChain", type: "Crypto" },
  { symbol: "FIL", name: "Filecoin", type: "Crypto" },
  { symbol: "ICP", name: "Internet Computer", type: "Crypto" },
  { symbol: "NEAR", name: "NEAR Protocol", type: "Crypto" },
  { symbol: "APT", name: "Aptos", type: "Crypto" },
  { symbol: "ARB", name: "Arbitrum", type: "Crypto" },
  { symbol: "OP", name: "Optimism", type: "Crypto" },
  { symbol: "AAVE", name: "Aave", type: "Crypto" },
  { symbol: "MKR", name: "Maker", type: "Crypto" },
  { symbol: "CRO", name: "Cronos", type: "Crypto" },
  { symbol: "QNT", name: "Quant", type: "Crypto" },
  { symbol: "GRT", name: "The Graph", type: "Crypto" },
  { symbol: "FTM", name: "Fantom", type: "Crypto" },
  { symbol: "SAND", name: "The Sandbox", type: "Crypto" },
  { symbol: "MANA", name: "Decentraland", type: "Crypto" },
  { symbol: "AXS", name: "Axie Infinity", type: "Crypto" },
  { symbol: "APE", name: "ApeCoin", type: "Crypto" },
  { symbol: "CRV", name: "Curve DAO Token", type: "Crypto" },
  { symbol: "LDO", name: "Lido DAO", type: "Crypto" },
  { symbol: "PEPE", name: "Pepe", type: "Crypto" },

  // === FOREX (~25) ===
  // Major Pairs
  { symbol: "EUR/USD", name: "Euro / US Dollar", type: "Forex", aliases: ["EURUSD"] },
  { symbol: "GBP/USD", name: "British Pound / US Dollar", type: "Forex", aliases: ["GBPUSD"] },
  { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", type: "Forex", aliases: ["USDJPY"] },
  { symbol: "USD/CHF", name: "US Dollar / Swiss Franc", type: "Forex", aliases: ["USDCHF"] },
  { symbol: "AUD/USD", name: "Australian Dollar / US Dollar", type: "Forex", aliases: ["AUDUSD"] },
  { symbol: "USD/CAD", name: "US Dollar / Canadian Dollar", type: "Forex", aliases: ["USDCAD"] },
  { symbol: "NZD/USD", name: "New Zealand Dollar / US Dollar", type: "Forex", aliases: ["NZDUSD"] },

  // Cross Pairs
  { symbol: "EUR/GBP", name: "Euro / British Pound", type: "Forex", aliases: ["EURGBP"] },
  { symbol: "EUR/JPY", name: "Euro / Japanese Yen", type: "Forex", aliases: ["EURJPY"] },
  { symbol: "GBP/JPY", name: "British Pound / Japanese Yen", type: "Forex", aliases: ["GBPJPY"] },
  { symbol: "EUR/CHF", name: "Euro / Swiss Franc", type: "Forex", aliases: ["EURCHF"] },
  { symbol: "EUR/AUD", name: "Euro / Australian Dollar", type: "Forex", aliases: ["EURAUD"] },
  { symbol: "GBP/CHF", name: "British Pound / Swiss Franc", type: "Forex", aliases: ["GBPCHF"] },
  { symbol: "AUD/JPY", name: "Australian Dollar / Japanese Yen", type: "Forex", aliases: ["AUDJPY"] },
  { symbol: "NZD/JPY", name: "New Zealand Dollar / Japanese Yen", type: "Forex", aliases: ["NZDJPY"] },
  { symbol: "CHF/JPY", name: "Swiss Franc / Japanese Yen", type: "Forex", aliases: ["CHFJPY"] },
  { symbol: "CAD/JPY", name: "Canadian Dollar / Japanese Yen", type: "Forex", aliases: ["CADJPY"] },
  { symbol: "AUD/NZD", name: "Australian Dollar / New Zealand Dollar", type: "Forex", aliases: ["AUDNZD"] },
  { symbol: "AUD/CAD", name: "Australian Dollar / Canadian Dollar", type: "Forex", aliases: ["AUDCAD"] },
  { symbol: "EUR/CAD", name: "Euro / Canadian Dollar", type: "Forex", aliases: ["EURCAD"] },
  { symbol: "GBP/AUD", name: "British Pound / Australian Dollar", type: "Forex", aliases: ["GBPAUD"] },
  { symbol: "GBP/CAD", name: "British Pound / Canadian Dollar", type: "Forex", aliases: ["GBPCAD"] },
  { symbol: "EUR/NZD", name: "Euro / New Zealand Dollar", type: "Forex", aliases: ["EURNZD"] },
  { symbol: "GBP/NZD", name: "British Pound / New Zealand Dollar", type: "Forex", aliases: ["GBPNZD"] },
  { symbol: "USD/SGD", name: "US Dollar / Singapore Dollar", type: "Forex", aliases: ["USDSGD"] },
];

export function searchSymbols(query: string, limit = 8): MarketSymbol[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];

  const exactMatches: MarketSymbol[] = [];
  const startsWithSymbol: MarketSymbol[] = [];
  const startsWithName: MarketSymbol[] = [];
  const containsName: MarketSymbol[] = [];

  for (const item of MARKET_SYMBOLS) {
    const symbolLower = item.symbol.toLowerCase();
    const nameLower = item.name.toLowerCase();
    const aliasesLower = item.aliases?.map((a) => a.toLowerCase()) ?? [];

    // Exact symbol or alias match
    if (symbolLower === q || aliasesLower.includes(q)) {
      exactMatches.push(item);
      continue;
    }

    // Symbol starts with query
    if (symbolLower.startsWith(q) || aliasesLower.some((a) => a.startsWith(q))) {
      startsWithSymbol.push(item);
      continue;
    }

    // Name starts with query (check each word too)
    const nameWords = nameLower.split(/\s+/);
    if (nameLower.startsWith(q) || nameWords.some((w) => w.startsWith(q))) {
      startsWithName.push(item);
      continue;
    }

    // Name contains query
    if (nameLower.includes(q)) {
      containsName.push(item);
    }
  }

  return [...exactMatches, ...startsWithSymbol, ...startsWithName, ...containsName].slice(
    0,
    limit
  );
}
