import React, { useState } from "react";
import { Calculator, ArrowRightLeft, Info } from "lucide-react";

type Unit = "sqft" | "cent" | "acre" | "ground" | "guntha";

const UNIT_CONVERSIONS: Record<Unit, number> = {
  sqft: 1,
  cent: 435.6,
  ground: 2400,
  guntha: 1089,
  acre: 43560,
};

const UNIT_LABELS: Record<Unit, string> = {
  sqft: "Square Feet (Sq.Ft)",
  cent: "Cents",
  ground: "Grounds (TN)",
  guntha: "Guntha",
  acre: "Acres",
};

export const AreaConverter: React.FC = () => {
  const [value, setValue] = useState<number | "">(1);
  const [fromUnit, setFromUnit] = useState<Unit>("cent");
  const [toUnit, setToUnit] = useState<Unit>("sqft");

  const numericValue = typeof value === "number" ? value : 0;
  const sqftVal = numericValue * UNIT_CONVERSIONS[fromUnit];
  const convertedResult = sqftVal / UNIT_CONVERSIONS[toUnit];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Land & Plot Area Unit Converter</h2>
          <p className="text-sm text-slate-500">Convert between Cents, Sq.Ft, Grounds, Gunthas & Acres in Tamil Nadu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Enter Area Value
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value === "" ? "" : parseFloat(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg font-semibold text-slate-900"
            placeholder="Enter quantity"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            From Unit
          </label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as Unit)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium"
          >
            {(Object.keys(UNIT_LABELS) as Unit[]).map((unit) => (
              <option key={unit} value={unit}>
                {UNIT_LABELS[unit]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            To Unit
          </label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value as Unit)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium"
          >
            {(Object.keys(UNIT_LABELS) as Unit[]).map((unit) => (
              <option key={unit} value={unit}>
                {UNIT_LABELS[unit]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Display */}
      <div className="mt-8 p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white">
        <div className="flex items-center justify-between text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-1">
          <span>Calculated Result</span>
          <ArrowRightLeft className="w-4 h-4 opacity-75" />
        </div>
        <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {isNaN(convertedResult) ? "0" : convertedResult.toLocaleString(undefined, { maximumFractionDigits: 4 })}{" "}
          <span className="text-xl font-normal text-emerald-100">{UNIT_LABELS[toUnit].split(" ")[0]}</span>
        </div>
        <div className="text-xs text-emerald-100 mt-2">
          1 {UNIT_LABELS[fromUnit]} = {(UNIT_CONVERSIONS[fromUnit] / UNIT_CONVERSIONS[toUnit]).toLocaleString(undefined, { maximumFractionDigits: 4 })} {UNIT_LABELS[toUnit]}
        </div>
      </div>

      {/* Common Standard Land Measurements in Tamil Nadu */}
      <div className="mt-6 p-4 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
        <div className="flex items-center gap-2 font-semibold text-slate-800 mb-1">
          <Info className="w-4 h-4 text-emerald-600" />
          Tamil Nadu Standard Land Conversion Table:
        </div>
        <p>&bull; <strong>1 Cent</strong> = 435.6 Sq.Ft = 40.46 Sq.Meters</p>
        <p>&bull; <strong>1 Ground</strong> = 2,400 Sq.Ft = 5.51 Cents</p>
        <p>&bull; <strong>1 Acre</strong> = 100 Cents = 43,560 Sq.Ft = 18.15 Grounds</p>
      </div>
    </div>
  );
};

export default AreaConverter;
