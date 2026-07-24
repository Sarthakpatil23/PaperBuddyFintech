import React, { useState } from 'react';
import { 
  PieChart, 
  CreditCard, 
  TrendingUp, 
  Filter,
  BarChart2,
  Sparkles,
  Info,
  ArrowUpRight,
  QrCode,
  Banknote,
  FileText,
  Zap,
  Layers,
  Award,
  Download
} from 'lucide-react';
import { 
  CHART_REVENUE_BY_FEE_TYPE, 
  CHART_PAYMENT_METHODS, 
  CHART_CLASS_COLLECTION 
} from '../data/mockData';

export default function RevenueCharts({ onFilterByFeeType }) {
  const [granularity, setGranularity] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
  const [activeSlice, setActiveSlice] = useState(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [gradeSort, setGradeSort] = useState('default'); // 'default' | 'dues'

  // Dynamic Trend Datasets
  const dailyData = [
    { label: 'Jul 16', amount: 180000, txns: 34, target: 200000 },
    { label: 'Jul 17', amount: 220000, txns: 48, target: 200000 },
    { label: 'Jul 18', amount: 195000, txns: 38, target: 200000 },
    { label: 'Jul 19', amount: 310000, txns: 62, target: 200000, isPeak: true },
    { label: 'Jul 20', amount: 240000, txns: 51, target: 200000 },
    { label: 'Jul 21', amount: 155000, txns: 29, target: 200000 },
    { label: 'Jul 22', amount: 185000, txns: 42, target: 200000 },
  ];

  const weeklyData = [
    { label: 'W1 (Jun)', amount: 1240000, txns: 210, target: 1500000 },
    { label: 'W2 (Jul)', amount: 1580000, txns: 295, target: 1500000 },
    { label: 'W3 (Jul)', amount: 1890000, txns: 340, target: 1500000, isPeak: true },
    { label: 'W4 (Jul)', amount: 1485000, txns: 284, target: 1500000 },
  ];

  const monthlyData = [
    { label: 'Feb 26', amount: 1120000, txns: 190 },
    { label: 'Mar 26', amount: 1450000, txns: 260 },
    { label: 'Apr 26', amount: 2180000, txns: 410, isPeak: true },
    { label: 'May 26', amount: 1340000, txns: 225 },
    { label: 'Jun 26', amount: 1690000, txns: 310 },
    { label: 'Jul 26', amount: 1485000, txns: 284 },
  ];

  const getActiveTrendData = () => {
    if (granularity === 'weekly') return weeklyData;
    if (granularity === 'monthly') return monthlyData;
    return dailyData;
  };

  const activeTrendData = getActiveTrendData();
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

  // SVG Donut Math (viewBox 0 0 200 200, Radius 75)
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
      `M ${startX * 82 + 110} ${startY * 82 + 110}`,
      `A 82 82 0 ${largeArcFlag} 1 ${endX * 82 + 110} ${endY * 82 + 110}`,
    ].join(' ');

    return {
      ...item,
      pathData,
      slicePercent
    };
  });

  const displaySlice = hoveredSlice || CHART_REVENUE_BY_FEE_TYPE.find((s) => s.name === activeSlice);

  // Grade Data Sorting
  const sortedGradeData = [...CHART_CLASS_COLLECTION].sort((a, b) => {
    if (gradeSort === 'dues') return b.pending - a.pending;
    return 0; // Default order Grade 12 down
  });

  const totalGradeCollected = CHART_CLASS_COLLECTION.reduce((sum, g) => sum + g.collected, 0);
  const totalGradePending = CHART_CLASS_COLLECTION.reduce((sum, g) => sum + g.pending, 0);

  return (
    <div className="dashboard-section-card">
      {/* Section Header */}
      <div className="section-card-header">
        <div className="section-card-title">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--odoo-purple-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--odoo-purple)',
            flexShrink: 0
          }}>
            <PieChart size={22} />
          </div>
          <div>
            <h2>Revenue Breakdown & Financial Intelligence</h2>
            <p>Interactive fee distribution, velocity trends, grade collection & payment method breakdown</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {activeSlice && (
            <button 
              className="action-btn-secondary"
              onClick={() => { setActiveSlice(null); onFilterByFeeType(null); }}
              style={{ borderColor: 'var(--odoo-purple)', color: 'var(--odoo-purple)' }}
            >
              <Filter size={14} />
              <span>Clear Filter: <strong>{activeSlice}</strong></span>
            </button>
          )}

          <button 
            className="action-btn-secondary"
            onClick={() => alert("Financial Summary Report exported successfully (CSV/PDF).")}
            title="Export chart dataset"
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Top Financial KPI Summary Ribbon */}
      <div className="financial-kpi-ribbon">
        <div className="kpi-pill-card">
          <div className="kpi-icon-box purple">
            <Award size={20} />
          </div>
          <div className="kpi-meta-content">
            <span className="kpi-label-text">Total MTD Revenue</span>
            <span className="kpi-value-text">₹{(totalVal).toLocaleString('en-IN')}</span>
            <span className="kpi-subtext">
              <ArrowUpRight size={12} /> +14.2% vs last month
            </span>
          </div>
        </div>

        <div className="kpi-pill-card">
          <div className="kpi-icon-box blue">
            <TrendingUp size={20} />
          </div>
          <div className="kpi-meta-content">
            <span className="kpi-label-text">Daily Avg Velocity</span>
            <span className="kpi-value-text">₹2,12,142 / day</span>
            <span className="kpi-subtext" style={{ color: 'var(--accent-blue-text)' }}>
              Target: ₹2.00L/day (106%)
            </span>
          </div>
        </div>

        <div className="kpi-pill-card">
          <div className="kpi-icon-box indigo">
            <Layers size={20} />
          </div>
          <div className="kpi-meta-content">
            <span className="kpi-label-text">Top Revenue Driver</span>
            <span className="kpi-value-text">Tuition Fee (62%)</span>
            <span className="kpi-subtext" style={{ color: 'var(--accent-indigo)' }}>
              ₹9,20,000 collected
            </span>
          </div>
        </div>

        <div className="kpi-pill-card">
          <div className="kpi-icon-box amber">
            <Zap size={20} />
          </div>
          <div className="kpi-meta-content">
            <span className="kpi-label-text">Digital Payment Mix</span>
            <span className="kpi-value-text">60% UPI Direct</span>
            <span className="kpi-subtext" style={{ color: '#D97706' }}>
              Saved ₹42.5k Gateway Fee
            </span>
          </div>
        </div>
      </div>

      {/* 2x2 Interactive Charts Grid */}
      <div className="charts-grid">
        
        {/* CHART 1: Interactive Fee Category SVG Donut */}
        <div className="chart-box">
          <div className="chart-header">
            <div>
              <span className="chart-title">Fee Category Distribution</span>
              <div className="chart-subtitle">Click or hover slice to filter breakdown</div>
            </div>
            {activeSlice && (
              <span className="badge badge-paid" style={{ fontSize: '0.72rem' }}>
                Filtered: {activeSlice}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap', flex: 1 }}>
            {/* SVG Donut */}
            <div style={{ position: 'relative', width: '210px', height: '210px', flexShrink: 0, margin: '0 auto' }}>
              <svg viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%', overflow: 'visible' }}>
                {donutSlices.map((slice) => {
                  const isHovered = hoveredSlice?.name === slice.name;
                  const isActive = activeSlice === slice.name;
                  const strokeW = isHovered || isActive ? 18 : 14;

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
                        filter: isHovered || isActive ? `drop-shadow(0 6px 14px ${slice.color}88)` : 'none',
                        opacity: (activeSlice || hoveredSlice) && !(isHovered || isActive) ? 0.35 : 1
                      }}
                      onMouseEnter={() => setHoveredSlice(slice)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      onClick={() => handleFeeSliceClick(slice.name)}
                    />
                  );
                })}
              </svg>

              {/* Dynamic Donut Center Label */}
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  textAlign: 'center',
                  padding: '4px',
                  zIndex: 10
                }}
              >
                <span style={{ 
                  fontSize: '0.65rem', 
                  color: 'var(--text-muted)', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.04em',
                  maxWidth: '115px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {displaySlice ? displaySlice.name : 'TOTAL REVENUE'}
                </span>
                <span style={{ 
                  fontSize: '1.15rem', 
                  fontWeight: 800, 
                  color: displaySlice ? displaySlice.color : 'var(--text-main)', 
                  marginTop: '1px',
                  marginBottom: '1px',
                  lineHeight: 1.15
                }}>
                  {displaySlice ? `₹${(displaySlice.value).toLocaleString('en-IN')}` : `₹${(totalVal).toLocaleString('en-IN')}`}
                </span>
                <span style={{ 
                  fontSize: '0.72rem', 
                  fontWeight: 600, 
                  color: 'var(--text-secondary)' 
                }}>
                  {displaySlice ? `${displaySlice.percentage} of Total` : '100% Collected'}
                </span>
              </div>
            </div>

            {/* Legend List */}
            <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {CHART_REVENUE_BY_FEE_TYPE.map((item) => {
                const isActive = activeSlice === item.name || hoveredSlice?.name === item.name;
                return (
                  <div 
                    key={item.name}
                    className={`donut-legend-item ${isActive ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredSlice(item)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    onClick={() => handleFeeSliceClick(item.name)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color, boxShadow: `0 0 8px ${item.color}66` }} />
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{(item.value / 1000).toFixed(0)}k</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.percentage}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CHART 2: Revenue Velocity Trend Bar Graph */}
        <div className="chart-box">
          <div className="chart-header">
            <div className="chart-title-group">
              <TrendingUp size={18} style={{ color: 'var(--accent-blue-text)' }} />
              <div>
                <span className="chart-title">Revenue Velocity Trend</span>
                <div className="chart-subtitle">Collection flow & daily target baseline</div>
              </div>
            </div>

            <div className="granularity-btn-group">
              <button 
                className={`granularity-btn ${granularity === 'daily' ? 'active' : ''}`}
                onClick={() => setGranularity('daily')}
              >
                7 Days
              </button>
              <button 
                className={`granularity-btn ${granularity === 'weekly' ? 'active' : ''}`}
                onClick={() => setGranularity('weekly')}
              >
                4 Weeks
              </button>
              <button 
                className={`granularity-btn ${granularity === 'monthly' ? 'active' : ''}`}
                onClick={() => setGranularity('monthly')}
              >
                6 Months
              </button>
            </div>
          </div>

          {/* Interactive Bar Chart Container */}
          <div style={{ marginTop: '10px', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            
            {/* Target Baseline Line for Daily view */}
            {granularity === 'daily' && (
              <div className="benchmark-line-container">
                <span className="benchmark-line-tag">Daily Target ₹2.00L</span>
              </div>
            )}

            {/* Vertical Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', height: '170px', padding: '10px 0 0 0', borderBottom: '1.5px solid var(--border-color)', position: 'relative', zIndex: 10 }}>
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
                    {/* Hover Floating Tooltip */}
                    {isHovered && (
                      <div 
                        style={{
                          position: 'absolute',
                          bottom: `${Math.min(heightPct + 14, 88)}%`,
                          background: 'var(--text-main)',
                          color: 'var(--surface-card)',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          zIndex: 30,
                          boxShadow: 'var(--shadow-md)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          alignItems: 'center'
                        }}
                      >
                        <span>₹{(point.amount).toLocaleString('en-IN')}</span>
                        {point.txns && (
                          <span style={{ fontSize: '0.68rem', opacity: 0.85, fontWeight: 500 }}>
                            {point.txns} Transactions
                          </span>
                        )}
                      </div>
                    )}

                    {/* Peak Day Badge */}
                    {point.isPeak && !isHovered && (
                      <span 
                        style={{
                          position: 'absolute',
                          top: `${100 - heightPct - 18}%`,
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          color: 'var(--accent-blue-text)',
                          background: 'var(--accent-blue-light)',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Peak 🔥
                      </span>
                    )}

                    {/* Bar Element */}
                    <div 
                      style={{ 
                        width: '100%', 
                        maxWidth: '46px',
                        height: `${Math.max(heightPct, 12)}%`, 
                        background: isHovered 
                          ? 'linear-gradient(180deg, var(--accent-blue) 0%, var(--accent-blue-hover) 100%)' 
                          : point.isPeak
                          ? 'linear-gradient(180deg, #0284C7 0%, var(--odoo-purple) 100%)'
                          : 'linear-gradient(180deg, var(--odoo-purple) 0%, var(--odoo-purple-hover) 100%)',
                        borderRadius: '8px 8px 0 0',
                        transition: 'all 0.22s ease',
                        cursor: 'pointer',
                        boxShadow: isHovered ? '0 8px 18px rgba(2, 132, 199, 0.45)' : 'none',
                        transform: isHovered ? 'scaleY(1.05)' : 'none',
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
                <div 
                  key={point.label} 
                  style={{ 
                    flex: 1, 
                    textAlign: 'center', 
                    fontSize: '0.78rem', 
                    fontWeight: hoveredBar?.label === point.label ? 700 : 600, 
                    color: hoveredBar?.label === point.label ? 'var(--odoo-purple)' : 'var(--text-secondary)',
                    transition: 'color 0.15s ease'
                  }}
                >
                  {point.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART 3: Grade-wise Collection & Dues Comparison */}
        <div className="chart-box">
          <div className="chart-header">
            <div>
              <span className="chart-title">Grade-wise Collection & Outstanding</span>
              <div className="chart-subtitle">Collected (Purple) vs Outstanding Dues (Blue)</div>
            </div>

            <button 
              className="time-range-toggle-btn"
              onClick={() => setGradeSort(gradeSort === 'default' ? 'dues' : 'default')}
              style={{ fontSize: '0.74rem', padding: '3px 8px' }}
            >
              {gradeSort === 'dues' ? 'Sorted by Highest Dues' : 'Sort by Dues'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
            {sortedGradeData.map((cg) => {
              const maxVal = 460000;
              const collectedWidth = Math.round((cg.collected / maxVal) * 100);
              const pendingWidth = Math.round((cg.pending / maxVal) * 100);
              const totalValGrade = cg.collected + cg.pending;
              const paidPct = ((cg.collected / totalValGrade) * 100).toFixed(0);

              return (
                <div key={cg.classGrade} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-main)' }}>{cg.classGrade}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Collected: <strong>₹{(cg.collected / 1000).toFixed(0)}k</strong> | Due: <strong style={{ color: 'var(--accent-blue-text)' }}>₹{(cg.pending / 1000).toFixed(0)}k</strong> ({paidPct}% Paid)
                    </span>
                  </div>
                  
                  <div className="bar-track" style={{ height: '12px' }}>
                    <div 
                      style={{ 
                        width: `${collectedWidth}%`, 
                        background: 'var(--odoo-purple)', 
                        height: '100%'
                      }} 
                      title={`${cg.classGrade} Collected: ₹${cg.collected}`} 
                    />
                    <div 
                      style={{ 
                        width: `${pendingWidth}%`, 
                        background: 'var(--accent-blue)', 
                        height: '100%'
                      }} 
                      title={`${cg.classGrade} Pending: ₹${cg.pending}`} 
                    />
                  </div>
                </div>
              );
            })}

            {/* Legend & Summary Row */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginTop: '10px', 
              paddingTop: '10px', 
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', gap: '16px', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--odoo-purple)' }} />
                  Collected (₹{(totalGradeCollected / 100000).toFixed(2)}L)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--accent-blue)' }} />
                  Outstanding Dues (₹{(totalGradePending / 100000).toFixed(2)}L)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CHART 4: Payment Method Mix & Zero-Fee UPI Dominance */}
        <div className="chart-box">
          <div className="chart-header">
            <div>
              <span className="chart-title">Payment Method Share</span>
              <div className="chart-subtitle">Channel distribution & transaction velocity</div>
            </div>
            <span className="badge badge-paid" style={{ fontSize: '0.72rem' }}>
              60% UPI Direct
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            <div className="custom-bar-list">
              {CHART_PAYMENT_METHODS.map((pm) => {
                const isUPI = pm.method.includes('UPI');
                const isCash = pm.method.includes('Cash');
                
                return (
                  <div key={pm.method} className="bar-item">
                    <div className="bar-item-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isUPI && <QrCode size={16} style={{ color: 'var(--odoo-purple)' }} />}
                        {isCash && <Banknote size={16} style={{ color: 'var(--accent-blue-text)' }} />}
                        {!isUPI && !isCash && <FileText size={16} style={{ color: 'var(--text-muted)' }} />}
                        <span>{pm.method}</span>
                      </span>
                      <span>
                        <strong>₹{(pm.amount).toLocaleString('en-IN')}</strong> 
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginLeft: '6px' }}>({pm.percentage})</span>
                      </span>
                    </div>
                    <div className="bar-track" style={{ height: '12px' }}>
                      <div 
                        style={{ 
                          width: pm.percentage,
                          background: isUPI 
                            ? 'linear-gradient(90deg, var(--odoo-purple) 0%, #A855F7 100%)' 
                            : isCash 
                            ? 'linear-gradient(90deg, var(--accent-blue) 0%, #38BDF8 100%)'
                            : 'linear-gradient(90deg, #64748B 0%, #94A3B8 100%)',
                          height: '100%',
                          borderRadius: 'var(--radius-pill)'
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* UPI Insights Banner */}
            <div className="upi-insights-banner">
              <Zap size={22} style={{ color: 'var(--odoo-purple)', flexShrink: 0 }} />
              <div className="upi-insights-banner-text">
                <strong>Zero Gateway Fee Savings:</strong> 284 payments (60%) processed via zero-fee UPI QR rail. Estimated <strong>₹42,500 saved</strong> in gateway commission fees this month.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
