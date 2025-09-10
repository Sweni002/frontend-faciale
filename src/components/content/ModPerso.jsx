import { Breadcrumb } from "antd";
import React, { useEffect, useRef, useState } from "react";
import styles from "./modifier.module.css";
import Perso from "../../assets/v3.png";
import Logo from "../../assets/1.png";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SnackbarContent from '@mui/material/SnackbarContent';
 import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Spin } from "antd";
import { useLocation } from 'react-router-dom';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "white",
    borderRadius: "30px",
    padding: theme.spacing(4),
    width: "100%",
    maxWidth: "500px",
  },
}));

const ModPerso = () => {
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
const [matricule, setMatricule] = useState("");
const [nom, setNom] = useState("");
const [prenom, setPrenom] = useState("");
const [tel, setTel] = useState("");
const [loading ,setLoading] =useState(false)
const { state } = useLocation();
  const record = state?.record; // Ajoute une vérification au cas où
 const [snackMessage, setSnackMessage] = useState('');
  const [snackError, setSnackError] = useState(false);

  
  console.log('Données reçues :', record);
const [errors, setErrors] = useState({
  matricule: false,
  nom: false,
  prenom: false,
  tel: false,
  division: false,
  photo: false
});

useEffect(() => {
  if (record) {
    setMatricule(record.matricule || "");
    setNom(record.nom || "");
    setPrenom(record.prenom || "");
    setTel(record.numtel || "");
   setSelectedDivision({
      iddiv: record.iddiv,
      nomdivision: record.nomdivision
    });
    if (record.image) {
      // Si image backend déjà en base64 ou si tu veux afficher un lien
      setSelectedImageURL(`http://localhost:5000/uploads/${record.image}`);
    }
}
}, [record]);

const handleUpdatePersonnel = async () => {
  setLoading(true);

  const formData = {
    matricule,
    nom,
    prenom,
    email: "", // inutile pour l’instant
    numtel: tel,
    iddiv: selectedDivision?.iddiv,
    // image uniquement si c’est une nouvelle image (en base64)
    image: selectedImageURL?.startsWith("data:") ? selectedImageURL : null
  };

  try {
    const response = await fetch(`http://localhost:5000/api/personnels/${record.idpers}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      setSnackMessage(data.error || 'Erreur inconnue');
        setSnackError(true);
      setLoading(false);
      return;
    }else{
      setSnackError(false);
        setLoading(false)
         setMatricule("");
    setNom("");
    setPrenom("");
    setTel("");
    setSelectedDivision(null);
    setSelectedImage(null);
    setSelectedImageURL(null);
sessionStorage.setItem('snackMessage', 'Personnel modifié.');
sessionStorage.setItem('snackError', 'false');
navigate("/global/personnel");


   }

  } catch (error) {
     setSnackMessage('Erreur réseau ou serveur.');
      setSnackError(true);
      setOpenSnack(true);
      setLoading(false)
  }
};

 const  chargerLoading= () => {
  setLoading(true);
};
const handleCreatePersonnel = async () => {
  setLoading(true);

  const formData = {
    matricule,
    nom,
    prenom,
    email: "", // si tu ne l'utilises pas pour l’instant
    numtel: tel,
    iddiv: selectedDivision.iddiv,
    image: selectedImageURL // en base64
  };

  try {
    const response = await fetch("http://localhost:5000/api/personnels/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      alert("Erreur : " + (data.error || "Erreur inconnue"));
      setLoading(false);
      return;
    }

    setOpenSnack(true);
    setLoading(false);

    // Optionnel : vider les champs
    setMatricule("");
    setNom("");
    setPrenom("");
    setTel("");
    setSelectedDivision(null);
    setSelectedImage(null);
    setSelectedImageURL(null);

  } catch (error) {
    console.error("Erreur d'ajout :", error);
    alert("Une erreur est survenue lors de l'ajout.");
    setLoading(false);
  }
};

 
const validateForm = () => {
  const newErrors = {
    matricule: !matricule.trim(),
    nom: !nom.trim(),
    prenom: !prenom.trim(),
    division: !selectedDivision,
       photo: !selectedImage && !selectedImageURL,
    tel :  !tel.trim()
     };
  setErrors(newErrors);
  return !Object.values(newErrors).some(Boolean);
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
    <Button color="primary" size="medium" onClick={() => {
        setOpenSnack(false);
        navigate("/global/personnel"); // navigation seulement ici
      }}
      sx={{p : 1 ,fontSize : 17}}>
       Voir
    </Button>
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

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    setLoadingImage(true);
    setSelectedImage(file);
    setErrors(prev => ({ ...prev, photo: false })); // réinitialiser erreur
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImageURL(reader.result);
      setLoadingImage(false);
    };
    reader.readAsDataURL(file);
  }
};

   function handleSelectDivision(div) {
    setSelectedDivision(div);
    setErrors(prev => ({ ...prev, division: false })); // ✅ enlève l'erreur

    handleClose(); // optionnel : fermer le dialog après sélection
  }


  return (
    <div className={styles.personnels}>
      <div className={styles.break}>
        <Breadcrumb
          style={{ fontSize: 17, fontWeight: "bold" }}
          items={[
            {
              title: (
                <a href="/global/personnel" style={{ fontSize: 17 }}>
                  Personnels
                </a>
              ),
            },
            {
              title: (
                <a href="" style={{ fontSize: 17 }}>
                  Modifier
                </a>
              ),
            },
          ]}
        />
        <div className={styles.listes}>
          <h1>Modification personnels</h1>
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
            <div className={styles.inputM}>
              <label htmlFor="matricule">Matricule</label>
     <input
  type="text"
  id="matricule"
  value={matricule}
  onChange={(e) => {
    setMatricule(e.target.value);
    if (errors.matricule) {
      setErrors(prev => ({ ...prev, matricule: false }));
    }
  }}
  style={{
    border: errors.matricule ? "2px solid red" : undefined,
    borderRadius: "5px"
  }}
/>
{errors.matricule && (
  <small style={{ color: "red", fontSize: "13px" ,marginTop : 5 }}>
    Le matricule est requis.
  </small>
)}

            </div>
            <div className={styles.inputNom}>
              <div className={styles.nom}>
                <label htmlFor="nom">Nom</label>
                <input type="text" id="nom"
                value={nom}
                onChange={(e) => {
          setNom(e.target.value);
          if (errors.nom) {
            setErrors(prev => ({ ...prev, nom: false }));
          }
        }}
        style={{
          border: errors.nom ? "2px solid red" : undefined,
          borderRadius: "5px"
        }}
      />
      {errors.nom && <small style={{ color: "red", fontSize: "13px" ,
        marginTop : 5
       }}>Le nom est requis.</small>}

              </div>
              <div className={styles.prenom}>
                <label htmlFor="prenom">Prenom</label>
                <input type="text" id="prenom" 
                 value={prenom}
                 onChange={(e) => {
          setPrenom(e.target.value);
          if (errors.prenom) {
            setErrors(prev => ({ ...prev, prenom: false }));
          }
        }}
        style={{
          border: errors.prenom ? "2px solid red" : undefined,
          borderRadius: "5px"
        }}
      />
      {errors.prenom && <small style={{ color: "red", fontSize: "13px"  ,
        marginTop :5
      }}>Le prénom est requis.</small>}
 
              </div>
            </div>
            <div className={styles.mitam}>
<div className={styles.inputDiv} onClick={handleClickOpen}
>
  <label htmlFor="poste">Division</label>
  <div  className={`${styles.section} ${errors.division ? styles.errorBorder : ''}`}

      >
    <p
      className={
        selectedDivision ? styles.selectedDivisionText : styles.placeholderText
      }
      title={selectedDivision ? selectedDivision.nomdivision : "Selectionner une division"}
    >
      {selectedDivision ? selectedDivision.nomdivision : "Selectionner une division"}
    </p>
       <IconButton
                        aria-label="more"
                        id="long-button"
                             aria-haspopup="true"
                        size="large"
                      >
    <i className="fa-solid fa-chevron-down"></i>
    </IconButton>
  </div>
    {errors.division && <small style={{ color: "red", fontSize: "13px"  
      ,marginTop : 5
    }}>Veuillez sélectionner une division.</small>}

</div>

        <div className={styles.inputTel}>
                <label htmlFor="email">Téléphone</label>
                <input
                  type="texte"
                  id="email"
                  value={tel}
                  placeholder="ex: 038 54 165 29"
                  onChange={(e) => {
          setTel(e.target.value);
          if (errors.tel) {
            setErrors(prev => ({ ...prev, tel: false }));
          }
        }}
        style={{
          border: errors.tel ? "2px solid red" : undefined,
          borderRadius: "5px"
        }}
      />
      {errors.tel && <small style={{ color: "red", fontSize: "13px" ,
        marginTop :5
       }}>Le téléphone est requis.</small>}
      </div>
            </div>

            {/* Section Image améliorée */}
            <div
              className={styles.inputSary}
              onClick={handlePhotoClick}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith("image/")) {
                  setLoadingImage(true);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setSelectedImageURL(reader.result);
                    setLoadingImage(false);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            >
              <label htmlFor="poste">Photo</label>
              <div className={`${styles.section1} ${errors.photo ? styles.errorBorder : ''}`}
 >
                {loadingImage ? (
                  <p style={{ fontStyle: "italic" }}>Chargement de l’image...</p>
                ) : selectedImageURL ? (
      <div style={{ position: "relative", display: "inline-block" }}>
  <img
    src={selectedImageURL}
    alt="Aperçu"
    style={{
      height: "30px",
      width: "80px",
      borderRadius: "10px",
      objectFit: "cover",
      display: "block",
    }}
  />
  <i
    className="fa-solid fa-circle-xmark"
    onClick={(e) => {
      e.stopPropagation();
      setSelectedImage(null);
      setSelectedImageURL(null);
    }}
    style={{
      position: "absolute",
      top: "0px",
      right: "0px",
      color: "#f44336",
      backgroundColor: "white",
      borderRadius: "50%",
      fontSize: "22px",
      cursor: "pointer",
      padding: "3px",
    }}
  ></i>
</div>
           ) : (
                  <>
                    <p>Cliquer pour ajouter</p>
                    <i className="fa-solid fa-image" style={{ fontSize: 22 }}></i>
                  </>
                )}
              </div>
   {errors.photo && (
  <small style={{ color: "red", fontSize: "13px", marginTop: 5 }}>
    La photo est requise.
  </small>
)}

              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            <div className={styles.btn}>
              <button  onClick={() => {
  if (validateForm()) {
     handleUpdatePersonnel();
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

      {/* Dialog pour division */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >



        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "flex-start",
          }}
        >
          <div className={styles.dialog}>
            <input type="text" placeholder="Rechercher..."
               value={search}
            onChange={(e) => setSearch(e.target.value)}
         />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>

        <DialogContent
        style={{
    minHeight: 300,       // hauteur minimale fixe
    maxHeight: 400,       // hauteur max (scroll si plus)
    overflowY: "auto",    // scroll vertical si besoin
  }}>
          <div className={styles.liste}>
          {filteredDivisions.length > 0 ? (
              filteredDivisions.map((div, i) => (
                <div
                  className={styles.liste1}
                  key={div.iddiv || i}
                  onClick={() => handleSelectDivision(div)} // clic
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.liste2}>
                    <h3>{div.nomdivision}</h3>
                  </div>
                  <i className="fa-solid fa-bars-staggered"></i>
                </div>
              ))
            ) : (
              <p>Aucune division trouvée.</p>
            )}
          </div>
        </DialogContent>
      </BootstrapDialog>
  <Snackbar
  open={openSnack}
  autoHideDuration={5000}
  onClose={handleCloseSnack}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
>
  <SnackbarContent
    sx={{

      p: 1,
      px : 3,
      fontSize: '17px',
      boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      justifyContent: 'space-between',  // espace entre message et action
      alignItems: 'center',
      gap: 3, // espace entre éléments flex (message/action)
    }}
    message={<span style={{ marginRight: 8 }}>{snackMessage}</span>}
    action={action}
  />
</Snackbar>


    </div>
  );
};

export default ModPerso;
