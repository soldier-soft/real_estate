import React, { useState } from "react";
import { Landmark, PieChart, Info } from "lucide-react";

export const EmiCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(1500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(15);

  // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let emi = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (loanAmount > 0 && interestRate > 0 && tenureYears > 0) {
    emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    totalPayment = emi * totalMonths;
    totalInterest = totalPayment - loanAmount;
  }

  const interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
  const principalPercentage = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
          <Landmark className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Plot Loan & Property EMI Calculator</h2>
          <p className="text-sm text-slate-500">Estimate your monthly installments, total interest, and loan tenure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Sliders */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Plot Loan Amount (₹)
              </label>
              <span className="text-base font-bold text-slate-900">
                ₹{loanAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min="100000"
              max="20000000"
              step="50000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>₹1 Lakh</span>
              <span>₹2 Crore</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Annual Interest Rate (% p.a.)
              </label>
              <span className="text-base font-bold text-slate-900">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="18"
              step="0.25"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>5%</span>
              <span>18%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Loan Tenure (Years)
              </label>
              <span className="text-base font-bold text-slate-900">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-semibold tracking-wider mb-2">
              <PieChart className="w-4 h-4 text-teal-400" />
              Repayment Overview
            </div>

            <div className="mt-4 mb-6">
              <div className="text-slate-400 text-xs">Estimated Monthly EMI</div>
              <div className="text-3xl font-extrabold text-teal-400 tracking-tight mt-1">
                ₹{Math.round(emi).toLocaleString("en-IN")}
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-800 pt-4 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Principal Loan Amount:</span>
                <span className="font-semibold text-white">₹{loanAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Interest Payable:</span>
                <span className="font-semibold text-teal-300">₹{Math.round(totalInterest).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Payment Amount:</span>
                <span className="font-semibold text-white">₹{Math.round(totalPayment).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Visual Percentage Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Principal ({principalPercentage.toFixed(1)}%)</span>
              <span>Interest ({interestPercentage.toFixed(1)}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div style={{ width: `${principalPercentage}%` }} className="bg-teal-500 h-full"></div>
              <div style={{ width: `${interestPercentage}%` }} className="bg-amber-500 h-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <span>
          <strong>Note:</strong> Bank interest rates and processing fees vary depending on applicant eligibility and bank terms for DTCP approved layout plots in Tamil Nadu.
        </span>
      </div>
    </div>
  );
};

export default EmiCalculator;
