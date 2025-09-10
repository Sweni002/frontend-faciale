import { Breadcrumb } from "antd";
import React, { useEffect, useRef, useState } from "react";
import styles from "./modifier.module.css";
import Perso from "../../assets/v4.jpg";
import Logo from "../../assets/1.png";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Alert from "@mui/material/Alert";
import { useLocation, useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SnackbarContent from '@mui/material/SnackbarContent';
 import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Spin } from "antd";
import { Checkbox, FormControlLabel } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel,Menu } from '@mui/material';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "white",
    borderRadius: "30px",
    padding: theme.spacing(4),
    width: "100%",
    maxWidth: "500px",
  },
}));

const ModAuto = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageURL, setSelectedImageURL] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const fileInputRef = useRef(null);
 const [divisions, setDivisions] = useState([]);
  const [search, setSearch] = useState("");
const [selectedDivision, setSelectedDivision] = useState(null); // état sélection
 const [openSnack, setOpenSnack] = useState(false);
const [matricule, setMatricule] = useState('');
const [motif, setMotif] = useState('');
const [dateDebut, setDateDebut] = useState('');
const [dateFin, setDateFin] = useState('');
const [openMatriculeDialog, setOpenMatriculeDialog] = useState(false);
const [selectedMatricule, setSelectedMatricule] = useState(null);
const [matricules, setMatricules] = useState([]); 
const [loading ,setLoading] =useState(false)
const [searchMatricule, setSearchMatricule] = useState("");
const [personnels, setPersonnels] = useState([]);
const [errorMsg, setErrorMsg] = useState(null);
const [snackMessage, setSnackMessage] = useState(""); // état pour le message
const   [idPointage ,setId]=useState('')
const [isSuccess, setIsSuccess] = useState(false);
const [searchPers, setSearchPers] = useState("");
const [selectedPers, setSelectedPers] = useState(null);
const [types, setTypes] = useState([]);
const typeDivRef = useRef(null);
const [typeTouched, setTypeTouched] = useState(false);
const [selectedType, setSelectedType] = useState(null);
const [isOneDayAbsence, setIsOneDayAbsence] = useState(true);
const [anchorElType, setAnchorElType] = useState(null);
const openType = Boolean(anchorElType);
const [demiJournee, setDemiJournee] = useState("complete"); // ← valeur par défaut
 // 'matin', 'apres-midi' ou ''
const selectRef = useRef(null);
const [openSelect, setOpenSelect] = useState(false);

const [errors, setErrors] = useState({
  matricule: false,
  type :false ,
  motif: false,
    demi_journee :false ,
  dateDebut: false,
  dateFin: false,
  // autres champs...
});
 const location = useLocation();
  const { record } = location.state || {};

  const [formData, setFormData] = useState({
    motif: '',
    date_debut: '',
    date_fin: '',
    nbjours: '',
    etat: '',
    idpersonnel: '',
  });

useEffect(() => {
  if (record) {
    console.log(record)
    setId(record.id || '');
    setMotif(record.motif || '');
    setSelectedType({
      idtype :record.idtype ,
      nomtype :record.nomtype
    })
    setDemiJournee(record.demi_journee || "complete") ;
    console.log("demi_journee :" ,record.demi_journee)
    // Gère les deux cas : un jour ou plusieurs jours
    if (record.date_absence) {
      setDateDebut(record.date_absence.split('T')[0]);
      setDateFin(record.date_absence.split('T')[0]);
      setIsOneDayAbsence(true);
      
    } else {
      setDateDebut(record.date_debut ? record.date_debut.split('T')[0] : '');
      setDateFin(record.date_fin ? record.date_fin.split('T')[0] : '');
      setIsOneDayAbsence(false);
    }

    setSelectedMatricule({
      idpers: record.idpers,
      matricule: record.matricule,
      nom: record.nom,
      prenom: record.prenom,
    });
  }
}, [record]);

  // Le reste du formulaire : champs liés à `formData`, bouton enregistrer, etc.
const CustomSelectIcon = () => (
  <IconButton
    aria-label="more"
    size="large"
    onClick={() => setOpenSelect(true)} // ouvre le Select
    style={{ cursor: "pointer" }}
  >
    <i
      className="fa-solid fa-chevron-down"
      style={{ color: "#1B6979", fontSize: "15px" }}
    ></i>
  </IconButton>
);

