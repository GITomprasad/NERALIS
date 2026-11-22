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
  { name: 'Food & PDS Grains', value: 45, color: '#19C6D2' },
  { name: 'Cold-Chain Vaccines & Blood', value: 20, color: '#20C997' },
  { name: 'Construction & Steel', value: 18, color: '#FFB547' },
  { name: 'Winter Fuel & LPG', value: 17, color: '#438BFF' },
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
    const code = `<iframe src="https://neralis-frontend.onrender.com/embed/map?state=AS&theme=dark" width="100%" height="450" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    addToast('Snippet Copied', 'Embeddable HTML iframe copied to clipboard.', 'INFO');
    setTimeout(() => setCopiedSnippet(false), 3000);
  };

  const filteredCorridors = corridors.filter((c) => {
    if (tableFilter === 'ALL') return true;
    return c.status === tableFilter;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="card-command flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-[#29372D]">
            {t('module_7')} — Strategic Logistics Analytics &amp; Command Center
          </h2>
          <p className="text-xs text-[#68766C] mt-0.5">
            Macro KPIs, 3-Year ROI analytics, disruption logs, and state comparative governance scorecards
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleExportCSV} className="btn-secondary text-xs py-2 px-3">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button onClick={handleExportExcel} className="btn-secondary text-xs py-2 px-3">
            <Download className="w-3.5 h-3.5 text-[#7C9082]" /> Excel
          </button>
          <button
            onClick={() => setIsParliamentModalOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" /> Parliament Report (PDF)
          </button>
        </div>
      </div>

      {/* 3 Executive High-Level Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-command space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#68766C]">
            Regional Delivery Delay Reduction
          </span>
          <div className="text-2xl font-black text-[#7C9082] flex items-center gap-2 font-mono">
            14.2% <TrendingDown className="w-5 h-5 text-[#7C9082]" />
          </div>
          <p className="text-[11px] text-[#68766C]">Reduced from 45% baseline (₹420 Cr/yr saved)</p>
        </div>

        <div className="card-command space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#68766C]">
            PHC Essential Medicine Stockouts
          </span>
          <div className="text-2xl font-black text-[#7C9082] font-mono">3.8%</div>
          <p className="text-[11px] text-[#68766C]">Reduced from 34% monsoon stockouts</p>
        </div>

        <div className="card-command space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#68766C]">
            Public Investment ROI
          </span>
          <div className="text-2xl font-black text-[#1B3022] font-mono">29.2× ROI</div>
          <p className="text-[11px] text-[#68766C]">₹32.8 Cr TCO vs ₹960+ Cr/yr benefit</p>
        </div>
      </div>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chart 1: Delay Reduction Over Time (7 cols) */}
        <div className="lg:col-span-7 card-command space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#29372D] text-xs uppercase">
              Monsoon Delivery Delay Rate Reduction Curve (%)
            </span>
            <span className="text-[10px] bg-[#7C9082]/15 text-[#7C9082] border border-[#7C9082]/30 font-bold px-2 py-0.5 rounded">
              Target &lt; 15% Achieved
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={delayTrendData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                <YAxis domain={[0, 50]} stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E7DAD8', borderRadius: '8px', color: '#252124' }}
                />
                <Bar dataKey="delayRate" fill="#438BFF" radius={[4, 4, 0, 0]} name="Actual Delay %" />
                <Bar dataKey="target" fill="#19C6D2" radius={[4, 4, 0, 0]} name="National Target %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Freight Commodity Share (5 cols) */}
        <div className="lg:col-span-5 card-command space-y-3 text-xs">
          <span className="font-bold text-[#29372D] text-xs uppercase block">
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
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E7DAD8', borderRadius: '8px', color: '#252124' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#94A3B8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Disruption Log Table */}
      <div className="card-command space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-[#1B3022] text-xs uppercase">
            Master Corridor Disruption &amp; Structural Health Log
          </span>
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#68766C]" />
            <select
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              className="bg-[#F4F5F0] border border-[#DFE5DD] rounded-xl px-2.5 py-1 text-xs text-[#29372D] cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open Only</option>
              <option value="RESTRICTED">Restricted Only</option>
              <option value="CLOSED">Closed Only</option>
            </select>
          </div>
        </div>

        <div className="border border-[#DFE5DD] rounded-xl overflow-x-auto">
          <table className="table-command min-w-[600px]">
            <thead>
              <tr>
                <th>Corridor ID</th>
                <th>Corridor Name</th>
                <th>Distance (km)</th>
                <th>Status</th>
                <th>Hazard Risk</th>
                <th>Bridge Clearance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCorridors.slice(0, 10).map((c) => (
                <tr key={c.id}>
                  <td className="font-mono font-bold text-[#1B3022]">{c.id}</td>
                  <td className="font-bold text-[#29372D]">{c.name}</td>
                  <td className="font-mono">{c.distance_km} km</td>
                  <td>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
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
                    <span
                      className={`font-bold font-mono ${
                        c.risk_score >= 60 ? 'text-[#FF5252]' : c.risk_score >= 35 ? 'text-[#FFB547]' : 'text-[#7C9082]'
                      }`}
                    >
                      {c.risk_score}%
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-[#29372D]">{c.weight_limit_tons} MT</span>
                  </td>
                  <td>
                    <button
                      onClick={() => addToast('Corridor Inspected', `${c.name} diagnostics logged.`, 'INFO')}
                      className="text-[#1B3022] hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      View Details &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
