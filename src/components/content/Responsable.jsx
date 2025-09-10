import React, { useState ,useEffect} from 'react';
import { Breadcrumb, Table } from 'antd';
import styles from './personnels.module.css';
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
import { Tooltip } from 'antd';
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

const Responsable = () => {
  const navigate=useNavigate()
   const navigate2=useNavigate()
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

  const [selectionType] = useState('checkbox');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRecord, setMenuRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
const [selectedDivision, setSelectedDivision] = useState(null);
  const open = Boolean(menuAnchor);


  const [selectedRecord, setSelectedRecord] = useState(null);
  
  
  const voirFicheAssiduite = (record) => {
    console.log("Matricule :", record.matricule);
    handleMenuClose()
     navigate('/global/assiduite', { state: { matricule: record.matricule } });
    // Navigate ou autre logique ici
  }
function formatPhoneNumber(num) {
  if (!num) return '-';
  // Supposons que num est une chaîne de chiffres, exemple: "0385416529"
  // On peut insérer les espaces comme ça : "038 54 165 29"
  return num.replace(/(\d{3})(\d{2})(\d{3})(\d{2})/, '$1 $2 $3 $4');
}
const filteredPersonnels = personnels.filter(p => {
  const lower = searchText.toLowerCase();

  // Vérifie correspondance texte
  const matchesSearch =
    p.matricule.toLowerCase().includes(lower) ||
    p.nom.toLowerCase().includes(lower) ||
    p.prenom.toLowerCase().includes(lower) ||
    p.email.includes(searchText);

  // Si aucune division sélectionnée, on affiche tout
  if (!selectedDivision) return matchesSearch;

  // Sinon, on filtre aussi par division
  return matchesSearch && p.iddiv === selectedDivision;
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
    navigate("/global/ajout_respo")
  }
useEffect(() => {
    fetchWithAuth('http://localhost:5000/api/divisions/with_count_rh')
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
  }, [personnels ,divisions]);


useEffect(() => {
    setLoading(true);
    fetchWithAuth('http://localhost:5000/api/responsables')
      .then((data) => {
        if (Array.isArray(data)) {
          setPersonnels(data);
          console.log(data)
          setErrorMsg(null);
        } else if (data.error) {
          setErrorMsg(data.error);
          setPersonnels([]);
        } else {
          setErrorMsg('Format de données inattendu');
          setPersonnels([]);
        }
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setPersonnels([]);
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
console.log(recordToDelete.idrh)
    fetchWithAuth(`http://localhost:5000/api/responsables/${recordToDelete.idrh}`, {
      method: 'DELETE',
    })
      .then(() => {
        setSnackMessage("Responsable supprimé avec succès");
        setSnackError(false);
        setOpenSnack(true);
        setPersonnels((prev) => prev.filter(p => p.idpers !== recordToDelete.idpers));
      })
      .catch((err) => {
        console.error("Erreur suppression :", err);
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
    setSelectedRecord(record)
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
  },
  {
    title: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        Photos
      </div>
    ),
    dataIndex: 'image',
    key: 'image',
    render: (text, record) => (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Avatar
          alt={`${record.prenom} ${record.nom}`}
          src={`http://localhost:5000/uploads/${record.image}`}
          sx={{ width: 60, height: 60 }}
        />
      </div>
    ),
  },
  {
    title: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        Nom & prénom
      </div>
    ),
    key: 'nomprenomdivision',
    render: (_, record) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <strong>{record.nom} {record.prenom}</strong><br />
        <small style={{ color: '#555', fontWeight: "bold" }}>{record.nomdivision || 'Sans division'}</small>
      </div>
    ),
  },
 {
  title: (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      Email
    </div>
  ),
  dataIndex: 'email',
  key: 'email',
  render: (text) => (
    <div style={{ textAlign: 'center' }}>
   {text}
    </div>
  ),
}
,
  {
    title: '',
    key: 'actions',
    render: (_, record) => (
      <div style={{ display: 'flex', width: "70%", alignItems: "center", justifyContent: "space-between" }}>
       
        <Tooltip title='Modifier'  >
      
        <div className={styles.iconCircle}      onClick={() => navigate('/global/modifier_respo', { state: { record } })}    
          >
                    
                
                          
              <IconButton
                                aria-label="more"
                                id="long-button"
                                     aria-haspopup="true"
                                size="small"
                              >

          <EditOutlined
            style={{ color: '#1B6979', fontSize: 20 }}
    />
    </IconButton>
         
        </div>
        </Tooltip>
          <Tooltip title='Supprimer'  >
        
    
        <div className={styles.iconCircle}    onClick={() => handleDeleteClick(record)}>
          
            <IconButton
                                aria-label="more"
                                id="long-button"
                                     aria-haspopup="true"
                                size="small"
                              >
                              
                              <i
            className="fa-regular fa-trash-can"
            style={{ color: '#ff4d4f', fontSize: 18, cursor: 'pointer' }}
                ></i>
                </IconButton>
            
        </div>
            </Tooltip>
         </div>
    ),
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
          style={{ fontSize: 19, fontWeight: "bold" }}
          items={[
            { title: <a href="" style={{ fontSize: 19 }}>Responsable</a> },
            { title: <a href="" style={{ fontSize: 19 }}>Listes</a> }
          ]}
        />
        <div className={styles.listes}><h1>Liste responsable</h1></div>
      </div>
·
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
    if (selectedDivision === division.iddiv) {
      setSelectedDivision(null); // toggle off if already selected
    } else {
      setSelectedDivision(division.iddiv);
    }
  }}
>
  <h2>{division.nomdivision}</h2>
  <div className={styles.chiffre}>
    <h2>{division.total_personnels}</h2>
  </div>
</div>

          ))
        )}
      </div>
      <div className={styles.cardTab}>
        <div className={styles.searchBar}>
          <button onClick={goAjout}>
            <div className={styles.jk} style={{ display: "flex", alignItems: "center", gap: 10, color: "white", fontWeight: "bold", fontSize: 19 }}>
              <i className="fa-solid fa-plus"></i><span>Ajouter</span>
            </div>
          </button>
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
           dataSource={filteredPersonnels.map(p => ({ ...p, key: p.idpers }))}
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
       <MenuItem 
       onClick={() => {
  voirFicheAssiduite(selectedRecord); // 👈 utilisez selectedRecord
  handleMenuClose();
}}>
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
     " style={{fontSize : 16 ,color :"#676767"}}>Voulez-vous vraiment supprimer ce responsable ?
  
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

export default Responsable;
