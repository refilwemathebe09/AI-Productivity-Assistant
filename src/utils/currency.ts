export type CurrencyCode = 'ZAR' | 'USD' | 'GBP' | 'EUR' | 'AED' | 'AUD' | 'BWP' | 'KES';

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  locale: string;
  // Rate relative to ZAR (1 ZAR = x Foreign Currency)
  rateFromZAR: number;
  symbolPosition: 'prefix' | 'suffix';
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  ZAR: {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    flag: '🇿🇦',
    locale: 'en-ZA',
    rateFromZAR: 1.0,
    symbolPosition: 'prefix',
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    locale: 'en-US',
    rateFromZAR: 0.056,
    symbolPosition: 'prefix',
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    locale: 'en-GB',
    rateFromZAR: 0.043,
    symbolPosition: 'prefix',
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    locale: 'de-DE',
    rateFromZAR: 0.051,
    symbolPosition: 'prefix',
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED ',
    flag: '🇦🇪',
    locale: 'en-AE',
    rateFromZAR: 0.205,
    symbolPosition: 'prefix',
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    flag: '🇦🇺',
    locale: 'en-AU',
    rateFromZAR: 0.086,
    symbolPosition: 'prefix',
  },
  BWP: {
    code: 'BWP',
    name: 'Botswana Pula',
    symbol: 'P',
    flag: '🇧🇼',
    locale: 'en-BW',
    rateFromZAR: 0.74,
    symbolPosition: 'prefix',
  },
  KES: {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh ',
    flag: '🇰🇪',
    locale: 'en-KE',
    rateFromZAR: 7.20,
    symbolPosition: 'prefix',
  },
};

export const DEFAULT_CURRENCY: CurrencyCode = 'ZAR';

export const CURRENCIES: CurrencyConfig[] = Object.values(SUPPORTED_CURRENCIES);

/**
 * Formats a monetary amount into a clean currency string.
 * @param amount Number to format
 * @param currency Currency code (defaults to ZAR)
 * @param options Custom formatting options
 */
export function formatMoney(
  amount: number,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  options?: {
    showDecimals?: boolean;
    useExchangeRate?: boolean;
    customRate?: number;
    spaceAfterSymbol?: boolean;
  }
): string {
  const config = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.ZAR;
  const showDecimals = options?.showDecimals ?? true;
  
  let val = amount;
  if (options?.useExchangeRate && currency !== 'ZAR') {
    const rate = options?.customRate ?? config.rateFromZAR;
    val = amount * rate;
  }

  const isNegative = val < 0;
  const absVal = Math.abs(val);

  const numStr = absVal.toLocaleString(config.locale, {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  const space = options?.spaceAfterSymbol !== false ? ' ' : '';
  const symbolWithSpace = config.symbol.endsWith(' ') ? config.symbol : `${config.symbol}${space}`;

  if (config.symbolPosition === 'suffix') {
    return `${isNegative ? '-' : ''}${numStr} ${config.symbol.trim()}`;
  }

  return `${isNegative ? '-' : ''}${symbolWithSpace}${numStr}`;
}

/**
 * Formats large amounts compactly, e.g. R 14.25M or R 515k
 */
export function formatCompactMoney(
  amount: number,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  options?: { useExchangeRate?: boolean; customRate?: number }
): string {
  const config = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.ZAR;
  let val = amount;
  if (options?.useExchangeRate && currency !== 'ZAR') {
    const rate = options?.customRate ?? config.rateFromZAR;
    val = amount * rate;
  }

  const isNegative = val < 0;
  const absVal = Math.abs(val);
  const space = config.symbol.endsWith(' ') ? '' : ' ';

  let formatted = '';
  if (absVal >= 1_000_000_000) {
    formatted = `${(absVal / 1_000_000_000).toFixed(2)}B`;
  } else if (absVal >= 1_000_000) {
    formatted = `${(absVal / 1_000_000).toFixed(2)}M`;
  } else if (absVal >= 1_000) {
    formatted = `${(absVal / 1_000).toFixed(0)}k`;
  } else {
    formatted = absVal.toLocaleString(config.locale, { maximumFractionDigits: 0 });
  }

  return `${isNegative ? '-' : ''}${config.symbol}${space}${formatted}`;
}
