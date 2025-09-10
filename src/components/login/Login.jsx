import React, { useContext, useEffect, useState } from 'react'
import styles from './login.module.css';
import Logo from '../../assets/finances.png';
import Logo1 from '../../assets/v1.jpg';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';

import { Spin } from 'antd';
import {useNavigate} from "react-router-dom"
import bgImage from '../../assets/v2.jpg';
import Alert from '@mui/material/Alert';
import { AuthContext } from '../../AuthContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { styled } from "@mui/material/styles";
import Webcam from "react-webcam";



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "white",
    borderRadius: "25px",
    padding: theme.spacing(2),
    width: "100%",
    maxWidth: "1000px",
  
  },
}));

const Login = () => {
   const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [mdp, setMdp] = useState("");
const [nom, setNom] = useState("");
const [submitted, setSubmitted] = useState(false);
const [submittedMdp, setSubmittedMdp] = useState(false);
const [loginError, setLoginError] = useState(""); // Pour stocker le message d'erreur
 const [hovered, setHovered] = useState(false);
const [pageLoading, setPageLoading] = useState(true);
const navigation=useNavigate()
  const [role, setRole] = useState("admin"); 

const [confirmOpen, setConfirmOpen] = useState(false);
const navigate=useNavigate()
const [hoverPresence, setHoverPresence] = useState(false);
const [hoverCapture, setHoverCapture] = useState(false);

useEffect(() => {
  // Simuler le temps de chargement de la page (ou attendre tes données)
  const timer = setTimeout(() => {
    setPageLoading(false);
  }, 1500); // 1,5s ou le temps nécessaire

  return () => clearTimeout(timer);
}, []);


useEffect(() => {
  document.body.style.background = `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${bgImage}) no-repeat center center fixed `;
  document.body.style.backgroundSize = 'cover';
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.userSelect = 'none';

  // Nettoyage quand on quitte la page
  return () => {
    document.body.style.background = '';
    document.body.style.backgroundSize = '';
    document.body.style.margin = '';
    document.body.style.padding = '';
    document.body.style.userSelect = '';
  };
}, []);

const openDialog=()=>{
  setConfirmOpen(true) 
}

const closeDialog=()=>{
setConfirmOpen(false)

}
const [loading ,setLoading] =useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  
  const handleMouseDownPassword = (event) => {
  event.preventDefault();
};

const handleMouseUpPassword = (event) => {
  event.preventDefault();
};

const goPointage = async () => {
  setLoading(true);
  try {
   await login(nom, mdp);
   navigate('/global')
  } catch (err) {
    console.error("Erreur réseau :", err);
    setLoginError("Erreur réseau, impossible de se connecter.");
  } finally {
    setLoading(false); // ✅ stop spinner dans tous les cas
  }
};



  return (
    <div>
  
      <div className={styles.loginH}>
    
   <div className={styles.login1}>
  <img src={Logo} alt="" />

   
      </div>
 
   
</div>

<div className={styles.container}>

 <div className={styles.card}>
 {loginError && (
  <Alert severity="error" fullWidth sx={{ fontSize: 17, padding: 1, display: "flex" }}>
    {loginError}
  </Alert>
)}

  <div className={styles.left}>
   <h2>Connexion</h2>
  </div>
   
    <div className={styles.form}>
     <div className={styles.input1}>

<Box sx={{ p: 2 /* padding 16px */ }}>
        <TextField id="standard-basic" 
          fullWidth label="Matricule"
           value={nom}
  onChange={(e) => setNom(e.target.value)}
          variant="standard"
           InputLabelProps={{
    style: {
      fontSize: '1.2rem',
    
      
    },
  }}
            InputProps={{
    endAdornment: (
      <InputAdornment position="end">
       <i class="fa-solid fa-user-check" style={{
        fontSize : 20  ,color :"gray"
       }}></i>
      </InputAdornment>
    ),
  }}   inputProps={{
    style: {
      padding: '7px', 
      fontSize : 20 // padding intérieur autour du texte
    },
  }}
  error={submitted && nom.trim() === ""}
  helperText={submitted && nom.trim() === "" ? "Nom est vide" : ""}
/>
 </Box>
   <Box sx={{ p: 2}}>
                <TextField
                
                  id="standard-password"
                  fullWidth
                  label="Mot de passe"
                  variant="standard"
                        value={mdp}
  onChange={(e) => setMdp(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  InputLabelProps={{
                    style: { fontSize: '1.2rem' },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <i class="fa-solid fa-eye"
                          style={{
        fontSize : 20  ,color :"gray"
       }}></i> : 
                          <i class="fa-solid fa-eye-slash"
                          style={{
        fontSize : 20  ,color :"gray"
       }}></i>}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    style: { padding: '7px', fontSize: 20 },
                  }}
            error={submittedMdp && mdp.trim() === ""}
  helperText={submittedMdp && mdp.trim() === "" ? "Mot de passe est vide" : ""}
     />
              </Box>

       <div className={styles.oublie} onClick={()=> navigation("/oublie")}>
   <p>Mot de passe oubié ?
   </p>
    </div>
    <div className={styles.btn}>
   <Button variant="outlined" 
    sx={{
        width: "100%",
        backgroundColor: "rgb(51, 94, 143)",
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
        paddingY: 1.5,
        borderRadius: "8px",
        border: "none",
        textTransform: "none",
        boxShadow: hovered
          ? "0 4px 20px rgba(51, 94, 143, 0.6)" // shadow quand survol
          : "0 2px 5px rgba(0,0,0,0.2)", // shadow normal
        transform: hovered ? "scale(1.05)" : "scale(1)", // léger zoom au hover
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
  
              onClick={goPointage} >
                  {loading ? <Spin size="large" /> : "Se connecter"}

              </Button>

    </div>
<div className={styles.btn6}>
  <Button
    variant="text"
    sx={{
      width: "100%",
      backgroundColor: "transparent", // 🔹 pas de fond
      color: "rgb(51, 94, 143)", // 🔹 texte bleu seulement
      fontWeight: "bold",
      fontSize: 18,
      paddingY: 1.5,
      border: "none", // 🔹 pas de bordure
      textTransform: "none",
      boxShadow: "none", // 🔹 pas d’ombre
      transform: hovered ? "scale(1.05)" : "scale(1)",
      transition: "all 0.3s ease",

      "&:hover": {
        backgroundColor: "rgb(201, 231, 243)", // 🔹 pas de surlignage gris de MUI
        color: "rgb(30, 60, 100)", // optionnel : foncé au hover
      },
      "&:focus": {
        outline: "none",
      },
      "&:focusVisible": {
        outline: "none",
        boxShadow: "none",
      },
    }}
     onMouseEnter={() => setHoverPresence(true)}
  onMouseLeave={() => setHoverPresence(false)}
      onClick={openDialog}
  >
    {loading ? <Spin size="large" /> : "Faire présence"}
  </Button>
</div>

      </div>  
    
    </div>
  
 </div>

</div>

<BootstrapDialog
  onClose={() => setConfirmOpen(false)}
  aria-labelledby="customized-dialog-title"
  open={confirmOpen}
>
  <div
    style={{
      margin: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center", // 🔹 centrer horizontalement
      justifyContent: "center",
      gap: 20,
    }}
  >
    <h3 style={{ fontSize: 22 }}>Vérification faciale</h3>

    {/* Webcam au centre */}
    <Webcam
      audio={false}
      screenshotFormat="image/jpeg"
      style={{
        borderRadius: "12px",
        width: "100%",       // prend toute la largeur du Dialog
        // limite la taille max
        height: "100%",
      }}
    />

    {/* Bouton pleine largeur */}
   <Button variant="outlined" 
    sx={{
        width: "100%",
        backgroundColor: "rgb(51, 94, 143)",
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
        paddingY: 1.5,
        borderRadius: "8px",
        border: "none",
        textTransform: "none",
        boxShadow: hovered
          ? "0 4px 20px rgba(51, 94, 143, 0.6)" // shadow quand survol
          : "0 2px 5px rgba(0,0,0,0.2)", // shadow normal
        transform: hovered ? "scale(1.05)" : "scale(1)", // léger zoom au hover
        transition: "all 0.3s ease",
      }}
       onMouseEnter={() => setHoverCapture(true)}
  onMouseLeave={() => setHoverCapture(false)}  
              onClick={goPointage} >
                  {loading ? <Spin size="large" /> : "Capturer"}

              </Button>
  </div>
</BootstrapDialog>

    </div>
  )
}

export default Login