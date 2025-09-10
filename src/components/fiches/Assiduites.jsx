import React, { useState ,useEffect, useRef} from 'react';
import { Breadcrumb, Table  } from 'antd';
import styles from './assiduite.module.css';
import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import { useLocation, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import SnackbarContent from '@mui/material/SnackbarContent';
 import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from "@mui/material/styles";
import { Spin } from "antd";
import TextField from '@mui/material/TextField';
import CancelIcon from '@mui/icons-material/Cancel';
import { Tooltip, Tag } from 'antd';
import { CloseCircleOutlined ,ClockCircleOutlined ,CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import frLocale from 'date-fns/locale/fr';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import 'dayjs/locale/fr'; // important
dayjs.locale('fr'); // activer la locale française
import Popover from '@mui/material/Popover';

const ITEM_HEIGHT = 48;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "white",
    borderRadius: "25px",
    padding: theme.spacing(3),
    width: "100%",
    maxWidth: "400px",
  },
}));
const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    padding: 0,
  },
  '& .MuiOutlinedInput-input': {
    padding: '10px 14px',
  },
}));



const Assiduites = () => {
  const navigate=useNavigate()
   const navigate2=useNavigate()
   const [assiduiteAll, setAssiduiteAll] = useState(null);
const [loadingAll, setLoadingAll] = useState(false);
const [moisAll, setMoisAll] = useState(new Date().getMonth() + 1);
const [anneeAll, setAnneeAll] = useState(2025);
const [openMatriculeDialog, setOpenMatriculeDialog] = useState(false);
const [selectedMatricule, setSelectedMatricule] = useState(null);
const [matricules, setMatricules] = useState([]); 
const [searchPers, setSearchPers] = useState("");
   const [divisions, setDivisions] = useState([]);
 const [personnels, setPersonnels] = useState([]);
  const [loading, setLoading] = useState(false);
   const [loadingSupp, setLoadingSupp] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
const location = useLocation();
const [snackMessage, setSnackMessage] = useState('');
const [snackError, setSnackError] = useState(false);
const [openSnack, setOpenSnack] = useState(false);
const [confirmOpen, setConfirmOpen] = useState(false);
const [recordToDelete, setRecordToDelete] = useState(null);
const [assiduiteByDivision, setAssiduiteByDivision] = useState(null);
const [loadingByDivision, setLoadingByDivision] = useState(false);

  const [selectionType] = useState('checkbox');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRecord, setMenuRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
const [selectedDivision, setSelectedDivision] = useState(null);
  const open = Boolean(menuAnchor);
const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
const dateInputRef = useRef(null);
const [dateDebutFiltre, setDateDebutFiltre] = useState('');
const [dateFinFiltre, setDateFinFiltre] = useState('');
const [filteredByDatePersonnels, setFilteredByDatePersonnels] = useState([]);
const [loadingPdf, setLoadingPdf] = useState(false);
const [loadingMatricule, setLoadingMatricule] = useState(false);
const [loadingPdf1, setLoadingPdf1] = useState(false);
  const [open1, setOpen] = useState(false);
  const anchorRef = useRef(null);
const [anchorEl, setAnchorEl] = React.useState(null);

 const matriculeTransmis = location.state?.matricule || null;

// Et dans le useEffect
useEffect(() => {
  if (matriculeTransmis) {

    const matriculeObj = typeof matriculeTransmis === 'string'
      ? { matricule: matriculeTransmis }
      : matriculeTransmis;

    setSelectedMatricule(matriculeObj);
    handleSelectMatricule(matriculeObj);
  }
}, [matriculeTransmis]);

const filteredPersonnels = personnels.filter(p => {
  if (selectedDivision) {
    const divisionObj = divisions.find(d => String(d.iddiv) === String(selectedDivision));
    if (!divisionObj || p.division !== divisionObj.nomdivision) return false;
  }

 if (selectedMatricule) {
  const selected = typeof selectedMatricule === 'string' ? selectedMatricule : selectedMatricule.matricule;
  return p.matricule === selected;
}


  const lower = searchText.toLowerCase();
  return (
    (p.matricule && p.matricule.toLowerCase().includes(lower)) ||
    (p.nom && p.nom.toLowerCase().includes(lower)) ||
    (p.prenom && p.prenom.toLowerCase().includes(lower))
  );
});

  const fetchWithAuth = async (url, options = {}) => {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
    });

    if (response.status === 401) {
      navigate('/login');  // Redirige ici
      throw new Error('Session expirée, veuillez vous reconnecter.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erreur inconnue');
    }

    return response.json();
  };

