import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';

const Faq = () => {
  // 7 highly specific, geographically calibrated real-estate and AI FAQs
  const faqData = [
    {
      question: "How does PropSightAi's artificial intelligence calculate property valuations?",
      answer: "Our predictive valuation engine utilizes machine learning models trained on millions of active and historical transactions across major cities in Pakistan (such as Islamabad, Lahore, and Karachi). It factors in spatial proximity, local market indexes, recent construction material costs, and seasonal trends to estimate current market values with high precision."
    },
    {
      question: "Can I list a property for auction, and how does the online bidding process work?",
      answer: "Yes! Sellers and verified dealers can list properties for online auction. Once approved, buyers can place competitive bids in real-time. The system utilizes secure WebSocket technology to process bids instantly and transparently, ensuring a fair, reliable transaction process."
    },
    {
      question: "What is the 'Smart Build' tool and how accurate is the Construction Cost Calculator?",
      answer: "The Construction Cost Calculator is a specialized tool that estimates building costs based on real-time material price indexes (such as bricks, cement, sand, and steel) in Pakistan. While prices fluctuate due to market conditions, our estimator is updated weekly to provide highly accurate regional projections."
    },
    {
      question: "Are the dealers and property listings on PropSightAi verified?",
      answer: "Absolutely. Trust is our primary currency. Every dealer undergoes a thorough verification process before they can list. Additionally, property listings are reviewed and cross-referenced with local land authorities to ensure complete legitimacy and peace of mind for buyers."
    },
    {
      question: "How do I use the Plot Finder tool to find specific coordinates?",
      answer: "Our Plot Finder integrates detailed GIS mapping coordinates and sector-wise layout plans of major housing societies. You can easily search by society name, sector, and block to pinpoint the exact dimensions and physical location of any plot directly on your screen."
    },
    {
      question: "Is there a fee to use PropSightAi's AI tools or post a property?",
      answer: "Basic property searching, using the Area Guides, and running standard calculations are completely free. Premium AI valuation insights, online auction listings, and verified dealer memberships operate on tiered subscription plans."
    },
    {
      question: "How does PropSightAi bridge the gap between buyers and backend servers securely?",
      answer: "Our React-Vite front-end connects securely to an advanced Java Spring Boot REST API, backed by a highly secure MySQL database. We utilize JWT (JSON Web Tokens) for modern, stateless user authentication, ensuring that your personal listings, wishlist details, and bidding data are fully encrypted."
    }
  ];

  // Track the index of the expanded FAQ (null means all closed)
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // Alternating pale-gray background matching the Explore section flow
    <div className="py-20 bg-slate-50/50 border-t border-slate-100">
      <div className="px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto">
        
        {/* ── HEADER ── */}
        <ScrollReveal direction="up" duration={0.8}>
          <div className="text-center mb-12 space-y-2">
            <span className="text-blue-600 font-extrabold uppercase text-xs tracking-wider block">
              Exclusive Support
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-550 text-sm max-w-md mx-auto">
              Find answers to common questions about our AI valuation models, plot coordinate systems, and auctions.
            </p>
          </div>
        </ScrollReveal>

        {/* ── SINGLE COLUMN ACCORDION STACK ── */}
        <ScrollReveal 
          cascade={true} 
          direction="up" 
          staggerAmount={0.08} 
          duration={0.7}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index} 
                className={`bg-white border rounded-2xl p-5 transition-all duration-300 shadow-sm cursor-pointer ${
                  isOpen 
                    ? "border-blue-500/20 shadow-md shadow-blue-500/[0.02]" 
                    : "border-slate-100 hover:border-slate-200"
                }`}
                onClick={() => toggleFaq(index)}
              >
                {/* Accordion Trigger Header */}
                <div className="flex justify-between items-center w-full text-left">
                  <span className={`font-bold text-base md:text-[17px] transition-colors duration-200 select-none ${
                    isOpen ? "text-blue-600" : "text-slate-800 hover:text-blue-600"
                  }`}>
                    {item.question}
                  </span>
                  
                  {/* Rotating Chevron Arrow */}
                  <svg 
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ml-4 ${
                      isOpen ? "rotate-180 text-blue-500" : ""
                    }`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* ── ACCORDION SLIDE CONTAINER (Pure CSS-Grid Transition) ── */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-3.5" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-slate-600 text-sm leading-relaxed text-left pb-1 border-t border-slate-100/50 pt-3">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </ScrollReveal>
      </div>
    </div>
  );
};

// Dual-export pattern guarantees compiling safety across various routing import systems
export { Faq };
export default Faq;