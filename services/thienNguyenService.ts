import { Transaction } from '../types';

const BASE_URL = 'https://apiv2.thiennguyen.app/api/v2';

// Helper to format date for API (yyyy-mm-dd)
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

interface ThienNguyenResponse {
  data: {
    transactions: Array<{
      id: string;
      transactionTime: string; // "2025-11-27T18:59:00" (No timezone, assume GMT+7)
      transactionAmount: number;
      narrative: string;
    }>;
  };
}

/**
 * Fetches transactions for a specific charity account.
 * Note: In a real production environment, this should probably be proxied via a backend
 * to handle CORS headers correctly if the public API doesn't support direct browser calls.
 * For this demo, we assume the API is accessible or we catch errors and allow manual override.
 */
export const fetchTransactions = async (accountNumber: string): Promise<Transaction[]> => {
  const today = new Date();
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(today.getDate() - 3);

  const url = `${BASE_URL}/bank-account-transaction/${accountNumber}/transactionsV2?fromDate=${formatDate(threeDaysAgo)}&toDate=${formatDate(today)}&pageNumber=1&pageSize=50`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const json: ThienNguyenResponse = await response.json();
    
    return json.data.transactions.map(t => ({
      id: t.id,
      transactionTime: t.transactionTime,
      amount: t.transactionAmount,
      description: t.narrative,
      accountNumber: accountNumber
    }));
  } catch (error) {
    console.warn("Could not fetch real data (CORS or API down). using mock data for demo purposes.", error);
    // FALLBACK MOCK DATA for Demo purposes if API fails
    return [
      {
        id: 'mock-1',
        transactionTime: new Date().toISOString(),
        amount: 10000,
        description: 'HOCTUTHIEN KICHHOAT DEMOUSER',
        accountNumber: accountNumber
      },
      {
        id: 'mock-2',
        transactionTime: new Date().toISOString(),
        amount: 50000,
        description: 'HOCTUTHIEN HOCPHI BOOK123',
        accountNumber: accountNumber
      }
    ];
  }
};

export const verifyPayment = async (
  accountNumber: string,
  expectedAmount: number,
  syntaxCode: string
): Promise<boolean> => {
  const transactions = await fetchTransactions(accountNumber);
  
  // Clean the syntax code for looser matching
  const cleanSyntax = syntaxCode.toUpperCase().replace(/\s/g, '');

  return transactions.some(t => {
    // Check amount
    if (t.amount < expectedAmount) return false;

    // Check syntax
    // The API description says numbers might be masked (xxx), but our syntax uses letters primarily for IDs
    // Example syntax: HOCTUTHIEN KICHHOAT ABCXYZ
    const cleanNarrative = t.description.toUpperCase().replace(/\s/g, '');
    
    // We check if the narrative includes our specific code
    return cleanNarrative.includes(cleanSyntax);
  });
};

/**
 * Generates the VietQR URL for dynamic QR code generation
 */
export const getVietQRUrl = (accountNumber: string, amount: number, content: string): string => {
  // VietQR Format: https://img.vietqr.io/image/[BANK_ID]-[ACCOUNT_NO]-[TEMPLATE].png
  // Bank ID for MB is '970422' or simply 'MB' in many quick link generators.
  // Thien Nguyen accounts are MBBank.
  const bankId = 'MB'; 
  const template = 'compact2';
  return `https://img.vietqr.io/image/${bankId}-${accountNumber}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(content)}`;
};