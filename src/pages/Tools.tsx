import React from "react";
import AreaConverter from "../components/tools/AreaConverter";
import EmiCalculator from "../components/tools/EmiCalculator";
import AdBanner from "../components/ads/AdBanner";
import AdInContent from "../components/ads/AdInContent";
import { Wrench, ShieldCheck, HelpCircle, FileText } from "lucide-react";

export const ToolsPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs uppercase tracking-wider mb-4">
            <Wrench className="w-4 h-4" /> Real Estate Utilities & Calculators
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Property Area & Loan EMI Calculators
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Free utility tools designed for buyers, investors, and landowners in Tamil Nadu. Convert land measurements accurately and estimate plot loan EMIs before investing.
          </p>
        </div>

        {/* Top Ad Banner */}
        <AdBanner pagePath="/tools" className="max-w-4xl" />

        {/* Section 1: Land Unit Converter */}
        <section className="my-12">
          <AreaConverter />
        </section>

        {/* In-Content Native Ad Placement */}
        <AdInContent pagePath="/tools" className="max-w-4xl" />

        {/* Section 2: EMI Calculator */}
        <section className="my-12">
          <EmiCalculator />
        </section>

        {/* Educational Content & Guidelines */}
        <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-700 font-bold text-lg mb-4">
              <FileText className="w-5 h-5" />
              How Land Measurements Work in Tamil Nadu
            </div>
            <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                In Tamil Nadu, land area is legally recorded in various traditional and standard units. While urban plot dimensions are commonly expressed in <strong>Square Feet (Sq.Ft)</strong> or <strong>Grounds</strong>, suburban layouts and agricultural lands use <strong>Cents</strong> and <strong>Acres</strong>.
              </p>
              <p>
                A standard <strong>Ground</strong> equals 2,400 sq.ft, which is a common unit for plot registration in Chennai and suburban areas. 1 <strong>Cent</strong> measures 435.6 sq.ft.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 text-teal-700 font-bold text-lg mb-4">
              <ShieldCheck className="w-5 h-5" />
              Plot Loan Eligibility & Guidelines
            </div>
            <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                Most leading Indian banks provide plot purchase loans for <strong>DTCP (Directorate of Town and Country Planning)</strong> and <strong>CMDA approved layout plots</strong> up to 70% - 80% of the property market value.
              </p>
              <p>
                Ensure that your plot title is clear, unencumbered (Encumbrance Certificate), and possesses a valid Patta in the seller&apos;s name before applying for bank loans.
              </p>
            </div>
          </div>
        </div>

        {/* Tool FAQs */}
        <div className="my-12 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-600" /> Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-800 text-base mb-1">
                How many square feet are in 1 Cent of land?
              </h3>
              <p className="text-sm text-slate-600">
                1 Cent is equal to exactly 435.6 Square Feet (or approximately 40.46 Square Meters).
              </p>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <h3 className="font-semibold text-slate-800 text-base mb-1">
                Can I get a bank loan for unapproved land plots?
              </h3>
              <p className="text-sm text-slate-600">
                Nationalized and commercial banks generally do not approve loans for unapproved layouts. Bank loans are readily available for DTCP approved plots with clear documentation.
              </p>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <h3 className="font-semibold text-slate-800 text-base mb-1">
                What is the formula used for calculating monthly EMI?
              </h3>
              <p className="text-sm text-slate-600 font-mono text-xs bg-slate-50 p-3 rounded-lg my-2">
                EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
              </p>
              <p className="text-sm text-slate-600">
                Where <strong>P</strong> is Principal Loan Amount, <strong>R</strong> is Monthly Interest Rate, and <strong>N</strong> is Loan Tenure in Months.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
