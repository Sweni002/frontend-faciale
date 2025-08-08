import React, { useState ,useEffect ,useRef} from 'react';
import { Breadcrumb, Table } from 'antd';
import styles from './conge.module.css';
import { EditOutlined } from '@ant-design/icons';
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
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import frLocale from 'date-fns/locale/fr';
import dayjs from 'dayjs';
import TextField
 from '@mui/material/TextField';
const ITEM_HEIGHT = 48;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "white",
    borderRadius: "25px",
    padding: theme.spacing(2),
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

const Autorisations = () => {
  const navigate=useNavigate()
   const navigate2=useNavigate()
   const [divisions, setDivisions] = useState([]);
 const [conges, setConges] = useState([]);
 const [congesOriginal, setCongesOriginal] = useState([]);
  const [loading, setLoading] = useState(false);
   const [loadingSupp, setLoadingSupp] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
const location = useLocation();
const [snackMessage, setSnackMessage] = useState('');
const [snackError, setSnackError] = useState(false);
const [openSnack, setOpenSnack] = useState(false);
const [confirmOpen, setConfirmOpen] = useState(false);
const [recordToDelete, setRecordToDelete] = useState(null);
const [selectedDate, setSelectedDate] = useState('');
const dateInputRef = useRef(null);
  const [selectionType] = useState('checkbox');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRecord, setMenuRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
const [selectedDivision, setSelectedDivision] = useState(null);
  const open = Boolean(menuAnchor);
const [dateDebutFiltre, setDateDebutFiltre] = useState('');
const [dateFinFiltre, setDateFinFiltre] = useState('');

const filteredConges = conges.filter(c => {
  const lower = searchText.toLowerCase();

  // Récupère champs texte à chercher dans le congé + personnel associé
  const nom = c.nom?.toLowerCase() || '';
  const prenom = c.prenom?.toLowerCase() || '';
  const matricule = c.matricule?.toLowerCase() || '';
  const motif = c.motif?.toLowerCase() || '';

  // Recherche texte dans ces champs
  const matchesSearch =
    matricule.includes(lower) ||
    nom.includes(lower) ||
    prenom.includes(lower) ||
    motif.includes(lower);

  // Filtre division si sélectionnée (si division existe sur personnel lié)
  if (!selectedDivision) return matchesSearch;

  return matchesSearch && c.iddiv === selectedDivision;
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


  const goAjout=()=>{
    navigate("/global/ajout_auto")
  }

  const handleFiltrerParDates = async () => {
  if (!dateDebutFiltre || !dateFinFiltre) {
    setSnackMessage("Veuillez sélectionner les deux dates pour filtrer.");
    setSnackError(true);
    setOpenSnack(true);
    return;
  }

  setLoading(true);
  try {
    // Appel à ta route Flask qui filtre entre deux dates
    const res = await fetchWithAuth(`http://localhost:5000/api/autorisations/between_dates?start=${dateDebutFiltre}&end=${dateFinFiltre}`);
      const count = Array.isArray(res) ? res.length : 0;
   console.log(count)  
   setSnackMessage(`${count} autorisation${count > 1 ? 's' : ''} trouvée${count > 1 ? 's' : ''}`);
    setSnackError(false);
    setOpenSnack(true);
    setConges(res);
  } catch (err) {
    setSnackMessage(err.message);
    setSnackError(true);
    setOpenSnack(true);
  } finally {
    setLoading(false);
  }
};


const handleResetFiltre = async () => {
  setDateDebutFiltre('');
  setDateFinFiltre('');
  setLoading(true);
  try {
    const data = await fetchWithAuth('http://localhost:5000/api/autorisations');
    setConges(data);
  } catch (err) {
    setSnackMessage(err.message);
    setSnackError(true);
    setOpenSnack(true);
  } finally {
    setLoading(false);
  }
};





const downloadPDF = () => {
  const url = `http://localhost:5000/api/pointage/facial/pdf?date=${selectedDate}`;
  window.open(url, "_blank");
};
useEffect(() => {
  setLoading(true);
   fetchWithAuth('http://localhost:5000/api/autorisations')
    .then(data => {
      console.log("auto" ,data)
      if (Array.isArray(data)) {
        setConges(data);
        setCongesOriginal(data); 
      } else {
        setConges([]);
        setSnackMessage('Erreur chargement autorisations');
        setSnackError(true);
        setOpenSnack(true);
      }
    })
    .catch(err => {
      setSnackMessage(err.message);
      setSnackError(true);
      setOpenSnack(true);
    })
    .finally(() => setLoading(false));
}, []);



  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setLoadingSupp(true);
    if (!recordToDelete) {
      setLoadingSupp(false);
      return;
    }
  fetchWithAuth(`http://localhost:5000/api/autorisations/${recordToDelete.id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        setSnackMessage(res.message);
        setSnackError(false);
        setOpenSnack(true);
        setConges(prev => prev.filter(c => c.id !== recordToDelete.id));
      })
      .catch(err => {
        setSnackMessage(err.message || "Erreur inconnue");
        setSnackError(true);
        setOpenSnack(true);
      })
      .finally(() => {
        setConfirmOpen(false);
        setRecordToDelete(null);
        setLoadingSupp(false);
      });
  };

  



  const handleMenuClick = (event, record) => {
    setMenuAnchor(event.currentTarget);
    setMenuRecord(record);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuRecord(null);
  };
const columns = [
  {
    title: 'Matricule',
    dataIndex: 'matricule',
    key: 'matricule',
    render: (_, record) => record.matricule ?? '-',
  },
  {
    title: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        Nom & prénom
      </div>
    ),
    key: 'nomprenom',
    render: (_, record) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ fontSize: 18 }}>{record.nom ?? '-'} {record.prenom ?? '-'}</label>
        <small style={{ fontSize: 17, fontWeight: "bold" }}>
          {record.division ?? '-'}
        </small>
      </div>
    ),
  },
  {
    title: (
      <div style={{ textAlign: "center", width: "100%" }}>
        Motif
      </div>
    ),
    dataIndex: 'motif',
    key: 'motif',
    render: text => text || '-',
    align: 'center',
  },
 
  {
    title: 'Date',
    dataIndex: 'date_absence',
    key: 'date_absence',
    align: 'center',
    render: text => text ? new Date(text).toLocaleDateString() : '-',
  },
 {
  title: 'État',
  dataIndex: 'etat',
  key: 'etat',
  align: 'center',
  render: (text) => {
    const normalized = text?.toLowerCase().trim(); // nettoyage fiable
    const isTermine = ['terminé', 'terminée', 'terminee'].includes(normalized);

    return (
      <div
        title={isTermine ? 'Cette autorisation est terminée' : 'Cette autorisation est toujours en cours'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '6px 12px',
          borderRadius: 50,
          backgroundColor: isTermine ? '#e8f5e9' : '#fff3e0',
          color: isTermine ? '#388e3c' : '#f57c00',
          fontWeight: 600,
          width: 'fit-content',
          margin: 'auto',
          fontSize: 15,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}
      >
        {isTermine ? (
          <>
            <CheckCircleOutlined style={{ color: '#4caf50' }} />
            Terminé
          </>
        ) : (
          <>
            <ClockCircleOutlined style={{ color: '#ff9800' }} />
            En cours
          </>
        )}
      </div>
    );
  },
}
,
  {
    title: '',
    key: 'actions',
    render: (_, record) => (
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div
          className={styles.iconCircle}
          onClick={() => navigate('/global/modifier_auto', { state: { record } })}
        >
          <EditOutlined style={{ color: '#1B6979', fontSize: 20 }} />
        </div>
        <div
          className={styles.iconCircle}
          onClick={() => handleDeleteClick(record)}
          style={{ cursor: 'pointer', color: '#ff4d4f', fontSize: 18 }}
        >
          <i className="fa-regular fa-trash-can"></i>
        </div>
      </div>
    ),
  }
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
          style={{ fontSize: 19, fontWeight: "bold" }}
          items={[
            { title: <a href="/global/autorisation" style={{ fontSize: 18 }}>Autorisations</a> },
            { title: <a href="" style={{ fontSize: 18}}></a> }
          ]}
        />
        <div className={styles.listes}><h1>Liste d'autorisations</h1></div>
      
       </div>
<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
  <div className={styles.filtreContainer}>
       <div className={styles.filtreGroup}>
    <div className={styles.filtreItem}>
      <label className={styles.filtreLabel}>Date début</label>
<DatePicker
 key="debut"
  value={dateDebutFiltre ? new Date(dateDebutFiltre) : null}
  onChange={(newValue) => {
    setDateDebutFiltre(newValue ? newValue.toISOString().split('T')[0] : '');
  }}
  format="dd/MM/yyyy"
  slotProps={{
    textField: {
      size: 'medium',
      sx: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          padding: '4px',
        },
        '& .MuiOutlinedInput-input': {
          padding: '10px 14px',
        },
      }
    }
  }}
/>

    </div>

    <div className={styles.filtreItem}>
      <label className={styles.filtreLabel}>Date fin</label>
   
<DatePicker
 key="fin"
  value={dateFinFiltre ? new Date(dateFinFiltre) : null}
  onChange={(newValue) => {
    setDateFinFiltre(newValue ? newValue.toISOString().split('T')[0] : '');
  }}
  format="dd/MM/yyyy"
  slotProps={{
    textField: {
      size: 'medium',
      sx: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          padding: '4px',
        },
        '& .MuiOutlinedInput-input': {
          padding: '10px 14px',
        },
      }
    }
  }}
/>
    </div>

    <button onClick={handleFiltrerParDates} className={styles.btnFiltre}>
      Trier
    </button>

    <button 
      onClick={handleResetFiltre} 
      className={styles.btnReset}
      disabled={!dateDebutFiltre || !dateFinFiltre}
    >
      Réinitialiser
    </button>
        </div>
  </div>
</LocalizationProvider>

      <div className={styles.cardTab}>
        <div className={styles.searchBar}>
            <div className={styles.flexible}>
          <button onClick={goAjout}>
            <div className={styles.jk} style={{ display: "flex", alignItems: "center", gap: 10, color: "white", fontWeight: "bold", fontSize: 19 }}>
              <i className="fa-solid fa-plus"></i><span>Ajouter</span>
            </div>
          </button>
              <div className={styles.debuts}    onClick={() => {
                  
              if (dateInputRef.current) {
                dateInputRef.current.showPicker(); // ← c’est le bon appel natif
              }
            }}
          >
            <label style={{cursor :"pointer"}}>
              {selectedDate
                ? dayjs(selectedDate).format('DD/MM/YYYY')
                : 'Filtrer par date'}
            </label>
             <i class="fa-regular fa-calendar-days" style={{  color: '#14535f' ,
    fontSize: 22}}></i>
            <input
  type="date"
  ref={dateInputRef}
  style={{ display: 'none' }}
  onChange={(e) => {
    const dateChoisie = e.target.value;
    setSelectedDate(dateChoisie);

    // Réinitialiser filtres début/fin
    setDateDebutFiltre('');
    setDateFinFiltre('');

    // Appel API direct pour filtrage par date unique
    if(dateChoisie) {
      fetchWithAuth(`http://localhost:5000/api/autorisations/par-date?date=${dateChoisie}`)
        .then(data => {
           const count = Array.isArray(data) ? data.length : 0;
    setSnackMessage(`${count} autorisation${count > 1 ? 's' : ''} trouvée${count > 1 ? 's' : ''}`);
    setSnackError(false);
    setOpenSnack(true);
  setConges(data)
        }
          
        )
        .catch(err => {
          setSnackMessage(err.message);
          setSnackError(true);
          setOpenSnack(true);
        });
    }
  }}
/>

                </div>
                </div>
          <div className={styles.searchB}>
            <input type="text" placeholder='Rechercher personnels ...' 
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
           dataSource={filteredConges.map(p => ({ ...p, key: p.id }))}
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
       <MenuItem onClick={handleMenuClose}>
       <i class="fa-solid fa-eye"
                       style={{ marginRight: 12, color: '#1890ff' }} ></i> 
                       <span style={{fontSize : 18}}>
  Voir fiche d’assiduité
                       </span>
 
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
 <BootstrapDialog
        onClose={() => setConfirmOpen(false)}
             aria-labelledby="customized-dialog-title"
        open={confirmOpen}
      >
        
        <div style={{margin :10 ,display  :"flex" , flexDirection :"column" ,
          alignItems :"flex-start" ,justifyContent :"center" ,gap : 20
        }}>
  <h3 style={{fontSize : 22}}>Suppression...</h3>
 <label htmlFor="id
     " style={{fontSize : 16 ,color :"#676767"}}>Voulez-vous vraiment supprimer cet autorisation ?
  
      </label> 
      <div  className={styles.supp}>
        <div className={styles.supp1}>
  <button   onClick={(()=>setConfirmOpen(false))} >Non</button>

        </div>
  <div className={styles.supp2}>
    <button   onClick={handleConfirmDelete}
   >          {loadingSupp ? (
      <Spin size="small" />
    ) : "Oui"}

   </button>
     
  </div>

      </div>
        </div>
    
        </BootstrapDialog>


    </div>
  );
};

export default Autorisations;
