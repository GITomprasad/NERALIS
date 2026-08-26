import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useLanguage } from '../../context/LanguageContext';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  BarChart3,
  TrendingDown,
  Download,
  Code2,
  FileText,
  Copy,
  Check,
  Filter,
  Eye,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const delayTrendData = [
  { month: 'Pre-NERALIS', delayRate: 45.0, target: 15.0 },
  { month: 'Month 6', delayRate: 36.2, target: 15.0 },
  { month: 'Month 12', delayRate: 28.5, target: 15.0 },
  { month: 'Month 18', delayRate: 22.0, target: 15.0 },
  { month: 'Month 24', delayRate: 17.4, target: 15.0 },
  { month: 'Year 3 (Current)', delayRate: 14.2, target: 15.0 },
];

const stateDisruptionData = [
  { state: 'Assam', count: 18, score: 86 },
  { state: 'Arunachal', count: 34, score: 62 },
  { state: 'Manipur', count: 24, score: 67 },
  { state: 'Meghalaya', count: 28, score: 71 },
  { state: 'Mizoram', count: 21, score: 74 },
  { state: 'Nagaland', count: 29, score: 64 },
  { state: 'Sikkim', count: 38, score: 58 },
  { state: 'Tripura', count: 9, score: 88 },
];

const commodityDistribution = [
  { name: 'Food & PDS Grains', value: 45, color: '#1E3A5F' },
  { name: 'Cold-Chain Vaccines & Blood', value: 20, color: '#0F6B6B' },
  { name: 'Construction & Steel', value: 18, color: '#B85C00' },
  { name: 'Winter Fuel & LPG', value: 17, color: '#2563A8' },
];

export const AnalyticsDashboard: React.FC = () => {
  const { corridors, districts, addToast, setIsParliamentModalOpen } = usePlatform();
  const { t } = useLanguage();

  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [tableFilter, setTableFilter] = useState('ALL');

  const handleExportCSV = () => {
    const csvContent =
      'Corridor ID,Name,Distance (km),Status,Hazard Risk (%),Weight Limit (MT)\n' +
      corridors
        .map((c) => `"${c.id}","${c.name}",${c.distance_km},"${c.status}",${c.risk_score},${c.weight_limit_tons}`)
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'NERALIS_Disruption_Log.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('CSV Exported', 'NER corridors disruption log downloaded.', 'SUCCESS');
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      corridors.map((c) => ({
        ID: c.id,
        Name: c.name,
        DistanceKm: c.distance_km,
        Status: c.status,
        RiskScore: c.risk_score,
        Hazard: c.hazard_type,
        MaxWeightTons: c.weight_limit_tons
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Corridors');
    XLSX.writeFile(wb, 'NERALIS_Master_Logistics_Log.xlsx');
    addToast('Excel Exported', 'Full logistics workbook exported.', 'SUCCESS');
  };

  const copyWidgetSnippet = () => {
    const code = `<iframe src="https://neralis.gov.in/embed/map?state=AS&theme=light" width="100%" height="450" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    addToast('Snippet Copied', 'Embeddable HTML iframe copied to clipboard.', 'INFO');
    setTimeout(() => setCopiedSnippet(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-[#D1D5DB] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-black text-[#1E3A5F]">
            {t('module_7')} — Centralised Logistics Command & Analytics
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Macro KPIs, 3-Year ROI analytics, disruption logs, and state comparative governance scorecards
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-secondary text-xs py-2">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button onClick={handleExportExcel} className="btn-secondary text-xs py-2">
            <Download className="w-3.5 h-3.5 text-emerald-700" /> Excel
          </button>
          <button
            onClick={() => setIsParliamentModalOpen(true)}
            className="btn-primary text-xs py-2 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" /> Parliament Report (PDF)
          </button>
        </div>
      </div>

      {/* 3 Executive High-Level Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#D1D5DB] shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">
            Regional Delivery Delay Reduction
          </span>
          <div className="text-2xl font-black text-emerald-700 flex items-center gap-2">
            14.2% <TrendingDown className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[11px] text-gray-600">Reduced from 45% baseline (₹420 Cr/yr saved)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D1D5DB] shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">
            PHC Essential Medicine Stockouts
          </span>
          <div className="text-2xl font-black text-blue-700">3.8%</div>
          <p className="text-[11px] text-gray-600">Reduced from 34% monsoon stockouts</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D1D5DB] shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">
            Public Investment ROI
          </span>
          <div className="text-2xl font-black text-[#1E3A5F]">29.2× ROI</div>
          <p className="text-[11px] text-gray-600">₹32.8 Cr TCO vs ₹960+ Cr/yr benefit</p>
        </div>
      </div>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chart 1: Delay Reduction Over Time (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-[#D1D5DB] shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1E3A5F] text-xs uppercase">
              Monsoon Delivery Delay Rate Reduction Curve (%)
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Target &lt; 15% Achieved
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayTrendData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis domain={[0, 50]} stroke="#64748b" fontSize={10} />
                <Tooltip />
                <Bar dataKey="delayRate" fill="#2563A8" radius={[4, 4, 0, 0]} name="Actual Delay %" />
                <Bar dataKey="target" fill="#0F6B6B" radius={[4, 4, 0, 0]} name="SIH Target %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Freight Commodity Share (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#D1D5DB] shadow-xs space-y-3 text-xs">
          <span className="font-bold text-[#1E3A5F] text-xs uppercase block">
            Critical Freight Volume Breakdown
          </span>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={commodityDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {commodityDistribution.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Disruption Log Table */}
      <div className="bg-white p-5 rounded-xl border border-[#D1D5DB] shadow-xs space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-[#1E3A5F] text-xs uppercase">
            Master Corridor Disruption & Structural Log
          </span>
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open Only</option>
              <option value="RESTRICTED">Restricted Only</option>
              <option value="CLOSED">Closed Only</option>
            </select>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left table-official">
            <thead>
              <tr>
                <th>Corridor ID</th>
                <th>Corridor Name</th>
                <th>Distance</th>
                <th>Live Status</th>
                <th>Hazard Risk</th>
                <th>Max Weight</th>
              </tr>
            </thead>
            <tbody>
              {corridors
                .filter((c) => tableFilter === 'ALL' || c.status === tableFilter)
                .map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono font-bold text-[#1E3A5F]">{c.id}</td>
                    <td className="font-bold text-gray-900">{c.name}</td>
                    <td>{c.distance_km} km</td>
                    <td>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.status === 'OPEN'
                            ? 'badge-open'
                            : c.status === 'RESTRICTED'
                            ? 'badge-restricted'
                            : c.status === 'DEGRADED'
                            ? 'badge-degraded'
                            : 'badge-closed'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold text-amber-800">{c.risk_score}%</span>
                    </td>
                    <td>{c.weight_limit_tons} Tons</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* State IT Portal REST API Sandbox */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-700 shadow-xl space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-black text-sm text-white uppercase">
                State IT Portal REST API & Embeddable Widget Sandbox
              </h3>
              <p className="text-[11px] text-slate-400">
                Enables all 8 State Government disaster portals to integrate live NERALIS GIS widgets
              </p>
            </div>
          </div>
          <button
            onClick={copyWidgetSnippet}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5"
          >
            {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSnippet ? 'Copied' : 'Copy Iframe Code'}</span>
          </button>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-sky-300">
          <code>&lt;iframe src="https://neralis.gov.in/embed/map?state=AS&amp;theme=light" width="100%" height="450" frameborder="0"&gt;&lt;/iframe&gt;</code>
        </div>
      </div>
    </div>
  );
};
