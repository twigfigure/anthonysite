/**
 * SEO Helper Functions
 * Generate consistent SEO meta tags across the site
 */

export interface BankData {
  name: string;
  city: string;
  state: string;
  slug: string;
}

/**
 * Generate SEO data for a bank detail page
 * Based on the pattern from distressedpro.com
 *
 * Example output:
 * - Title: "City National Bank's REO & Non Performing Loans | Los Angeles, CA"
 * - Description: "Get City National Bank's REO, non-performing loans, decision makers, bank owned property info and FDIC reports | Los Angeles, CA"
 */
export function generateBankSEO(bank: BankData) {
  const title = `${bank.name}'s REO & Non Performing Loans | ${bank.city}, ${bank.state}`;

  const description = `Get ${bank.name}'s REO, non-performing loans, decision makers, bank owned property info and FDIC reports | ${bank.city}, ${bank.state}`;

  const canonical = `${window.location.origin}/banks/${bank.slug}`;

  return {
    title,
    description,
    canonical
  };
}
