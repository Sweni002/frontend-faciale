// src/App.jsx
import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/Login.jsx';
import Global from './components/pointage/Global.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import AjoutPerso from './components/content/AjoutPerso.jsx';
import ModPerso from './components/content/ModPerso.jsx';
import Presences
 from './components/fiches/Presences.jsx';
import AjoutAuto from './components/content/AjoutAuto.jsx';
import Autorisations from './components/content/Autorisations.jsx';
import ModAuto from './components/content/ModAuto.jsx';
import Assiduites from './components/fiches/Assiduites.jsx';
import Tableau from './components/pointage/Tableau.jsx';
import Oublier from './components/login/Oublier.jsx';
import Motdepasse from './components/login/Motdepasse.jsx';
const LazyPersonnels = lazy(() =>
  new Promise((resolve) =>
     resolve(import('./components/content/Personnels.jsx'))
  )
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />
 <Route path="/oublie" element={<Oublier/>} />
 <Route path="/mdp" element={<Motdepasse/>} />

        {/* Route protégée par PrivateRoute */}
        <Route
          path="/global"
          element={
            <PrivateRoute>
              <Global />
            </PrivateRoute>
          }
        >
           <Route path='fiche_presence' element={<Presences />} />
       
           <Route path='ajout_perso' element={<AjoutPerso />} />
             <Route path='modifier_perso' element={<ModPerso />} />
              <Route path='modifier_auto' element={<ModAuto />} />
          <Route path="personnel" element={<LazyPersonnels />} >
                 </Route>
          <Route path="autorisation" element={<Autorisations />} />
            <Route path="tableau_bord" element={<Tableau />} />
              <Route path="assiduite" element={<Assiduites />} />
    
            <Route path='ajout_auto' element={<AjoutAuto />} />
        
          <Route index element={<Navigate to="fiche_presence" replace />} />
        </Route>

        {/* Redirection par défaut */}
        <Route
          path="/"
          element={
            localStorage.getItem('isLoggedIn') === 'true'
              ? <Navigate to="/global" replace />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
