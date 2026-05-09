import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const months = [
  '2025.01', '2025.02', '2025.03', '2025.04', '2025.05', '2025.06',
  '2025.07', '2025.08', '2025.09', '2025.10', '2025.11', '2025.12',
]

const barData = [2380, 2180, 2050, 1650, 1550, 1320, 1560, 1850, 2180, 2380, 2620, 2980]
const lineData = [1450, 1480, 1820, 2320, 2600, 2780, 2250, 2100, 3080, 3350, 4050, 4120]

function ContentChannelOrderChart() {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return
    const chart = echarts.init(chartRef.current)

    chart.setOption({
      grid: { left: 48, right: 24, top: 32, bottom: 36 },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLine: { lineStyle: { color: '#E5E6EB' } },
        axisTick: { show: false },
        axisLabel: { color: '#86909C', fontSize: 12 },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 5000,
        interval: 1000,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#F2F3F5', type: 'dashed' } },
        axisLabel: { color: '#86909C', fontSize: 12 },
      },
      series: [
        {
          name: '订单数',
          type: 'bar',
          data: barData,
          barWidth: 18,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#4E8BFF' },
              { offset: 1, color: '#7EB0FF' },
            ]),
            borderRadius: [3, 3, 0, 0],
          },
        },
        {
          name: '趋势',
          type: 'line',
          smooth: true,
          data: lineData,
          symbol: 'none',
          lineStyle: { color: '#F6C445', width: 3 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(246, 196, 69, 0.28)' },
              { offset: 1, color: 'rgba(246, 196, 69, 0)' },
            ]),
          },
          z: 3,
        },
      ],
    })

    const onResize = () => chart.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      chart.dispose()
    }
  }, [])

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: '20px 24px 16px',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          padding: '2px 8px',
          borderRadius: 4,
          background: 'linear-gradient(90deg, #AA3BFF 0%, #5391FF 100%)',
          color: '#fff',
          fontSize: 11,
          lineHeight: '16px',
          fontFamily: 'PingFang SC, system-ui',
          fontWeight: 500,
          letterSpacing: 0.2,
        }}
      >
        基于图片生成
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, color: '#1D2129' }}>
          25年按月内容渠道订单总数据
        </span>
        <span
          style={{
            color: '#86909C',
            fontSize: 16,
            lineHeight: 1,
            cursor: 'pointer',
          }}
          aria-hidden
        >
          ›
        </span>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: 220 }} />
    </div>
  )
}

export default ContentChannelOrderChart
