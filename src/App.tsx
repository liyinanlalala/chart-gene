import MonthlyOrderChart from './components/MonthlyOrderChart'
import ContentChannelOrderChart from './components/ContentChannelOrderChart'

function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F5F6FA',
        padding: '32px 40px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: 1056,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <MonthlyOrderChart />
        <ContentChannelOrderChart />
      </div>
    </div>
  )
}

export default App
