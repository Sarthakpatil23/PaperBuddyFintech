import React, { useState } from 'react';
import { 
  PieChart, 
  CreditCard, 
  TrendingUp, 
  Filter,
  BarChart2,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  CHART_REVENUE_BY_FEE_TYPE, 
  CHART_PAYMENT_METHODS, 
  CHART_CLASS_COLLECTION 
} from '../data/mockData';

export default function RevenueCharts({ onFilterByFeeType }) {
  const [granularity, setGranularity] = useState('daily'); // 'daily' | 'weekly'
  const [activeSlice, setActiveSlice] = useState(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Daily vs Weekly trend datasets
  const dailyData = [
    { label: 'Jul 16', amount: 180000 },
    { label: 'Jul 17', amount: 220000 },
    { label: 'Jul 18', amount: 195000 },
    { label: 'Jul 19', amount: 310000 },
    { label: 'Jul 20', amount: 240000 },
    { label: 'Jul 21', amount: 155000 },
    { label: 'Jul 22', amount: 185000 },
  ];

  const weeklyData = [
    { label: 'W1 (Jun)', amount: 1240000 },
    { label: 'W2 (Jul)', amount: 1580000 },
    { label: 'W3 (Jul)', amount: 1890000 },
    { label: 'W4 (Jul)', amount: 1485000 },
  ];

  const activeTrendData = granularity === 'daily' ? dailyData : weeklyData;
  const maxTrendAmount = Math.max(...activeTrendData.map((d) => d.amount));

  // Handler: Donut Slice Selection
  const handleFeeSliceClick = (feeName) => {
    if (activeSlice === feeName) {
      setActiveSlice(null);
      if (onFilterByFeeType) onFilterByFeeType(null);
    } else {
      setActiveSlice(feeName);
      if (onFilterByFeeType) onFilterByFeeType(feeName);
    }
  };

  // SVG Donut Math (Larger 180px viewBox 0 0 180 180)
  const totalVal = CHART_REVENUE_BY_FEE_TYPE.reduce((acc, c) => acc + c.value, 0);
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const donutSlices = CHART_REVENUE_BY_FEE_TYPE.map((item) => {
    const slicePercent = item.value / totalVal;
    const startPercent = cumulativePercent;
    cumulativePercent += slicePercent;
    const endPercent = cumulativePercent;

    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);
    const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

    const pathData = [
      `M ${startX * 65 + 90} ${startY * 65 + 90}`,
      `A 65 65 0 ${largeArcFlag} 1 ${endX * 65 + 90} ${endY * 65 + 90}`,
    ].join(' ');

    return {
      ...item,
      pathData,
      slicePercent
    };
  });

  const displaySlice = hoveredSlice || CHART_REVENUE_BY_FEE_TYPE.find((s) => s.name === activeSlice);

  return (
    <div className="dashboard-section-card">
      <div className="section-card-header">
        <div className="section-card-title">
          <PieChart size={22} style={{ color: 'var(--odoo-purple)' }} />
          <div>
            <h2>Revenue Breakdown & Financial Charts</h2>
            <p>Interactive Donut chart fee analysis & collection trend velocity graph</p>
          </div>
        </div>

        {activeSlice && (
          <button 
            className="action-btn-secondary"
            onClick={() => { setActiveSlice(null); onFilterByFeeType(null); }}
          >
            <Filter size={14} />
            <span>Clear Filter: {activeSlice}</span>
          </button>
        )}
      </div>

      <div className="charts-grid">
        {/* Graph 1: Enlarged & Interactive SVG Donut Chart */}
        <div className="chart-box" style={{ background: 'white', padding: '24px' }}>
          <div className="chart-header">
            <span className="chart-title">Revenue by Fee Category (Interactive Donut)</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hover or click slice to inspect</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap', paddingTop: '16px' }}>
            {/* Larger 180px SVG Donut */}
            <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}>
              <svg viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%', overflow: 'visible' }}>
                {donutSlices.map((slice) => {
                  const isHovered = hoveredSlice?.name === slice.name;
                  const isActive = activeSlice === slice.name;
                  const strokeW = isHovered || isActive ? 24 : 18;

                  return (
                    <path
                      key={slice.name}
                      d={slice.pathData}
                      fill="none"
                      stroke={slice.color}
                      strokeWidth={strokeW}
                      strokeLinecap="round"
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: isHovered || isActive ? `drop-shadow(0 4px 10px ${slice.color}66)` : 'none',
                        opacity: (activeSlice || hoveredSlice) && !(isHovered || isActive) ? 0.35 : 1
                      }}
                      onMouseEnter={() => setHoveredSlice(slice)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      onClick={() => handleFeeSliceClick(slice.name)}
                    />
                  );
                })}
              </svg>

              {/* Dynamic Center Label */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  textAlign: 'center',
                  padding: '10px'
                }}
              >
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {displaySlice ? displaySlice.name : 'TOTAL REVENUE'}
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: displaySlice ? displaySlice.color : 'var(--text-main)', marginTop: '2px' }}>
                  {displaySlice ? `₹${(displaySlice.value).toLocaleString('en-IN')}` : `₹${(totalVal).toLocaleString('en-IN')}`}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {displaySlice ? `${displaySlice.percentage} of Total` : '100% Collected'}
                </span>
              </div>
            </div>

            {/* Interactive Legend List */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {CHART_REVENUE_BY_FEE_TYPE.map((item) => {
                const isActive = activeSlice === item.name || hoveredSlice?.name === item.name;
                return (
                  <div 
                    key={item.name}
                    onMouseEnter={() => setHoveredSlice(item)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    onClick={() => handleFeeSliceClick(item.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: isActive ? 'var(--odoo-purple-light)' : 'var(--bg-canvas)',
                      border: isActive ? '1px solid var(--odoo-purple)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      fontSize: '0.86rem',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }} />
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      ₹{(item.value / 1000).toFixed(0)}k <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 500 }}>({item.percentage})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Graph 2: 7-Day Revenue Velocity (Interactive Trend Bar Graph) */}
        <div className="chart-box" style={{ background: 'white', padding: '24px' }}>
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} style={{ color: 'var(--accent-blue-text)' }} />
              <span className="chart-title">Revenue Velocity Trend Graph</span>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                className="time-range-toggle-btn"
                style={{ 
                  background: granularity === 'daily' ? 'var(--odoo-purple)' : 'transparent', 
                  color: granularity === 'daily' ? 'white' : 'inherit',
                  padding: '4px 10px'
                }}
                onClick={() => setGranularity('daily')}
              >
                Daily (7D)
              </button>
              <button 
                className="time-range-toggle-btn"
                style={{ 
                  background: granularity === 'weekly' ? 'var(--odoo-purple)' : 'transparent', 
                  color: granularity === 'weekly' ? 'white' : 'inherit',
                  padding: '4px 10px'
                }}
                onClick={() => setGranularity('weekly')}
              >
                Weekly (4W)
              </button>
            </div>
          </div>

          {/* Interactive Vertical Bar Graph */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', height: '170px', padding: '10px 0 0 0', borderBottom: '1.5px solid var(--border-color)' }}>
              {activeTrendData.map((point) => {
                const heightPct = Math.round((point.amount / maxTrendAmount) * 100);
                const isHovered = hoveredBar?.label === point.label;

                return (
                  <div 
                    key={point.label} 
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative' }}
                    onMouseEnter={() => setHoveredBar(point)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Hover Tooltip Pill */}
                    {isHovered && (
                      <div 
                        style={{
                          position: 'absolute',
                          bottom: `${Math.min(heightPct + 12, 85)}%`,
                          background: '#0F172A',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          zIndex: 20,
                          boxShadow: 'var(--shadow-md)',
                          animation: 'fadeInDown 0.15s ease-out'
                        }}
                      >
                        ₹{(point.amount).toLocaleString('en-IN')}
                      </div>
                    )}

                    {/* Bar Pill */}
                    <div 
                      style={{ 
                        width: '100%', 
                        maxWidth: '44px',
                        height: `${Math.max(heightPct, 15)}%`, 
                        background: isHovered 
                          ? 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)' 
                          : 'linear-gradient(180deg, var(--odoo-purple) 0%, #5B3C53 100%)',
                        borderRadius: '8px 8px 0 0',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        boxShadow: isHovered ? '0 6px 16px rgba(2, 132, 199, 0.4)' : 'none',
                        transform: isHovered ? 'scaleY(1.04)' : 'none',
                        transformOrigin: 'bottom'
                      }} 
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis Labels */}
            <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
              {activeTrendData.map((point) => (
                <div key={point.label} style={{ flex: 1, textAlign: 'center', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {point.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graph 3: Grade-wise Collection Status Bar Graph */}
        <div className="chart-box" style={{ background: 'white', padding: '24px' }}>
          <div className="chart-header">
            <span className="chart-title">Grade-wise Collection & Dues Comparison</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Collected vs Outstanding</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '10px' }}>
            {CHART_CLASS_COLLECTION.map((cg) => {
              const maxVal = 460000;
              const collectedWidth = Math.round((cg.collected / maxVal) * 100);
              const pendingWidth = Math.round((cg.pending / maxVal) * 100);

              return (
                <div key={cg.classGrade} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>{cg.classGrade}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Collected: ₹{(cg.collected / 1000).toFixed(0)}k | Due: ₹{(cg.pending / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div style={{ height: '12px', background: '#E2E8F0', borderRadius: 'var(--radius-pill)', display: 'flex', overflow: 'hidden' }}>
                    <div style={{ width: `${collectedWidth}%`, background: 'var(--odoo-purple)', height: '100%' }} title={`Collected: ₹${cg.collected}`} />
                    <div style={{ width: `${pendingWidth}%`, background: 'var(--accent-blue)', height: '100%' }} title={`Pending: ₹${cg.pending}`} />
                  </div>
                </div>
              );
            })}

            <div style={{ display: 'flex', gap: '18px', justifyContent: 'center', marginTop: '8px', fontSize: '0.78rem', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--odoo-purple)' }} />
                Collected Amount
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--accent-blue)' }} />
                Outstanding Dues
              </span>
            </div>
          </div>
        </div>

        {/* Graph 4: Payment Method Mix Bar Graph */}
        <div className="chart-box" style={{ background: 'white', padding: '24px' }}>
          <div className="chart-header">
            <span className="chart-title">Payment Method Share</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-blue-text)', fontWeight: 600 }}>
              Zero-Fee UPI Dominance
            </span>
          </div>

          <div className="custom-bar-list" style={{ paddingTop: '10px' }}>
            {CHART_PAYMENT_METHODS.map((pm) => (
              <div key={pm.method} className="bar-item">
                <div className="bar-item-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={15} style={{ color: 'var(--accent-blue-text)' }} />
                    {pm.method}
                  </span>
                  <span>₹{(pm.amount).toLocaleString('en-IN')} ({pm.percentage})</span>
                </div>
                <div className="bar-track" style={{ height: '12px' }}>
                  <div 
                    className="bar-fill-blue"
                    style={{ width: pm.percentage }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