const validateForm = () => {
  console.log({selectedMatricule , demiJournee , motif ,selectedType , dateDebut})
const newErrors = {
  matricule: !selectedMatricule,
  motif: !motif.trim(),
  type: !selectedType,
  demi_journee: isOneDayAbsence && !demiJournee, // ← seulement si un jour
  dateDebut: !dateDebut.trim(),
  dateFin: !isOneDayAbsence && !dateFin.trim(),
};

  setErrors(newErrors);
  return !Object.values(newErrors).some(Boolean);
};

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const data = await fetchWithAuth('http://localhost:5000/api/types');
        setTypes(data); // supposé retourner [{idtype, nomtype}, ...]
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

 const  chargerLoading= () => {
  setLoading(true);
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

 const handleCloseSnack = (event, reason) => {
  if (reason === 'clickaway') {
    // Si on clique hors du snackbar, on ferme juste le snackbar, pas de navigation
    setOpenSnack(false);
    return;
  }
  // Si on ferme le snackbar avec le bouton "close" (croix), on ferme juste le snackbar
  setOpenSnack(false);
};
const action = (
  <>
   {isSuccess && (
      <Button
        color="primary"
        size="medium"
        onClick={() => {
          setOpenSnack(false);
          navigate("/global/autorisation");
        }}
        sx={{ p: 1, fontSize: 17 }}
      >
        Voir
      </Button>
    )}
    <IconButton
  size="small"
  aria-label="close"
  color="inherit"
  onClick={handleCloseSnack}
  sx={{
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)', // couleur au survol (exemple gris clair)
      color: '#f44336', // changer la couleur de l'icône au hover (ex: rouge)
    },
    transition: 'background-color 0.3s, color 0.3s',
  }}
>
  <CloseIcon fontSize="medium" />
</IconButton>

  </>
);
const filteredMatricules = matricules.filter(
  (m) =>
    m.nom.toLowerCase().includes(searchMatricule.toLowerCase()) ||
    m.prenom.toLowerCase().includes(searchMatricule.toLowerCase()) ||
    m.matricule.toLowerCase().includes(searchMatricule.toLowerCase())
);

const handleOpenMatriculeDialog = () => {
  setOpenMatriculeDialog(true);
};

const handleCloseMatriculeDialog = () => {
  setOpenMatriculeDialog(false);
};

