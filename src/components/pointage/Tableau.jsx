import React, { useEffect, useState } from 'react'
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
import { Navigate } from 'react-router-dom'






  const fetchWithAuth = async (url, options = {}) => {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
    });

    if (response.status === 401) {
      Navigate('/login');  // Redirige ici
      throw new Error('Session expirée, veuillez vous reconnecter.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erreur inconnue');
    }

    return response.json();
  };

const ApexPolarArea = () => {
  const [series, setSeries] = useState([])
  const [labels, setLabels] = useState([])
  const [colors, setColors] = useState([
    '#ff7f0e', '#8a2be2', '#1f77b4', '#d62728',
    '#ff6347', '#9370db', '#1e90ff', '#ff4500', '#6a5acd'
  ])
  const apexOptions = {
    chart: { type: 'polarArea' },
    labels,
    stroke: { colors: ['#fff'] },
    fill: { opacity: 0.8 },
    colors,
    legend: { show: false }
  }
 

    useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchWithAuth('http://localhost:5000/api/divisions/with_count')
        // API renvoie [{ iddiv, nomdivision, total_personnels }]
        setLabels(data.map(d => d.nomdivision))
        setSeries(data.map(d => d.total_personnels))
      } catch (error) {
        console.error('Erreur récupération données polar area:', error)
      }
    }
    getData()
  }, [])

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
        <ReactApexChart options={apexOptions} series={series} type="polarArea" height="100%" />
      </div>

      {/* Labels en bas en flex row avec couleurs */}
      <div
        style={{
          marginTop: 22,
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
    const [dataColumn1, setDataColumn1] = useState([]);
     const [dataLine1, setDataLine1] = useState([]);
const [dataLine2, setDataLine2] = useState([]);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWithAuth(
          'http://localhost:5000/api/divisions/tendance-retards-par-jour'
        );

        console.log('Réponse API :', data);

        const chartData = Array.isArray(data)
          ? data.map(item => ({
              name: item.jour,        // 'LUN.', 'MAR.', ...
              value: item.total_retard
            }))
          : [];

        setDataLine1(chartData);
      } catch (err) {
        console.error('Erreur récupération retards :', err);
      }
    };

    fetchData();
  }, []);

 useEffect(() => {
    const fetchPresence = async () => {
      try {
        const data = await fetchWithAuth("http://localhost:5000/api/divisions/evolution-presence-par-mois");
        // Transformer si nécessaire pour Recharts
        const chartData = data.map(item => ({
          name: item.mois,
          uv: item.total_presence, // ou "matin"
          pv: item.total_presence  // ou "soir" si tu veux 2 lignes distinctes
        }));
        setDataLine2(chartData);
      } catch (error) {
        console.error("Erreur récupération évolution présence :", error);
      }
    };
    fetchPresence();
  }, []);

    useEffect(() => {
    const fetchPresence = async () => {
      try {
        const data = await fetchWithAuth('http://localhost:5000/api/divisions/presence-par-division-courant');
        // Transformer pour Recharts
        const chartData = data.map(item => ({
          name: item.nomdivision,
        presenceCeMois: item.total_presence, // <- clé plus parlante
    }));
        setDataColumn1(chartData);
      } catch (error) {
        console.error('Erreur récupération présence par division:', error);
      }
    };
    fetchPresence();
  }, []);
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
          <div style={{ display: 'flex', alignItems :"flex-end", padding: ' 20px', fontWeight: '700', fontSize: '1rem', color: '#555' ,
              width :"100%"
             }}>
                <h3 style={{textAlign :"left" ,color :"black"}}>Répartition du personnel
    </h3> 
  </div>
  <div style={{display :'flex' , width: '100%' , height:"80%" }}>
    <ApexPolarArea />
  </div>


          </div>

          {/* Carte BarChart Recharts */}
          <div className={styles.card} tabIndex={0} aria-label="Diagramme en colonnes">
            <div style={{ display: 'flex', alignItems :"flex-end", padding: ' 20px', fontWeight: '700', fontSize: '1rem', color: '#555' ,
              width :"100%"
             }}>
            <h3 style={{textAlign :"left" ,color :"black"}}>Présence par division
    </h3>  
            </div>
            <div style={{display :"flex" , width : "100%" , height :"80%",alignItems :"center"}}>
                 <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataColumn1} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis   angle={-8}           // angle de rotation en degrés
  textAnchor="end"
  style={{fontSize : "0.9rem"}}
                dataKey="name" stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip />
                <Legend  verticalAlign="bottom"        // ou "bottom" selon l'emplacement souhaité
wrapperStyle={{ marginTop: 30 }} // ajoute un espacement vers le bas
/>
                      <Bar dataKey="presenceCeMois" name="Présence ce mois-ci" fill="#ff7f0e" 
                      /> 
 </BarChart>
            </ResponsiveContainer>
     
            </div>
              </div>
        </div>

        {/* Ligne 2 */}
        <div className={styles.flexRow}>
          {/* Carte LineChart 1 */}
          <div className={styles.card} tabIndex={0} aria-label="Premier diagramme en ligne">
           <div style={{ display: 'flex', alignItems :"flex-end", padding: ' 20px', fontWeight: '700', fontSize: '1rem', color: '#555' ,
              width :"100%"
             }}>
                   <h3 style={{textAlign :"left" ,color :"black"}}>Tendance des retards
    </h3>       
            </div>
               <div style={{display :"flex" , width : "100%" , height :"80%",alignItems :"center"}}>
       
          <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dataLine1} margin={{ top: 0, right: 20, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" stroke="#444444" />
        <YAxis stroke="#444444" style={{fontSize : "0.9rem"}}/>
        <Tooltip />
        <Legend  verticalAlign="bottom" // ou "bottom" selon l'emplacement
      align="right"       // position horizontale
      // décalage vers le bas
/>
        <Line type="monotone" dataKey="value" name="Retards" stroke="#d62728" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
         </div>
         </div>

          {/* Carte LineChart 2 */}
          <div className={styles.card} tabIndex={0} aria-label="Deuxième diagramme en ligne">
             <div style={{ display: 'flex', alignItems :"flex-end", padding: ' 20px', fontWeight: '700', fontSize: '1rem', color: '#555' ,
              width :"100%"
             }}>
                   <h3 style={{textAlign :"left" ,color :"black"}}>Evolution de la présence
    </h3>      
      </div>
                 <div style={{display :"flex" , width : "100%" , height :"80%",alignItems :"center"}}>
    
             <ResponsiveContainer width="100%" height="80%">
      <LineChart data={dataLine2} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" stroke="#555555" />
        <YAxis stroke="#555555" />
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} /> {/* on peut ajuster margin/position */}
        <Line type="monotone" dataKey="uv" stroke="#9467bd" strokeWidth={3} name="Présence" />
        <Line type="monotone" dataKey="pv" stroke="#8c564b" strokeWidth={3} name="Présence" />
      </LineChart>
    </ResponsiveContainer> 
    </div>  
     </div>
        </div>
      </div>
    </div>
  )
}

export default Tableau
