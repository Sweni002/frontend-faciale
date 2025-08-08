import React, { useState ,useEffect, useRef} from 'react';
import { Breadcrumb, Table } from 'antd';
import styles from './presences.module.css';
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
import { da } from 'date-fns/locale';

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



const Presences = () => {
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
const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
const dateInputRef = useRef(null);
const [dateDebutFiltre, setDateDebutFiltre] = useState('');
const [dateFinFiltre, setDateFinFiltre] = useState('');
const [filteredByDatePersonnels, setFilteredByDatePersonnels] = useState([]);
const [loadingPdf, setLoadingPdf] = useState(false);
const [loadingPdf1, setLoadingPdf1] = useState(false);

const [selectedRecord, setSelectedRecord] = useState(null);


const voirFicheAssiduite = (record) => {
  console.log("Matricule :", record.matricule);
   navigate('/global/assiduite', { state: { matricule: record.matricule } });
  // Navigate ou autre logique ici
};

const renderStatus = (value, type) => {
  if (value === null || value === undefined) {
    return '---';  // Texte si pas encore évalué
  }

  if (type === 'absence') {
    return value ? (
      <Tooltip title="Absent">
        <CloseCircleOutlined style={{ color: 'red', fontSize: '18px' }} />
      </Tooltip>
    ) : (
      <Tooltip title="Présent">
        <CheckCircleOutlined style={{ color: 'green', fontSize: '18px' }} />
      </Tooltip>
    );
  }

  if (type === 'retard') {
    return value ? (
      <Tooltip title="En retard">
        <ClockCircleOutlined style={{ color: 'orange', fontSize: '18px' }} />
      </Tooltip>
    ) : (
      <Tooltip title="Ponctuel">
        <CheckCircleOutlined style={{ color: 'green', fontSize: '18px' }} />
      </Tooltip>
    );
  }

  return null;
};
function formatPhoneNumber(num) {
  if (!num) return '-';
  // Supposons que num est une chaîne de chiffres, exemple: "0385416529"
  // On peut insérer les espaces comme ça : "038 54 165 29"
  return num.replace(/(\d{3})(\d{2})(\d{3})(\d{2})/, '$1 $2 $3 $4');
}
const filteredPersonnels = personnels.filter(p => {
  console.log('filtre division:', {selectedDivision, personnelDivisionId: p.divisionId, nom: p.nom});
  console.log(personnels.length)
  if (selectedDivision && String(p.divisionId) !== String(selectedDivision)) {
    return false;
  }
  const lower = searchText.toLowerCase();
  return (
    (p.matricule && p.matricule.toLowerCase().includes(lower)) ||
    (p.nom && p.nom.toLowerCase().includes(lower)) ||
    (p.prenom && p.prenom.toLowerCase().includes(lower))
  );
});

const handleFiltrerParDates = () => {
  if (!dateDebutFiltre || !dateFinFiltre) {
    setSnackMessage('Veuillez sélectionner les deux dates');
    setSnackError(true);
    setOpenSnack(true);
    return;
  }

  const debut = dayjs(dateDebutFiltre);
  const fin = dayjs(dateFinFiltre);

  if (fin.isBefore(debut)) {
    setSnackMessage('La date de fin doit être après la date de début');
    setSnackError(true);
    setOpenSnack(true);
    return;
  }

  fetchPointagesParDates(dateDebutFiltre, dateFinFiltre);
};

const handleResetFiltre = () => {
  setDateDebutFiltre('');
  setDateFinFiltre('');
  setFilteredByDatePersonnels([]);
  // Recharger les pointages pour la date sélectionnée (ou autre logique)
  if (selectedDate) {
    fetchPointagesParDates(selectedDate, selectedDate);
  } else {
    // Ou charger une liste vide ou par défaut
    setPersonnels([]);
  }
};


const fetchPointagesParDates = async (dateDebut, dateFin) => {
  setLoading(true);
  try {
    const data = await fetchWithAuth(`http://localhost:5000/api/pointage/facial/par_dates?dateDebut=${dateDebut}&dateFin=${dateFin}`);
     console.log("Données reçues du backend (filtrage entre deux dates) :", data);
    console.log("Nombre :", data.length);

    const result = data.map(p => ({
      key: p.id ,
      idpers: p.idpers,
      nom: p.personnel?.nom || "Inconnu",
      prenom: p.personnel?.prenom || "",
      matricule: p.personnel?.matricule || "",
      division: p.personnel?.division?.nom || "",
      divisionId: p.personnel?.division?.iddiv || null,
      date: p.date,  // nécessaire pour filtrage local si besoin
      matin: {
        entree: p.heure_entree_matin,
        sortie: p.heure_sortie_matin,
        retard: p.retard_matin,
        absence: p.absence_matin,
      },
      apresmidi: {
        entree: p.heure_entree_soir,
        sortie: p.heure_sortie_soir,
        retard: p.retard_soir,
        absence: p.absence_soir,
      },
      statut: p.absence ? "Absent" : "Présent",
      absence_soir: p.absence_soir,
      justificatif: p.justificatif
     
    }));
    
    setPersonnels(result);
    setFilteredByDatePersonnels(result);
        const count = Array.isArray(data) ? data.length : 0;
    setSnackMessage(`${count} pointage${count > 1 ? 's' : ''} trouvée${count > 1 ? 's' : ''}`);
    setSnackError(false);
    setOpenSnack(true); // optionnel, si tu veux montrer que c’est filtré
  } catch (error) {
    console.error(error);
    setPersonnels([]);
    setFilteredByDatePersonnels([]);
    setSnackMessage(error.message || "Erreur lors du chargement");
    setSnackError(true);
    setOpenSnack(true);
  } finally {
    setLoading(false);
  }
};


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
  if (!selectedDate) return;
  setLoading(true);

  const url = selectedDivision
    ? `http://localhost:5000/api/pointage/facial/par_date_division?date=${selectedDate}&iddiv=${selectedDivision}`
    : `http://localhost:5000/api/pointage/faciall/par_date?date=${selectedDate}`;

  fetchWithAuth(url)
    .then((response) => {
      // Si la réponse a un champ "data" (cas division), on utilise response.data, sinon response
      const pointages = Array.isArray(response.data) ? response.data : response;

      if (!Array.isArray(pointages)) {
        console.error("Données pointages invalides :", pointages);
        setPersonnels([]);
        return;
      }
      console.log(response)
      const result = pointages.map(p => {
        const pers = p.personnel || {};
        const division = pers.division || {};
        return {
          key: p.id,
          idpointage : p.id ,
          idpers: p.idpers,
          nom: pers.nom || "Inconnu",
          prenom: pers.prenom || "",
          matricule: pers.matricule || "",
          division: division.nom || "", 
          divisionId: division.iddiv || null,
            date: p.date, 
          matin: {
            entree: p.heure_entree_matin,
            sortie: p.heure_sortie_matin,
            retard: p.retard_matin,
            absence: p.absence_matin,
          },
          apresmidi: {
            entree: p.heure_entree_soir,
            sortie: p.heure_sortie_soir,
            retard: p.retard_soir,
            absence: p.absence_soir,
          },
          statut: p.absence ? "Absent" : "Présent",
          heure_entree_soir: p.heure_entree_soir,
          heure_sortie_soir: p.heure_sortie_soir,
          absence_soir: p.absence_soir,
          justificatif: p.justificatif || null,
        };
      });

      setPersonnels(result);
    
    })
    .catch((err) => {
      console.error("Erreur lors du chargement des pointages:", err);
      setPersonnels([]);
    })
    .finally(() => setLoading(false));
}, [selectedDate, selectedDivision]);

