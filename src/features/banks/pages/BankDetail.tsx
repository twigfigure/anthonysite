import SEO from "@/components/SEO";
import { generateBankSEO, BankData } from "@/utils/seo";

/**
 * Bank Detail Page
 * Shows information about a specific bank's REO properties and foreclosures
 *
 * This is an EXAMPLE page - you'll need to:
 * 1. Connect to your database to fetch real bank data
 * 2. Use URL params to determine which bank to show
 * 3. Add your actual content/components
 */
export default function BankDetail() {
  // EXAMPLE DATA - Replace with real data from your database/API
  const bank: BankData = {
    name: "City National Bank",
    city: "Los Angeles",
    state: "CA",
    slug: "city-national-bank"
  };

  // Generate SEO meta tags automatically
  const seoData = generateBankSEO(bank);

  return (
    <>
      {/* SEO Meta Tags - This is what Google sees! */}
      <SEO
        title={seoData.title}
        description={seoData.description}
        canonical={seoData.canonical}
      />

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">
          {bank.name}'s REO & Non Performing Loans
        </h1>

        <p className="text-gray-600 mb-8">
          {bank.city}, {bank.state}
        </p>

        {/* Add your actual content here */}
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-2">Nonaccrual Loans Sold</h2>
            <p>Charts and data go here...</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">Decision Makers</h2>
            <p>Contact information goes here...</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">FDIC Reports</h2>
            <p>Reports go here...</p>
          </section>
        </div>
      </div>
    </>
  );
}
