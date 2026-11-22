import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  FileText,
  Download,
  X,
  ShieldCheck,
  TrendingUp,
  Award,
  CheckCircle2
} from 'lucide-react';

export const ParliamentReportModal: React.FC = () => {
  const { isParliamentModalOpen, setIsParliamentModalOpen, addToast } = usePlatform();

  if (!isParliamentModalOpen) return null;

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // GoI Header
    doc.setFillColor(184, 80, 66); // Terracotta #B85042
    doc.rect(0, 0, 210, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('GOVERNMENT OF INDIA — MINISTRY OF DEVELOPMENT OF NER', 14, 11);
    doc.setFontSize(9);
    doc.text('NATIONAL SMART LOGISTICS & ACCESSIBILITY INTELLIGENCE PLATFORM (NERALIS)', 14, 18);

    doc.setTextColor(30, 58, 95);
    doc.setFontSize(16);
    doc.text('OFFICIAL PARLIAMENTARY & LEGISLATIVE BRIEF', 14, 34);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('Subject: AI-Based Smart Logistics & Accessibility Intelligence Platform (NERALIS)', 14, 42);
    doc.text(`Date of Dispatch: ${new Date().toLocaleDateString('en-GB')} | Scope: 8 NER States, 89 Districts`, 14, 48);

    // Impact Table
    const tableData = [
      ['Delivery Delays', '45% Delayed', '< 15% (14.2% Achieved)', '₹ 420 Cr/year operational savings'],
      ['Essential Medicine Stockouts', '34% of Remote PHCs', '< 5% (3.8% Achieved)', 'Immeasurable health outcomes'],
      ['Post-Harvest Farmer Produce Loss', '35% Crop Loss', '< 12% (11.1% Achieved)', '₹ 180 Cr/year farmer income gain'],
      ['Infrastructure Project Overruns', '6-18 Months Delay', '< 3 Months (2.4m Achieved)', '₹ 300 Cr/year capex savings'],
      ['Disaster Emergency Turnaround', '48 - 72 Hours', '< 8 Hours (6.8h Achieved)', 'Rapid relief & lives saved'],
      ['Fuel & Routing Optimisation', 'Suboptimal Baseline', '18.6% Fuel Saved', '₹ 60 Cr/year fleet savings']
    ];

    autoTable(doc, {
      startY: 54,
      head: [['Dimension / Indicator', 'Baseline (Pre-NERALIS)', 'Target vs Current Achieved', 'Annual Economic / Social Impact']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [13, 21, 34], textColor: [25, 198, 210], fontStyle: 'bold' },
      styles: { fontSize: 8.5, cellPadding: 3 }
    });

    // ROI Section
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setTextColor(25, 198, 210);
    doc.text('FINANCIAL COST-BENEFIT & RETURN ON INVESTMENT (ROI)', 14, finalY);

    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text('• 3-Year Total Cost of Ownership (TCO): ₹ 32.80 Crore (Platform, Edge Nodes, IoT & NavIC GPS Units)', 14, finalY + 7);
    doc.text('• Estimated Annual Gross Economic Benefit: ₹ 960.00+ Crore / Year across 8 NER States', 14, finalY + 13);
    doc.text('• Projected ROI: 29.2x Return on Public Digital Infrastructure Investment by Year 3.', 14, finalY + 19);

    doc.save('NERALIS_Parliament_Executive_Brief.pdf');
    addToast('Parliament Brief Downloaded', 'Official formatted PDF exported successfully.', 'SUCCESS');
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Dimension: 'Delivery Delays', Baseline: '45%', Current: '14.2%', AnnualBenefitCr: 420 },
      { Dimension: 'Medicine Stockouts', Baseline: '34%', Current: '3.8%', AnnualBenefitCr: 'Healthcare Safeguarded' },
      { Dimension: 'Agricultural Produce Loss', Baseline: '35%', Current: '11.1%', AnnualBenefitCr: 180 },
      { Dimension: 'Infrastructure Overruns', Baseline: '18 Months', Current: '2.4 Months', AnnualBenefitCr: 300 },
      { Dimension: 'Fuel Optimization', Baseline: '0%', Current: '18.6%', AnnualBenefitCr: 60 },
      { Dimension: 'Total 3-Year TCO', Baseline: '-', Current: '₹ 32.8 Cr', AnnualBenefitCr: '₹ 960+ Cr/yr Benefit (29.2x ROI)' }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'NERALIS Impact ROI');
    XLSX.writeFile(wb, 'NERALIS_Executive_Impact_Sheet.xlsx');
    addToast('Excel Sheet Exported', 'XLSX workbook downloaded.', 'SUCCESS');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[6000] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#E7E8D1] rounded-2xl w-full max-w-3xl overflow-hidden border border-[#D6D8C8] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#E7E8D1] text-[#30342F] px-6 py-4 flex items-center justify-between border-b border-[#D6D8C8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
              <Award className="w-5 h-5 text-[#FFB547]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#B85042] uppercase tracking-wider block">
                Official Government Status Report
              </span>
              <h3 className="text-base font-bold text-[#30342F]">
                NERALIS Parliamentary &amp; Legislative Brief
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsParliamentModalOpen(false)}
            className="text-[#74796F] hover:text-[#30342F] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#74796F]">
          {/* Executive Overview Banner */}
          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#B85042]/30">
            <h4 className="font-black text-[#B85042] text-sm mb-1">
              Executive Summary for Standing Committee on Development of NER
            </h4>
            <p className="text-[#74796F] leading-relaxed text-xs">
              The AI-Based Smart Logistics &amp; Accessibility Intelligence Platform (NERALIS) has established unified GIS, predictive flood/landslide forecasting, and NavIC multi-modal routing across all 8 North Eastern States (89 districts). Chronic monsoon disruptions have been transformed into proactive 72-hour advance interventions.
            </p>
          </div>

          {/* 3-Year TCO vs ROI Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-[#FFFFFF] rounded-xl border border-[#D6D8C8]">
              <span className="text-[10px] uppercase font-bold text-[#74796F]">3-Year Platform TCO</span>
              <div className="text-xl font-black text-[#30342F] mt-1">₹ 32.80 Cr</div>
              <p className="text-[10px] text-[#74796F] mt-0.5">Software, Cloud, Edge Nodes, IoT</p>
            </div>
            <div className="p-3.5 bg-emerald-950/30 rounded-xl border border-emerald-500/30">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Annual Gross Benefit</span>
              <div className="text-xl font-black text-[#A7BEAE] mt-1">₹ 960+ Cr/yr</div>
              <p className="text-[10px] text-emerald-300/80 mt-0.5">Freight savings, farm income, logistics</p>
            </div>
            <div className="p-3.5 bg-amber-950/30 rounded-xl border border-amber-500/30">
              <span className="text-[10px] uppercase font-bold text-amber-400">Projected Return (ROI)</span>
              <div className="text-xl font-black text-[#FFB547] mt-1">29.2× ROI</div>
              <p className="text-[10px] text-amber-300/80 mt-0.5">High-impact public infrastructure</p>
            </div>
          </div>

          {/* Quantified Impact Table */}
          <div className="border border-[#D6D8C8] rounded-xl overflow-hidden shadow-command-card">
            <table className="w-full text-left table-command">
              <thead>
                <tr>
                  <th className="p-2.5">Indicator</th>
                  <th className="p-2.5">Pre-NERALIS Baseline</th>
                  <th className="p-2.5">Target vs Current</th>
                  <th className="p-2.5">Annual Quantified Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-bold text-[#30342F] p-2.5">Delivery Delay Rate</td>
                  <td className="text-[#74796F] p-2.5">45% Delayed</td>
                  <td className="text-[#A7BEAE] font-bold p-2.5">14.2% Delayed</td>
                  <td className="font-bold text-[#B85042] p-2.5">₹ 420 Cr/yr operational savings</td>
                </tr>
                <tr>
                  <td className="font-bold text-[#30342F] p-2.5">Medicine Stockouts</td>
                  <td className="text-[#74796F] p-2.5">34% PHCs</td>
                  <td className="text-[#A7BEAE] font-bold p-2.5">3.8% Stockouts</td>
                  <td className="font-bold text-[#B85042] p-2.5">Lives Saved &amp; Health Security</td>
                </tr>
                <tr>
                  <td className="font-bold text-[#30342F] p-2.5">Post-Harvest Farm Produce Loss</td>
                  <td className="text-[#74796F] p-2.5">35% Loss</td>
                  <td className="text-[#A7BEAE] font-bold p-2.5">11.1% Loss</td>
                  <td className="font-bold text-[#B85042] p-2.5">₹ 180 Cr/yr farmer income gain</td>
                </tr>
                <tr>
                  <td className="font-bold text-[#30342F] p-2.5">Infrastructure Project Delay</td>
                  <td className="text-[#74796F] p-2.5">6-18 Months</td>
                  <td className="text-[#A7BEAE] font-bold p-2.5">2.4 Months</td>
                  <td className="font-bold text-[#B85042] p-2.5">₹ 300 Cr/yr capex savings</td>
                </tr>
                <tr>
                  <td className="font-bold text-[#30342F] p-2.5">Disaster Response Turnaround</td>
                  <td className="text-[#74796F] p-2.5">48-72 Hours</td>
                  <td className="text-[#A7BEAE] font-bold p-2.5">6.8 Hours</td>
                  <td className="font-bold text-[#B85042] p-2.5">Rapid Emergency Relief</td>
                </tr>
                <tr>
                  <td className="font-bold text-[#30342F] p-2.5">Fuel &amp; Routing Efficiency</td>
                  <td className="text-[#74796F] p-2.5">Suboptimal</td>
                  <td className="text-[#A7BEAE] font-bold p-2.5">18.6% Saved</td>
                  <td className="font-bold text-[#B85042] p-2.5">₹ 60 Cr/yr fuel savings</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 bg-[#E7E8D1] border-t border-[#D6D8C8] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-[#74796F] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#A7BEAE]" /> Complies with GFR 2017 &amp; MeitY Guidelines
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportExcel}
              className="btn-secondary text-xs py-2 px-3.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#A7BEAE]" /> Export Excel
            </button>
            <button
              onClick={handleExportPDF}
              className="btn-primary text-xs py-2 px-3.5 cursor-pointer shadow-command-card"
            >
              <FileText className="w-3.5 h-3.5 text-slate-900" /> Download Official PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
