// src/App.jsx
import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx'; // ⚡ Import AuthProvider
import PrivateRoute from './PrivateRoute.jsx';

import Login from './components/login/Login.jsx';
import Global from './components/pointage/Global.jsx';
import AjoutPerso from './components/content/AjoutPerso.jsx';
import ModPerso from './components/content/ModPerso.jsx';
import Presences from './components/fiches/Presences.jsx';
import AjoutAuto from './components/content/AjoutAuto.jsx';
import Autorisations from './components/content/Autorisations.jsx';
import ModAuto from './components/content/ModAuto.jsx';
import Assiduites from './components/fiches/Assiduites.jsx';
import Tableau from './components/pointage/Tableau.jsx';
import Oublier from './components/login/Oublier.jsx';
import Motdepasse from './components/login/Motdepasse.jsx';
import Personnels from './components/content/Personnels.jsx'
import Responsable from './components/content/Responsable.jsx';
import AjoutRespo from './components/content/AjoutRespo.jsx';
import ModRespo from './components/content/ModRespo.jsx';

const LazyFiches = lazy(() =>
  new Promise((resolve) =>
    resolve(import('./components/fiches/Assiduites.jsx'))
  )
);

function App() {
  return (
    <BrowserRouter>
      {/* ⚡ Entoure tout avec AuthProvider */}
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/oublie" element={<Oublier />} />
          <Route path="/mdp" element={<Motdepasse />} />

          {/* Routes protégées */}
          <Route
            path="/global"
            element={
              <PrivateRoute>
                <Global />
              </PrivateRoute>
            }
          >
            <Route path="fiche_presence" element={<Presences />} />
            <Route path="ajout_perso" element={<AjoutPerso />} />
            <Route path="modifier_perso" element={<ModPerso />} />
            <Route path="modifier_auto" element={<ModAuto />} />
             <Route path="modifier_respo" element={<ModRespo />} />
        
            <Route path="personnel" element={<Personnels />} />
             <Route path="responsable" element={<Responsable />} />
            <Route path="autorisation" element={<Autorisations />} />
            <Route path="tableau_bord" element={<Tableau />} />
            <Route path="assiduite" element={<LazyFiches />} />
            <Route path="ajout_auto" element={<AjoutAuto />} />
 <Route path="ajout_respo" element={<AjoutRespo />} />

            {/* Redirection par défaut */}
            <Route index element={<Navigate to="fiche_presence" replace />} />
          </Route>

          {/* Redirection si route inconnue */}
          <Route
            path="/"
            element={
              localStorage.getItem('isLoggedIn') === 'true'
                ? <Navigate to="/global" replace />
                : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
