import React from 'react'
import styles from './tableau.module.css'
import ReactApexChart from 'react-apexcharts'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts'

// Données pour Apex PolarArea
const apexSeries = [14, 23, 21, 17, 15, 10, 12, 17, 21]
const apexOptions = {
  chart: {
    type: 'polarArea',
  },
  labels: [
    'Math',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Geography',
    'Art',
    'Music',
    'Sports',
  ],
  stroke: {
    colors: ['#fff'],
  },
  fill: {
    opacity: 0.8,
  },
  colors: [
    '#ff7f0e', // orange
    '#8a2be2', // violet
    '#1f77b4', // bleu
    '#d62728', // rouge
    '#ff6347',
    '#9370db',
    '#1e90ff',
    '#ff4500',
    '#6a5acd',
  ],
  legend: {
    show: false,
    position: 'right',
    fontSize: '14px',
    labels: {
      colors: '#333',
    },
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: {
          width: 350,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 280,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
}

const dataColumn = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
]

const dataLine1 = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 20 },
  { name: 'Wed', value: 27 },
  { name: 'Thu', value: 18 },
  { name: 'Fri', value: 23 },
  { name: 'Sat', value: 34 },
  { name: 'Sun', value: 44 },
]

const dataLine2 = [
  { name: 'Jan', uv: 400, pv: 240, amt: 240 },
  { name: 'Feb', uv: 300, pv: 139, amt: 221 },
  { name: 'Mar', uv: 200, pv: 980, amt: 229 },
  { name: 'Apr', uv: 278, pv: 390, amt: 200 },
  { name: 'May', uv: 189, pv: 480, amt: 218 },
  { name: 'Jun', uv: 239, pv: 380, amt: 250 },
  { name: 'Jul', uv: 349, pv: 430, amt: 210 },
]

const ApexPolarArea = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        boxSizing: 'border-box',
      }}
    >
      {/* Graphique */}
      <div style={{ flex: '1 1 auto', width: '100%', minHeight: 250 }}>
        <ReactApexChart options={apexOptions} series={apexSeries} type="polarArea" height="100%" />
      </div>

      {/* Labels en bas en flex row avec couleurs */}
      <div
        style={{
          marginTop: 15,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 15,
          flexWrap: 'wrap',
          userSelect: 'none',
        }}
      >
        {apexOptions.labels.map((label, i) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: '600',
              color: '#333',
              cursor: 'default',
            }}
          >
            {/* Pastille couleur */}
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: apexOptions.colors[i],
                display: 'inline-block',
              }}
            />
            {/* Texte label */}
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

const Tableau = () => {
  return (
    <div className={styles.personnels}>
      <div className={styles.break}>
        <div className={styles.listes}>
          <h1 style={{textAlign :'left'}}>Tableau de bord</h1>
        </div>

        {/* Ligne 1 */}
        <div className={styles.flexRow}>
          {/* Carte ApexCharts PolarArea */}
          <div className={styles.card} tabIndex={0} aria-label="Diagramme Polar Area">
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: '10px' }}>
  <div style={{ fontWeight: '700', fontSize: '1rem', color: '#555'  ,width :"100%"}}>
   <h3 style={{textAlign :"left" ,color :"black"}}>Répartition du personnel
    </h3> 
  </div>
  <div style={{ marginTop: 10, width: '100%' }}>
    <ApexPolarArea />
  </div>
</div>

          </div>

          {/* Carte BarChart Recharts */}
          <div className={styles.card} tabIndex={0} aria-label="Diagramme en colonnes">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 10px 5px 0', fontWeight: '700', fontSize: '1rem', color: '#555' }}>
              Présence par division
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataColumn} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip />
                <Legend />
                <Bar dataKey="uv" fill="#ff7f0e" />
                <Bar dataKey="pv" fill="#2ca02c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ligne 2 */}
        <div className={styles.flexRow}>
          {/* Carte LineChart 1 */}
          <div className={styles.card} tabIndex={0} aria-label="Premier diagramme en ligne">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 10px 5px 0', fontWeight: '700', fontSize: '1rem', color: '#555' }}>
              Tendance des retards
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataLine1} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#444444" />
                <YAxis stroke="#444444" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#d62728" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Carte LineChart 2 */}
          <div className={styles.card} tabIndex={0} aria-label="Deuxième diagramme en ligne">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 10px 5px 0', fontWeight: '700', fontSize: '1rem', color: '#555' }}>
              Évolution présence
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataLine2} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#555555" />
                <YAxis stroke="#555555" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="uv" stroke="#9467bd" strokeWidth={3} />
                <Line type="monotone" dataKey="pv" stroke="#8c564b" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tableau