useEffect(() => {
    console.log('Fetch avec selectedDivision:', selectedDivision, moisAll, anneeAll);
 console.log("Mois :" , selectedDate)
  const fetchData = async () => {
    setLoading(true);
    try {
      const url = selectedDivision
        ? `http://localhost:5000/api/fiches_assiduite/by_division?iddiv=${selectedDivision}&mois=${moisAll}&annee=${anneeAll}`
        : `http://localhost:5000/api/fiches_assiduite/all?mois=${moisAll}&annee=${anneeAll}`;

      const data = await fetchWithAuth(url);
      console.log("Données reçues:", data.data);

      setPersonnels(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error(e);
      setPersonnels([]);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [selectedDivision, moisAll, anneeAll]);

useEffect(() => {
  console.log("Mois"  , moisAll)
  if (anchorEl) {
    setLoading(true);
    fetchWithAuth(`http://localhost:5000/api/fiches_assiduite/all?mois=${moisAll}&annee=${anneeAll}`)
      .then(data => {
        setPersonnels(Array.isArray(data.data) ? data.data : []);
           console.log('datae' , data)

        setErrorMsg(null);
      })
      .catch(e => setErrorMsg(e.message))
      .finally(() => setLoading(false));
  }
}, [anchorEl, moisAll, anneeAll]);

const handleSelectMatricule = async (p) => {
  setSelectedMatricule(p);
  setSearchPers('');
  setAnchorEl(null);
  setLoadingMatricule(true);

  try {
    const data = await fetchWithAuth(
      `http://localhost:5000/api/fiches_assiduite/all_by_matricule?matricule=${encodeURIComponent(p.matricule)}&mois=${moisAll}&annee=${anneeAll}`
    );
    setAssiduiteAll(data.data[0] || null); // Tu récupères ici les détails pour ce matricule
    setErrorMsg(null);
  } catch (error) {
    setErrorMsg(error.message);
  } finally {
    setLoadingMatricule(false);
  }
};

useEffect(() => {
  const snackMsg = sessionStorage.getItem('snackMessage');
  const snackErr = sessionStorage.getItem('snackError') === 'true';

  if (snackMsg) {
    setSnackMessage(snackMsg);
    setSnackError(snackErr);
    setOpenSnack(true);

    // Nettoyage après affichage
    sessionStorage.removeItem('snackMessage');
    sessionStorage.removeItem('snackError');
  }
}, []);


useEffect(() => {
    fetchWithAuth('http://localhost:5000/api/divisions/with_count')
      .then((data) => {
        if (Array.isArray(data)) {
          setDivisions(data);
        } else if (data.error) {
          alert("Erreur API : " + data.error);
          setDivisions([]);
        } else {
          console.error('La réponse n\'est pas un tableau:', data);
          setDivisions([]);
        }
      })
      .catch((err) => {
        console.error("Erreur fetch divisions:", err);
        setDivisions([]);
      });
  }, []);


const exportPDF = async () => {
  if (!selectedDate) {
    setSnackMessage("Sélectionner une date pour exporter le PDF.");
    setSnackError(true);
    setOpenSnack(true);
    return;
  }

  setLoadingPdf1(true);

  // Extraire mois et année de selectedDate (format ISO : "YYYY-MM-DD")
  const dateObj = new Date(selectedDate);
  const mois = dateObj.getMonth() + 1;  // mois : 1-12
  const annee = dateObj.getFullYear();

  let url;
  if (selectedDivision) {
    url = `http://localhost:5000/api/fiches_assiduite/pdf/division?iddiv=${selectedDivision}&mois=${mois}&annee=${annee}`;
  } else {
    url = `http://localhost:5000/api/fiches_assiduite/pdf?mois=${mois}&annee=${annee}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.status === 401) {
      navigate('/login');
      throw new Error('Session expirée, veuillez vous reconnecter.');
    }

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;

    // Nom fichier personnalisé
    const suffix = selectedDivision ? `_division_${selectedDivision}` : '';
    link.download = `fiche_assiduite${suffix}_${mois}_${annee}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);

    setSnackMessage("Exportation réussie");
    setSnackError(false);
    setOpenSnack(true);
  } catch (error) {
    console.error("Erreur export PDF:", error);
    setSnackMessage(error.message || "Erreur lors de l'export");
    setSnackError(true);
    setOpenSnack(true);
  } finally {
    setLoadingPdf1(false);
  }
};


  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuRecord(null);
  };
const columns = [
  {
    title: 'Nom & Prénom',
    key: 'nom_prenom',
    align: 'center',
    render: (record) => <strong>{record.nom} {record.prenom}</strong>,
  },
  {
    title: 'Matricule',
    dataIndex: 'matricule',
    align: 'center',
  },
  {
    title: 'Division',
    dataIndex: 'division',
    align: 'center',
    
  },

{
  title: 'Absences',
    className: styles.borderedLeft,    // <-- Ajout ici
  
  children: [
    {
      title: 'Justifiées',
        className: styles.borderedLeft,    // <-- Ajout ici
      
      align: 'center',
      render: (r) => (
        <Tooltip title={r.absences?.justifiees?.dates?.join(', ')}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: 100,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              gap: '2px',
            }}
          >
            {(r.absences?.justifiees?.dates || []).map((date, i) => (
              <span key={i}>{date}</span>
            ))}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Non justifiées',
      align: 'center',
      render: (r) => (
        <Tooltip title={r.absences?.non_justifiees?.dates?.join(', ')}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#ffe6e6',
              padding: '4px',
              borderRadius: '4px',
              gap: '2px',
              maxWidth: 100,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {(r.absences?.non_justifiees?.dates || []).map((date, i) => (
              <span key={i}>{date}</span>
            ))}
          </div>
        </Tooltip>
      ),
    },
  

  ],
},
  {
    title: 'Retards',
    dataIndex: 'retards',
    align: 'center',
         className: styles.borderedLeft,    // <-- Ajout ici
      

    render: (val) => (
      <div style={{ backgroundColor: '#fff9db', padding: '4px', borderRadius: '4px' }}>{val}</div>
    )
  },
  {
    title: 'Présences',
    dataIndex: 'presences',
    align: 'center',
    render: (val) => (
      <div style={{ backgroundColor: '#e6ffed', padding: '4px', borderRadius: '4px' }}>{val}</div>
    )
  },
  {
    title: 'Total Absences',
    dataIndex: 'total_absences',
    align: 'center',
    render: (val) => (
      <div style={{ fontWeight: 'bold' }}>{val}</div>
    )
  },

];




  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: false,
      name: record.nom,
    }),
  };

  return (
    <div className={styles.personnels}>
      <div className={styles.break}>
        <Breadcrumb
          style={{ fontSize: 14, fontWeight: "bold" }}
          items={[
            { title: <a href="" style={{ fontSize: 15 }}>Fiche</a> },
            { title: <a href="" style={{ fontSize: 15 }}>Assiduites</a> }
          ]}
        />
        <div className={styles.listes}><h1>Fiches d'assiduite</h1></div>
      </div>

      <div className={styles.cardDivision}>
        {divisions.length === 0 ? (
          <p>Chargement des divisions...</p>
        ) : (
          divisions.map((division) => (
           <div 
  className={styles.btn1} 
  key={division.iddiv} 
  style={{ cursor: 'pointer', backgroundColor: selectedDivision === division.iddiv ? 'rgba(145, 141, 141, 0.1)' : undefined }}
  onClick={() => {
   console.log("clic sur iddiv", division.iddiv, "avant setSelectedDivision");

    if (selectedDivision === division.iddiv) {
      setSelectedDivision(null); // toggle off if already selected
    } else {
      setSelectedDivision(division.iddiv);
    }
  }}
>
  <h2>{division.nomdivision}</h2>

</div>

          ))
        )}
      </div>
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
  <div className={styles.filtreContainer}>
      <div className={styles.filtreGroup}>
      <div className={styles.filtreItem}>
        <label className={styles.filtreLabel} htmlFor="dateDebut">Date début</label>
        <DatePicker
          id="dateDebut"
          value={dateDebutFiltre ? new Date(dateDebutFiltre) : null}
          onChange={(newValue) => setDateDebutFiltre(newValue ? newValue.toISOString().split('T')[0] : '')}
          format="dd/MM/yyyy"
          slotProps={{ textField: { size: 'medium' } }}
        />
      </div>

      <div className={styles.filtreItem}>
        <label className={styles.filtreLabel} htmlFor="dateFin">Date fin</label>
        <DatePicker
          id="dateFin"
          value={dateFinFiltre ? new Date(dateFinFiltre) : null}
          onChange={(newValue) => setDateFinFiltre(newValue ? newValue.toISOString().split('T')[0] : '')}
          minDate={dateDebutFiltre ? new Date(dateDebutFiltre) : undefined}
          disabled={!dateDebutFiltre}
          format="dd/MM/yyyy"
          slotProps={{ textField: { size: 'medium' } }}
        />
      </div>

      <button  className={styles.btnFiltre}>Trier</button>
   
      <button  className={styles.btnReset} disabled={!dateDebutFiltre && !dateFinFiltre}>Réinitialiser</button>
      <div className={styles.trier}>
        <button 
          disabled={!dateDebutFiltre && !dateFinFiltre}
  style={{ cursor: (!dateDebutFiltre || !dateFinFiltre) ? 'not-allowed' : 'pointer', opacity: (!dateDebutFiltre || !dateFinFiltre) ? 0.5 : 1 }}
>
     {loadingPdf ? <Spin size="small" /> : (
    <div className={styles.btn10}>
      <span>Exporter en PDF</span>
      <i className="fa-solid fa-download"></i>
    </div>
  )}         
        </button>
      </div>
    </div>

    {/* Bouton Exporter PDF à droite */}

  </div>
</LocalizationProvider>

      <div className={styles.cardTab}>
        <div className={styles.searchBar}>
      <div className={styles.flexible}>
   <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
      <div
        className={styles.debut}
        ref={anchorRef}
        onClick={() => setOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        <label>
      {selectedDate
        ? dayjs(selectedDate).format('MMMM YYYY') // ✅ novembre 2025
        : 'Filtrer par mois'}
    </label>
     <IconButton size="large">

      <i className="fa-solid fa-chevron-down"></i>
      </IconButton>
      </div>

      <DatePicker
        open={open1}
        onClose={() => setOpen(false)}
        views={['month']}
        minDate={new Date('2020-01-01')}
        maxDate={new Date('2030-12-31')}
        value={selectedDate ? new Date(selectedDate) : null}
        onChange={(newValue) => {
          if (newValue) {
            const year = newValue.getFullYear();
            const month = (newValue.getMonth() + 1).toString().padStart(2, '0');
           setMoisAll(month);
      setAnneeAll(year);

      // Met à jour aussi selectedDate pour affichage
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      setSelectedDate(formattedDate);    
          }
          setOpen(false); // ferme après sélection
        }}
         slots={{
          field: () => null, // Supprime complètement le champ TextField
        }}
     slotProps={{
  popper: {
    anchorEl: () => anchorRef.current,
    placement: 'bottom-start',
  }
}}

      />
    </LocalizationProvider>

<div
  className={styles.matricule}
  style={{ cursor: 'pointer' }}
  onClick={(e) => setAnchorEl(e.currentTarget)}
>
 <label>
  {selectedMatricule
    ? (typeof selectedMatricule === 'string' ? selectedMatricule : selectedMatricule.matricule)
    : 'matricule'}
</label>

 
 {selectedMatricule && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setSelectedMatricule(null);
      }}
      aria-label="Réinitialiser filtre matricule"
 className={styles.iconCircleBtn} 
      title="Réinitialiser filtre matricule"
      type="button"
    >
     <i class="fa-solid fa-xmark" style={ {
fontSize : 16,color :"black"        
     }}></i>
    </button>
  )}
  <IconButton  size="large">

 
  <i className="fa-solid fa-chevron-down"></i>
   </IconButton>
