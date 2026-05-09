import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const months = [
  '2025.01', '2025.02', '2025.03', '2025.04', '2025.05', '2025.06',
  '2025.07', '2025.08', '2025.09', '2025.10', '2025.11', '2025.12',
]

const barData = [3120, 2770, 2475, 2280, 1930, 1635, 1385, 1735, 2130, 1820, 2050, 2390]

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 14.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13Zm0 1A7.5 7.5 0 1 0 8 .5a7.5 7.5 0 0 0 0 15Z"
        fill="#4C5A75"
      />
      <path d="M7.25 6.75h1.5v5h-1.5v-5Zm0-2.25h1.5v1.5h-1.5V4.5Z" fill="#4C5A75" />
    </svg>
  )
}

export default function MonthlyOrderChart() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const existing = echarts.getInstanceByDom(ref.current)
    const chart = existing ?? echarts.init(ref.current)

    chart.setOption({
      grid: { left: 48, right: 24, top: 16, bottom: 32, containLabel: false },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: 'rgba(16, 34, 71, 0.08)',
        textStyle: { color: '#102247', fontSize: 12 },
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLine: { lineStyle: { color: 'rgba(16, 34, 71, 0.06)' } },
        axisTick: { show: true, alignWithLabel: true, lineStyle: { color: 'rgba(16, 34, 71, 0.2)' } },
        axisLabel: {
          color: '#102247',
          fontSize: 10,
          fontFamily: 'Trip Geom, PingFang SC, system-ui',
          lineHeight: 12,
          margin: 10,
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 5000,
        interval: 1000,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: 'rgba(16, 34, 71, 0.06)' } },
        axisLabel: {
          color: '#102247',
          fontSize: 10,
          fontFamily: 'Trip Geom, PingFang SC, system-ui',
        },
      },
      series: [
        {
          type: 'bar',
          data: barData,
          barWidth: 24,
          itemStyle: {
            borderRadius: [2, 2, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#005AF8' },
              { offset: 1, color: '#5391FF' },
            ]),
          },
          z: 2,
        },
        {
          type: 'line',
          data: barData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#FFE37D' },
              { offset: 1, color: '#FFD028' },
            ]),
          },
          itemStyle: { color: '#FFD028', borderColor: '#fff', borderWidth: 1 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 208, 40, 0.18)' },
              { offset: 1, color: 'rgba(255, 208, 40, 0)' },
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
        background: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 1px 2px rgba(16, 34, 71, 0.04)',
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
        基于 Figma MCP 生成
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span
          style={{
            color: '#102247',
            fontFamily: 'PingFang SC, system-ui',
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '20px',
          }}
        >
          25年按月内容渠道订单总数据
        </span>
        <InfoIcon />
      </div>
      <div ref={ref} style={{ width: '100%', height: 220 }} />
    </div>
  )
}
