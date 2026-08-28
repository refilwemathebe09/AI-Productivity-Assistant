import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CurrencyCode, 
  CurrencyConfig, 
  SUPPORTED_CURRENCIES, 
  DEFAULT_CURRENCY, 
  formatMoney as formatMoneyUtil,
  formatCompactMoney as formatCompactMoneyUtil 
} from '../utils/currency';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencyConfig: CurrencyConfig;
  supportedCurrencies: CurrencyConfig[];
  convertRateEnabled: boolean;
  setConvertRateEnabled: (enabled: boolean) => void;
  formatMoney: (amount: number, options?: { showDecimals?: boolean; spaceAfterSymbol?: boolean }) => string;
  formatCompact: (amount: number) => string;
  getSymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'costpilot_selected_currency';
const LOCAL_STORAGE_CONVERT_KEY = 'costpilot_convert_rate_enabled';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && saved in SUPPORTED_CURRENCIES) {
        return saved as CurrencyCode;
      }
    }
    return DEFAULT_CURRENCY; // Standard default: ZAR (Rands)
  });

  const [convertRateEnabled, setConvertRateEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_CONVERT_KEY);
      return saved === 'true';
    }
    return false;
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, code);
    }
  };

  const setConvertRateEnabled = (enabled: boolean) => {
    setConvertRateEnabledState(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_CONVERT_KEY, String(enabled));
    }
  };

  const currencyConfig = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.ZAR;
  const supportedCurrencies = Object.values(SUPPORTED_CURRENCIES);

  const formatMoney = (amount: number, options?: { showDecimals?: boolean; spaceAfterSymbol?: boolean }) => {
    return formatMoneyUtil(amount, currency, {
      showDecimals: options?.showDecimals ?? true,
      useExchangeRate: convertRateEnabled,
      spaceAfterSymbol: options?.spaceAfterSymbol,
    });
  };

  const formatCompact = (amount: number) => {
    return formatCompactMoneyUtil(amount, currency, {
      useExchangeRate: convertRateEnabled,
    });
  };

  const getSymbol = () => currencyConfig.symbol;

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currencyConfig,
        supportedCurrencies,
        convertRateEnabled,
        setConvertRateEnabled,
        formatMoney,
        formatCompact,
        getSymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