</div>

<Popover
  open={Boolean(anchorEl)}
  anchorEl={anchorEl}
  onClose={() => {
    setSearchPers('');
    setAnchorEl(null);
  }}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
  PaperProps={{
    sx: {
      borderRadius: '25px',
      width: 400,
      padding: 2,
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      backgroundColor: 'white',
    },
  }}
>
  <div className={styles.dialog}>
    <input
      type="text"
      placeholder=""
      value={searchPers}
      onChange={(e) => setSearchPers(e.target.value)}
    />
    <i className="fa-solid fa-magnifying-glass"></i>
  </div>

  <div style={{ minHeight: 300, maxHeight: 400, overflowY: 'auto', padding: 18, marginTop: 10 }}>
    {loading ? (
      <p>Chargement...</p>
    ) : errorMsg ? (
      <p style={{ color: "red" }}>{errorMsg}</p>
    ) : (
      <div className={styles.liste}>
        {personnels
          .filter((p) =>
            `${p.nom} ${p.prenom} ${p.matricule}`.toLowerCase().includes(searchPers.toLowerCase())
          )
          .map((p) => (
            <div
              key={p.idpers}
              className={styles.liste1}
              onClick={() => handleSelectMatricule(p)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.liste2}>
                <h4>{p.nom} {p.prenom}</h4>
                <p style={{ fontSize: "18px", color: "#666" }}>{p.matricule}</p>
              </div>
              <i className="fa-solid fa-user-check"></i>
            </div>
          ))}
        {personnels.length === 0 && <p>Aucun personnel trouvé.</p>}
      </div>
    )}
  </div>