useEffect(() => {
  if (!openMatriculeDialog) return; // ❗ Optimisation : charger uniquement quand ouvert

  setLoading(true);
  fetchWithAuth('http://localhost:5000/api/personnels')
    .then((data) => {
      if (Array.isArray(data)) {
        setPersonnels(data);
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
}, [openMatriculeDialog]); // ✅ recharger uniquement à l'ouverture du dialog


 useEffect(() => {
   fetch('http://localhost:5000/api/divisions/with_count', {
     credentials: "include", // si besoin pour les cookies de session
   })
     .then((res) => res.json())
     .then((data) => {
       console.log('Données divisions reçues:', data);
 
       if (data.error) {
         alert("Erreur API : " + data.error);
         setDivisions([]);
       } else if (Array.isArray(data)) {
         setDivisions(data);
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

 const filteredDivisions = divisions.filter((div) =>
    div.nomdivision.toLowerCase().includes(search.toLowerCase())
  );


  const goBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };



const updateAutorisation = async () => {
  if (!validateForm()) return;

  setLoading(true);

  if (!isOneDayAbsence && new Date(dateDebut) > new Date(dateFin)) {
    setSnackMessage("La date de début ne peut pas être postérieure à la date de fin.");
    setIsSuccess(false);
    setLoading(false);
    setOpenSnack(true);
    return;
  }

  const formData = {
    idpers: selectedMatricule.idpers,
    motif,
     idtype : selectedType.idtype ,
    date_debut: dateDebut,
    date_fin: isOneDayAbsence ? dateDebut : dateFin,
    demi_journee: isOneDayAbsence ? (demiJournee || "complete") : "complete", // ← toujours défini

  };
console.log("donne :" ,formData)
  try {
    const data = await fetchWithAuth(`http://localhost:5000/api/autorisations/${record.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setSnackMessage("Autorisation mise à jour avec succès.");
    setIsSuccess(true);
    setOpenSnack(true);
    setLoading(false);

    // Réinitialisation des champs
    setSelectedMatricule(null);
    setMotif('');
    setDateDebut('');
    setDateFin('');
   setSelectedType(null); 
       setDemiJournee("complete")// ← réinitialise le type



    sessionStorage.setItem('snackMessage', 'Autorisation modifié.');
sessionStorage.setItem('snackError', 'false');
    navigate('/global/autorisation')
     // désélection après modification
  } catch (error) {
    setSnackMessage("Erreur lors de la mise à jour : " + error.message);
    setIsSuccess(false);
    setOpenSnack(true);
    setLoading(false);
  }
};




  return (
    <div className={styles.personnels}>
      <div className={styles.break}>
        <Breadcrumb
          style={{ fontSize: 17, fontWeight: "bold" }}
          items={[
            {
              title: (
                <a href="/global/autorisation" style={{ fontSize: 17 }}>
                  Autorisation
                </a>
              ),
            },
            {
              title: (
                <a href="" style={{ fontSize: 17 }}>
                  Modification
                </a>
              ),
            },
          ]}
        />
        <div className={styles.listes}>
          <h1>Modifier autorisation</h1>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.container}>
          <div className={styles.retour} onClick={goBack}>
            <IconButton
                        aria-label="more"
                        id="long-button"
                             aria-haspopup="true"
                        size="large"
                      >
                                <i className="fa-solid fa-arrow-left"></i>
  
                                 </IconButton>
           </div>

          <div className={styles.sary}>
            <img src={Perso} alt="" />
          </div>

          <div className={styles.form}>
       
   <div className={styles.inputDiv} onClick={() => setOpenMatriculeDialog(true)}>
              <label htmlFor="matricule">Matricule</label>

              <div className={`${styles.section} ${errors.matricule ? styles.errorBorder : ''}`}>
                <p
                  className={selectedMatricule ? styles.selectedDivisionText : styles.placeholderText}
                  title={selectedMatricule ? `${selectedMatricule.matricule} - ${selectedMatricule.nom}` : "Sélectionner un employé"}
                >
                  {selectedMatricule
                    ? `${selectedMatricule.matricule} - ${selectedMatricule.nom}`
                    : "Sélectionner un employé"}
                </p>
               <IconButton
                                    aria-label="more"
                                    id="long-button"
                                         aria-haspopup="true"
                                    size="large"
                                  >
                            <i className="fa-solid fa-chevron-down"></i>
                            </IconButton>       </div>

              {errors.matricule && (
                <small style={{ color: "red", fontSize: "13px", marginTop: 5 }}>
                  Veuillez sélectionner un matricule.
                </small>
              )}
            </div>
 <Menu
  anchorEl={anchorElType}
  open={openType}
  onClose={() => setAnchorElType(null)}
  PaperProps={{
    style: {
      minWidth: typeDivRef.current ? typeDivRef.current.offsetWidth : 200,
    },
  }}
>
  {types.map((t) => (
    <MenuItem
      key={t.idtype}
      onClick={() => {
        setSelectedType(t);
        setAnchorElType(null);
         setErrors(prev => ({ ...prev, type: false })); // ← important

      }}
    >
      {t.nomtype}
    </MenuItem>
  ))}
</Menu>


<div
  className={styles.inputDiv}
  ref={typeDivRef}
  onClick={(e) => {
    setAnchorElType(e.currentTarget);
    setTypeTouched(true); // ✅ l'utilisateur a interagi
  }}
>

  <label htmlFor="type">Type</label>

  <div className={`${styles.section} ${errors.type ? styles.errorBorder : ''}`}>
    <p
      className={selectedType ? styles.selectedDivisionText : styles.placeholderText}
      title={selectedType ? selectedType.nomtype : "Sélectionner un type"}
    >
      {selectedType ? selectedType.nomtype : "Sélectionner un type"}
    </p>
    <IconButton aria-label="more" size="large">
      <i className="fa-solid fa-chevron-down"></i>
    </IconButton>
  </div>

 {errors.type && (
  <small style={{ color: "red", fontSize: "13px", marginTop: 5 }}>
    Veuillez sélectionner un type.
  </small>
)}


</div>
{/* Motif */}
<div className={styles.inputMotif}>
  <label htmlFor="motif">Motif</label>
  <textarea
    id="motif"
    rows="4"
    className={`${styles.textarea} ${errors.motif ? styles.errorBorder : ''}`}
     value={motif}
    onChange={(e) => {
      setMotif(e.target.value);
      if (errors.motif) {
        setErrors(prev => ({ ...prev, motif: false }));
      }
    }}
    placeholder="Entrez le motif d'autorisation "
  />
  {errors.motif && (
    <small style={{ color: "red", fontSize: "13px", marginTop: 5 }}>
      Le motif est requis.
    </small>
  )}
</div>

<div className={styles.inputDiv}>
  <FormControlLabel
    control={
      <Checkbox
        checked={isOneDayAbsence}
        onChange={(e) => {
          const checked = e.target.checked;
          setIsOneDayAbsence(checked);
          if (checked) {
            setDateFin(dateDebut); // synchronise date fin
          }
        }}
        color="primary"
      />
    }
    label="Un seul jour d'absence"
    style={{ fontWeight: "bold", color: "#333" }}
  />
</div>

{/* Dates début et fin */}
<div className={styles.dateContainer}>
  <div className={styles.dateField}>
  <label htmlFor="dateDebut">{isOneDayAbsence ? "Date" : "Date début"}</label>

    <input
      type="date"
      id="dateDebut"
      className={errors.dateDebut ? styles.errorBorder : ''}
      value={dateDebut}
      onChange={(e) => {
        const val = e.target.value;
        setDateDebut(val);
        if (isOneDayAbsence) setDateFin(val); // synchronise fin si un seul jour
        if (errors.dateDebut) {
          setErrors(prev => ({ ...prev, dateDebut: false }));
        }
      }}
    />
    {errors.dateDebut && (
      <small style={{ color: "red", fontSize: "13px", marginTop: 5 }}>
        La date de début est requise.
      </small>
    )}
  </div>

  {!isOneDayAbsence && (
    <div className={styles.dateField}>
      <label htmlFor="dateFin">Date fin</label>
      <input
        type="date"
        id="dateFin"
        className={errors.dateFin ? styles.errorBorder : ''}
        value={dateFin}
        onChange={(e) => {
          setDateFin(e.target.value);
          if (errors.dateFin) {
            setErrors(prev => ({ ...prev, dateFin: false }));
          }
        }}
      />
      {errors.dateFin && (
        <small style={{ color: "red", fontSize: "13px", marginTop: 5 }}>
          La date de fin est requise.
        </small>
      )}
    </div>
  )}
    {isOneDayAbsence && (
    <div className={styles.dateField}>
      
      <label htmlFor="demiJournee">Demi-journée</label>
   
  <Select
    ref={selectRef}
    value={demiJournee}
    onChange={(e) => setDemiJournee(e.target.value)}
    displayEmpty
    IconComponent={CustomSelectIcon}
    className={errors.demiJournee ? styles.errorBorder : ''} 
    open={openSelect}
    onClose={() => setOpenSelect(false)}
  >
    <MenuItem value="complete">Absence complète</MenuItem> {/* valeur par défaut */}
    <MenuItem value="matin">Matin</MenuItem>
    <MenuItem value="apres-midi">Après-midi</MenuItem>
  </Select>
  
      {errors.demiJournee && (
        <small style={{ color: "red", fontSize: "13px", marginTop: 5 }}>
          Veuillez sélectionner une demi-journée.
        </small>
      )}
    </div>
  )}
</div>






         <div className={styles.btn}>
              <button  onClick={() => {
  if (validateForm()) {
    updateAutorisation();
  }
}}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 15,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 19,
                    justifyContent: "center",
                  }}
                >
                    {loading ? (
      <Spin size="large" />
    ) : (
      <>
        <i className="fa-solid fa-plus"></i>
        <span>Sauvegarder</span>
      </>
    )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
 <BootstrapDialog onClose={() => setOpenMatriculeDialog(false)} open={openMatriculeDialog}>
        <div className={styles.dialog}>
          <input
            type="text"
            placeholder="Rechercher un personnel..."
            value={searchPers}
            onChange={(e) => setSearchPers(e.target.value)}
          />
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>

        <DialogContent
          style={{
            minHeight: 300,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
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
                    onClick={() => {
                      setSelectedMatricule(p);
                        setErrors(prev => ({ ...prev, matricule: false }));
                      setOpenMatriculeDialog(false);
                    }}
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
        </DialogContent>
      </BootstrapDialog>

  
  <Snackbar
  open={openSnack}
  autoHideDuration={8000}
  onClose={handleCloseSnack}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
>
  <SnackbarContent
    sx={{
      p: 1,
      px: 3,
      fontSize: '17px',
      boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 3,
    }}
    message={<span style={{ marginRight: 8 }}>{snackMessage}</span>}  
    action={action}
  />
</Snackbar>



    </div>
  );
};

export default ModAuto;