useEffect(() => {
  if (dateDebutFiltre && dateFinFiltre) {
    // Filtrage par intervalle + division optionnelle
    fetchPointagesParDates1(dateDebutFiltre, dateFinFiltre, selectedDivision);
  } else if (selectedDate) {
    // Filtrage par date unique + division optionnelle
    const url = selectedDivision
      ? `http://localhost:5000/api/pointage/facial/par_date_division?date=${selectedDate}&iddiv=${selectedDivision}`
      : `http://localhost:5000/api/pointage/faciall/par_date?date=${selectedDate}`;

    setLoading(true);

    fetchWithAuth(url)
      .then((response) => {
        const pointages = Array.isArray(response.data) ? response.data : response;

        if (!Array.isArray(pointages)) {
          setPersonnels([]);
          return;
        }

        const result = pointages.map(p => {
          const pers = p.personnel || {};
          const division = pers.division || {};
          return {
            key: p.id,
            idpointage : p.id ,
            idpers: p.idpers,
            nom: pers.nom || "Inconnu",
            prenom: pers.prenom || "",
            matricule: pers.matricule || "",
            division: division.nom || "", 
            divisionId: division.iddiv || null,
            date: p.date, 
            matin: {
              entree: p.heure_entree_matin,
              sortie: p.heure_sortie_matin,
              retard: p.retard_matin,
              absence: p.absence_matin,
            },
            apresmidi: {
              entree: p.heure_entree_soir,
              sortie: p.heure_sortie_soir,
              retard: p.retard_soir,
              absence: p.absence_soir,
            },
            statut: p.absence ? "Absent" : "Présent",
            heure_entree_soir: p.heure_entree_soir,
            heure_sortie_soir: p.heure_sortie_soir,
            absence_soir: p.absence_soir,
            justificatif: p.justificatif || null,
          };
        });

        setPersonnels(result);
      })
      .catch(() => setPersonnels([]))
      .finally(() => setLoading(false));
  } else {
    // Aucun filtre date actif, on peut choisir d'afficher tout ou rien
    setPersonnels([]);
  }
}, [selectedDivision, dateDebutFiltre, dateFinFiltre, selectedDate]);