</Popover>

<Tooltip
  title="Exporter en PDF"
  arrow
 
>
  <div
    className={styles.pdf}
    onClick={exportPDF}
    aria-label="Exporter en PDF"
  >
        <IconButton  size="large">
       {loadingPdf1 ? <Spin size="default" /> : (
    

<i class="fa-solid fa-download"></i>

  )} 
  </IconButton>
    </div>
</Tooltip>

    
    
      </div>
          <div className={styles.searchB}>
            <input type="text" placeholder='Rechercher ...' 
              value={searchText}
  onChange={e => setSearchText(e.target.value)}/>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>

   <div className={`${styles.tableau} ${styles.shadowedTable}`}>
  <Table
  loading={loading}
  pagination={{ position: ['bottomCenter'] }}
  rowSelection={{ type: selectionType, ...rowSelection }}
  columns={columns}
   dataSource={filteredPersonnels.map(p => ({
        ...p,
        key: p.idpointage || p.matricule || `${p.nom}-${p.prenom}`,
      }))}
  rowClassName={() => styles.largeRow}
  onHeaderRow={() => ({ className: styles.largeHeader })}
/>

</div>
      </div>




      <Menu
        id="long-menu"
        anchorEl={menuAnchor}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '30ch',
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
      >
<MenuItem  onClick={() => {
    setConfirmOpen(true); // 👈 ouvre le dialog
    handleMenuClose(); // ferme le menu si besoin
  }}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <i
      className="fa-regular fa-trash-can"
      style={{ color: '#ff4d4f', marginRight: 12, fontSize: 18 }}
    ></i>
    <span style={{ fontSize: 18 }}>Supprimer</span>
  </div>
</MenuItem>


<MenuItem >
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <i
      className="fa-solid fa-eye"
      style={{ color: '#1890ff', marginRight: 12, fontSize: 18 }}
    ></i>
    <span style={{ fontSize: 17 }}>Voir fiche d’assiduité</span>
  </div>
</MenuItem>

      </Menu>
      <Snackbar
  open={openSnack}
  autoHideDuration={4000}
  onClose={() => setOpenSnack(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
>
  <SnackbarContent
    sx={{
      p: 1,
      px : 3,
      fontSize: '17px',
      color: 'white'
    }}
    message={<span>{snackMessage}</span>}
  />
</Snackbar>
 

    </div>
  );
};

export default Assiduites;
