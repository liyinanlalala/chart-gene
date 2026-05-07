import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'

// ── Mock data ─────────────────────────────────────────────────────────────────
// x = GMV完成率(%), y = 回比去年GMV(%), gmv = GMV(亿)
// symbolSize = √(gmv) × SCALE
const SCALE = 3.16

const REGION_DATA = [
  {
    name: '华东大区',
    x: 51.0,
    y: -9.0,
    gmv: 810,   // symbolSize ≈ 90  (largest)
    border: '#C9A227',
    fill: 'rgba(201,162,39,0.13)',
    labelPos: 'inside' as const,
  },
  {
    name: '华南大区',
    x: 53.7,    // near right-axis boundary → right side gets clipped
    y: -19.8,
    gmv: 560,   // symbolSize ≈ 75
    border: '#D97B3E',
    fill: 'rgba(217,123,62,0.13)',
    labelPos: 'inside' as const,
  },
  {
    name: '华西大区',
    x: 48.5,
    y: -12.5,
    gmv: 460,   // symbolSize ≈ 68
    border: '#2CBDB5',
    fill: 'rgba(44,189,181,0.13)',
    labelPos: 'inside' as const,
  },
  {
    name: '华北大区',
    x: 50.1,
    y: -5.2,
    gmv: 270,   // symbolSize ≈ 52  (small → label outside)
    border: '#4A6FC5',
    fill: 'rgba(74,111,197,0.13)',
    labelPos: 'right' as const,  // outside, right of bubble
  },
  {
    name: '云南大区',
    x: 47.2,
    y: -21.0,
    gmv: 130,   // symbolSize ≈ 36  (very small → label outside)
    border: '#9060A8',
    fill: 'rgba(144,96,168,0.10)',
    labelPos: 'left' as const,   // outside, left of bubble
  },
]

const DRILL_DIMENSIONS = ['大区', '省份', '城市']

export default function GmvBubbleChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const [dimension, setDimension] = useState('大区')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (!chartRef.current) return
    const chart = echarts.init(chartRef.current)

    const option: echarts.EChartsOption = {
      backgroundColor: '#fff',
      // top padding leaves room for the legend rendered in JSX above the chart
      grid: { left: 72, right: 20, top: 16, bottom: 56 },

      xAxis: {
        type: 'value',
        name: 'GMV 完成率',
        nameLocation: 'middle',
        nameGap: 36,
        // Whitelist: only show 48.0%, 50.0%, 52.0%
        // min=46 anchors interval ticks at multiples of 2; boundary labels
        // at 46 and 53.8 are suppressed by the whitelist formatter.
        min: 46,
        max: 53.8,
        interval: 2,
        axisLabel: {
          formatter: (v: number) =>
            [48, 50, 52].includes(Math.round(v)) ? `${v.toFixed(1)}%` : '',
          fontSize: 11,
          color: '#888',
        },
        splitLine: { lineStyle: { color: '#eee' } },
        axisLine: { show: false },
        axisTick: { show: false },
      },

      yAxis: {
        type: 'value',
        name: '回比去年GMV',
        nameLocation: 'middle',
        nameGap: 56,
        nameTextStyle: { fontSize: 12, color: '#555' },
        // Whitelist: only show -5.0%, -10.0%, -15.0%, -20.0%
        // min=-25 anchors interval ticks at multiples of 5; max=-3.5 gives
        // space above 华北大区 bubble and lets the boundary split-line act
        // as the chart's top border (matching the original layout).
        min: -25,
        max: -3.5,
        interval: 5,
        axisLabel: {
          formatter: (v: number) =>
            [-5, -10, -15, -20].includes(Math.round(v)) ? `${v.toFixed(1)}%` : '',
          fontSize: 11,
          color: '#888',
        },
        splitLine: { lineStyle: { color: '#eee' } },
        axisLine: { show: false },
        axisTick: { show: false },
      },

      tooltip: {
        trigger: 'item',
        formatter: (params: echarts.DefaultLabelFormatterCallbackParams) => {
          const d = params.data as number[]
          return [
            `<b>${params.seriesName}</b>`,
            `GMV完成率：${d[0].toFixed(1)}%`,
            `回比去年GMV：${d[1].toFixed(1)}%`,
            `GMV：${d[2]}亿`,
          ].join('<br/>')
        },
      },

      series: REGION_DATA.map(d => ({
        type: 'scatter',
        name: d.name,
        // clip: true (default) — symbols that extend beyond the axis boundary
        // are naturally clipped at the grid edge (produces the 华南大区 overflow effect)
        symbolSize: (val: number[]) => Math.sqrt(val[2]) * SCALE,
        itemStyle: {
          color: d.fill,         // very light fill
          borderColor: d.border, // prominent stroke
          borderWidth: 2,
          opacity: 1,
        },
        label: {
          show: true,
          formatter: d.name,
          fontSize: 12,
          color: d.border,
          position: d.labelPos,
          distance: d.labelPos === 'inside' ? 0 : 6,
        },
        data: [[d.x, d.y, d.gmv]],
      })),
    }

    chart.setOption(option)

    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(chartRef.current!)
    return () => {
      ro.disconnect()
      chart.dispose()
    }
  }, [])

  return (
    // No card shadow — direct white background, matching original
    <div style={{ background: '#fff', padding: '20px 24px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#222' }}>下钻分析</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#888' }}>下钻维度</span>
          <select value={dimension} onChange={e => setDimension(e.target.value)} style={selectStyle}>
            {DRILL_DIMENSIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ ...selectStyle, color: filter ? '#222' : '#bbb' }}
          >
            <option value="">请选择</option>
            {REGION_DATA.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
        </div>
      </div>

      {/* ── Subtitle ── */}
      <div style={{ fontSize: 13, color: '#555', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
        GMV气泡图
        <span style={{ fontSize: 11, color: '#aaa', cursor: 'default' }}>ⓘ</span>
      </div>

      {/* ── Legend (JSX, not ECharts) — matches original layout ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 4, paddingLeft: 72 }}>
        {REGION_DATA.map(d => (
          <span key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}>
            <span style={{
              display: 'inline-block',
              width: 9, height: 9,
              borderRadius: '50%',
              background: d.border,
            }} />
            {d.name}
          </span>
        ))}
      </div>

      {/* ── Chart ── */}
      <div ref={chartRef} style={{ width: '100%', height: 460 }} />
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  height: 30,
  padding: '0 24px 0 8px',
  border: '1px solid #d9d9d9',
  borderRadius: 4,
  fontSize: 13,
  color: '#222',
  background: '#fff',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'auto',
}