const fetchPointagesParDates1 = async (dateDebut, dateFin, divisionId = null) => {
  setLoading(true);
  try {
    let url = `http://localhost:5000/api/pointage/facial/par_dates?dateDebut=${dateDebut}&dateFin=${dateFin}`;
    if (divisionId) {
      url += `&iddiv=${divisionId}`;
      
    }
  console.log(url)
    const data = await fetchWithAuth(url);

console.log(data.map(d => d.personnel?.division?.iddiv));

    console.log("Données reçues du backend (filtrage entre deux dates) :", data);
    console.log("Nombre :", data.length);

    const result = data.map(p => ({
      key: p.id,
      idpers: p.idpers,
      nom: p.personnel?.nom || "Inconnu",
      prenom: p.personnel?.prenom || "",
      matricule: p.personnel?.matricule || "",
      division: p.personnel?.division?.nom || "",
      divisionId: p.personnel?.division?.iddiv || null,
      date: p.date,
      matin: {
        entree: p.heure_entree_matin,
        sortie: p.heure_sortie_matin,
        retard: p.retard_matin,
        absence: p.absence_matin,
      },
      apresmidi: {
        entree: p.heure_entree_soir,
        sortie: p.heure_sortie_soir,
        retard: p.retard_soir,
        absence: p.absence_soir,
      },
      statut: p.absence ? "Absent" : "Présent",
      absence_soir: p.absence_soir,
      justificatif: p.justificatif || null,
    }));
   
    setPersonnels(result);
    setFilteredByDatePersonnels(result);

    const count = Array.isArray(data) ? data.length : 0;
    setSnackMessage(`${count} pointage${count > 1 ? 's' : ''} trouvée${count > 1 ? 's' : ''}`);
    setSnackError(false);
    setOpenSnack(true);
  } catch (error) {
    console.error(error);
    setPersonnels([]);
    setFilteredByDatePersonnels([]);
    setSnackMessage(error.message || "Erreur lors du chargement");
    setSnackError(true);
    setOpenSnack(true);
  } finally {
    setLoading(false);
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


  const goAjout=()=>{
    navigate("/global/ajout_perso")
  }
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




const handleConfirmDelete = () => {
    setLoadingSupp(true);

    if (!recordToDelete) {
      setLoadingSupp(false);
      return;
    }

    fetchWithAuth(`http://localhost:5000/api/pointage/facial/${recordToDelete.idpointage}`, {
      method: 'DELETE',
    })
      .then((res) => {
        setSnackMessage(res.message);
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

  const downloadPDF = async () => {
  if (!dateDebutFiltre || !dateFinFiltre) {
    setSnackMessage("Veuillez sélectionner une date de début et une date de fin pour exporter le PDF.");
    setSnackError(true);
    setOpenSnack(true);
    return;
  }

  setLoadingPdf(true);

  let url = `http://localhost:5000/api/pointage/facial/pdf/division/interval?date_debut=${dateDebutFiltre}&date_fin=${dateFinFiltre}`;
  if (selectedDivision) {
    url += `&iddiv=${selectedDivision}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include', // pour transmettre le cookie d'authentification
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
    link.download = `pointages_${dateDebutFiltre}_au_${dateFinFiltre}.pdf`;
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
    setLoadingPdf(false);
  }
};




const exportPDF = async () => {
  if (!selectedDate) {
    setSnackMessage("Sélectionner une date pour exporter le PDF.");
    setSnackError(true);
    setOpenSnack(true);
    return;
  }

  setLoadingPdf1(true);

  let url = selectedDivision
    ? `http://localhost:5000/api/pointage/facial/pdf/division/?date=${selectedDate}&iddiv=${selectedDivision}`
    : `http://localhost:5000/api/pointage/facial/pdf?date=${selectedDate}`;

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
    link.download = `pointages_${selectedDate}.pdf`;
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


  const handleMenuClick = (event, record) => {
      console.log("rec:" ,record)
    setMenuAnchor(event.currentTarget);
    setMenuRecord(record);
     setSelectedRecord(record);
      setRecordToDelete(record);
     
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuRecord(null);
  };
const columns = [

,
,
  {
    title: 'Matricule',
    dataIndex: 'matricule',
    key: 'matricule',
  },
  {
  title: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        Nom
      </div>
    ),
  key: 'nom_prenom',
  render: (record) => (
    <div style={{
      display: 'flex',
      flexDirection :"column" ,
      alignItems: 'center',
      justifyContent: 'space-between',
    textAlign :"center"
    }}>
      <strong>{record.nom} {record.prenom}</strong>
      <small style={{ color: '#555', fontWeight: "bold"}} >
        {record.division || '—'}
      </small>
    </div>
  ),
},
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    align: 'center',
    render: (val) => val ? new Date(val).toLocaleDateString('fr-FR') : '—',
  },
  {
    title: <span style={{ fontWeight: 'bold' }}>Matin</span>,
    children: [
      {
        title: 'Entrée',
        dataIndex: ['matin', 'entree'],
        key: 'matin_entree',
        align: 'center',
        className: styles.borderedLeft,    // <-- Ajout ici
        render: (val) => val ?? '---',
      },
      {
        title: 'Sortie',
        dataIndex: ['matin', 'sortie'],
        key: 'matin_sortie',
        align: 'center',
        render: (val) => val ?? '---',
      },
      {
        title: <span style={{ color: '#FFA500', fontWeight: 'bold' }}>Retard</span>,
        dataIndex: ['matin', 'retard'],
        key: 'matin_retard',
        align: 'center',
        render: (val) => (
          <Tooltip title={val ? "Retardé" : "À l'heure"}>
            {val
              ? <CheckCircleIcon style={{ color: '#FFA500' }} />
              : '---'
              }
          </Tooltip>
        ),
      },
     {
  title: <span style={{ color: 'red', fontWeight: 'bold' }}>Absence</span>,
  key: 'matin_absence',
  align: 'center',
  render: (text, record) => {
    const val = record.matin.absence;
    const presence = record.presence;
    console.log("matin",val)
    if (val === null || val === undefined ) {
      return '---';
    }
    return val
      ? <CheckCircleIcon style={{ color: 'red' }} />
      : '---';
  },
},
,
 {
  title: <span style={{ color: 'green', fontWeight: 'bold' }}>Présence</span>,
  key: 'matin_presence',
  align: 'center',
  render: (record) => {
    const absenceMatin = record.matin?.absence;
    if (absenceMatin === null || absenceMatin === undefined) {
      return '---';
    }
    return absenceMatin
      ? '---' // absent -> icône grise
      : <CheckCircleIcon style={{ color: 'green' }} />; // présent
  },
},
,
    ],
  },

  {
    title: <span style={{ fontWeight: 'bold' }}>Après-midi</span>,
    children: [
      {
        title: 'Entrée',
        dataIndex: ['apresmidi', 'entree'],
        key: 'apresmidi_entree',
        align: 'center',
        className: styles.borderedLeft,    // <-- Ajout ici
        render: (val) => val ?? '---',
      },
      {
        title: 'Sortie',
        dataIndex: ['apresmidi', 'sortie'],
        key: 'apresmidi_sortie',
        align: 'center',
        render: (val) => val ?? '---',
      },
      {
        title: <span style={{ color: '#FFA500', fontWeight: 'bold' }}>Retard</span>,
        dataIndex: ['apresmidi', 'retard'],
        key: 'apresmidi_retard',
        align: 'center',
        render: (val) => (
          <Tooltip title={val ? "Retardé" : "À l'heure"}>
            {val
              ? <CheckCircleIcon style={{ color: '#FFA500' }} />
              : '---'}
          </Tooltip>
        ),
      },
  {
  title: <span style={{ color: 'red', fontWeight: 'bold' }}>Absence</span>,
  key: 'apresmidi_absence',
  align: 'center',
  render: (_, record) => {
    const val = record.absence_soir;
    const presence = record.presence;
    if (val === null || val === undefined ) {
      return '---';
    }
    return val
      ? <CheckCircleIcon style={{ color: 'red' }} />
      : '---';
  },
},
 {
  title: <span style={{ color: 'green', fontWeight: 'bold' }}>Présence</span>,
  key: 'apresmidi_presence',
  align: 'center',
  render: (record) => {
    const absenceSoir = record.apresmidi?.absence;
    if (absenceSoir === null || absenceSoir === undefined) {
      return '---';
    }
    return absenceSoir
      ? '---'
      : <CheckCircleIcon style={{ color: 'green' }} />;
  },
},
    ],
  },
{
  title: 'Statut',
  dataIndex: 'statut',
  key: 'statut',
  align: 'center',
  render: (statut, record) => {
    if (!record.justificatif) return null;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          textAlign: 'center',
          maxWidth: 180,
          margin: 'auto',
          color: '#777',
        }}
      >
        <InfoCircleOutlined style={{ fontSize: 18 }} />
        <span style={{ fontSize: 18, wordWrap: 'break-word' }}>
          {record.justificatif}
        </span>
      </div>
    );
  },
} ,
{
    title: '',
    key: 'actions',
    render: (_, record) => (
      <div style={{ display: 'flex', gap: 10, alignItems: 'center'}}>
    
         <div onClick={(e) => handleMenuClick(e, record)}>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            size="small"
          >
            <MoreVertIcon style={{ fontSize: 20 }} />
          </IconButton>
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
          style={{ fontSize: 14, fontWeight: "bold" }}
          items={[
            { title: <a href="" style={{ fontSize: 15 }}>Fiche</a> },
            { title: <a href="" style={{ fontSize: 15 }}>Presences</a> }
          ]}
        />
        <div className={styles.listes}><h1>Fiches de presences</h1></div>
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
    console.log("iddiv" , division.iddiv)
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

      <button onClick={handleFiltrerParDates} className={styles.btnFiltre}>Trier</button>
   
      <button onClick={handleResetFiltre} className={styles.btnReset} disabled={!dateDebutFiltre && !dateFinFiltre}>Réinitialiser</button>
      <div className={styles.trier}>
        <button onClick={downloadPDF}
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
      <div className={styles.debut}    onClick={() => {
        
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
   <i class="fa-regular fa-calendar-days"></i>
   
   <input
    type="date"
    ref={dateInputRef}
    style={{ display: 'none' }}
   onChange={(e) => {
    const dateChoisie = e.target.value;
    setSelectedDate(dateChoisie);
   
    // Réinitialiser les filtres de dates manuelles si une date est choisie ici
    setDateDebutFiltre('');
    setDateFinFiltre('');

    console.log("DATE CHOISIE :", dateChoisie);
  }}
  />
      </div>
<Tooltip
  title="Exporter en PDF"
  arrow
 
>
  <div
    className={styles.pdf}
    onClick={exportPDF}
    aria-label="Exporter en PDF"
  >
       {loadingPdf1 ? <Spin size="small" /> : (
     <i className="fa-solid fa-file-export"></i>

  )} 
    </div>
</Tooltip>

    
    
      </div>
          <div className={styles.searchB}>
            <input type="text" placeholder='Rechercher personne...' 
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
    dataSource={filteredPersonnels.map(p => ({ ...p, key: p.idpointage }))}
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


<MenuItem onClick={() => {
  voirFicheAssiduite(selectedRecord); // 👈 utilisez selectedRecord
  handleMenuClose();
}}>
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
     " style={{fontSize : 16 ,color :"#676767"}}>Voulez-vous vraiment supprimer ce pointage ?
  
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

export default Presences;
