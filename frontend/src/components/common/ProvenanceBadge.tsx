import React from 'react';
import type { VerificationStatus } from '../../types';
import { ShieldCheck, Sparkles, Radio, CheckCircle2, FlaskConical } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface ProvenanceBadgeProps {
  status?: VerificationStatus;
  source?: string;
  observedAt?: string;
  confidence?: number;
  dataItem?: any;
  showInspectorOnClick?: boolean;
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  status = 'OBSERVED',
  source,
  confidence,
  dataItem,
  showInspectorOnClick = true,
  className = ''
}) => {
  const { openProvenanceModal } = usePlatform();

  const handleClick = (e: React.MouseEvent) => {
    if (showInspectorOnClick && dataItem) {
      e.stopPropagation();
      openProvenanceModal(dataItem);
    }
  };

  const getBadgeConfig = () => {
    switch (status) {
      case 'OBSERVED':
        return {
          label: 'OBSERVED',
          bg: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
          icon: <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />,
          desc: 'Verified Ground Sensor / Official Station'
        };
      case 'PREDICTED':
        return {
          label: confidence ? `AI PREDICTED (${confidence.toFixed(1)}%)` : 'AI PREDICTED',
          bg: 'bg-purple-500/15 text-purple-700 border-purple-500/30',
          icon: <Sparkles className="w-3 h-3 text-purple-600" />,
          desc: 'Evaluated Baseline Model (98.7% Accuracy)'
        };

      case 'REPORTED':
        return {
          label: 'REPORTED',
          bg: 'bg-sky-500/15 text-sky-700 border-sky-500/30',
          icon: <Radio className="w-3 h-3 text-sky-600" />,
          desc: 'Field Inspector Telemetry'
        };
      case 'VERIFIED':
        return {
          label: 'VERIFIED',
          bg: 'bg-teal-500/15 text-teal-700 border-teal-500/30',
          icon: <ShieldCheck className="w-3 h-3 text-teal-600" />,
          desc: 'Authority Verified Ground Truth'
        };
      case 'SIMULATED':
      default:
        return {
          label: 'SIMULATED / DEMO',
          bg: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
          icon: <FlaskConical className="w-3 h-3 text-amber-600" />,
          desc: 'Synthetic Simulation / Demo Telemetry'
        };
    }
  };

  const cfg = getBadgeConfig();

  return (
    <span
      onClick={handleClick}
      title={`${cfg.desc} ${source ? `• Source: ${source}` : ''} • Click to Inspect Provenance`}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border transition-all ${cfg.bg} ${showInspectorOnClick && dataItem ? 'cursor-pointer hover:scale-105 shadow-2xs' : ''} ${className}`}
    >
      {cfg.icon}
      <span>{cfg.label}</span>
    </span>
  );
};
