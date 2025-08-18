import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Alert, IconButton, InputAdornment } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useLocation } from "react-router-dom";
import styles from './oublie.module.css';
 import { Spin } from "antd";
 import { useNavigate } from "react-router-dom";
 import Logo from '../../assets/finances.png';


const Motdepasse = () => {
    const navigate =useNavigate()
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation(); // récupérer le matricule envoyé depuis /mdp
  const matricule = location.state?.matricule;
const [loading ,setLoading] = useState(false)

  const handleBack = () => window.history.back();
  useEffect(() => {
    if (!matricule) {
      navigate("/login", { replace: true });
    }
  }, [matricule, navigate]);

  const handleSubmit = async () => {
    setSubmitted(false);
    setError(false);
    setLoading(true)

    if (!password) {
      setError(true);
      setErrorMsg("Veuillez saisir le mot de passe");
      setLoading(false)
      return;
    }
    if (!confirm) {
      setError(true);
      setErrorMsg("Veuillez confirmer le mot de passe");
      setLoading(false)
      return;
    }
    if (password.length < 5) {
      setError(true);
      setErrorMsg("Le mot de passe doit contenir au moins 5 caractères");
      setLoading(false)
      return;
    }
    if (password !== confirm) {
      setError(true);
      setErrorMsg("Les mots de passe ne correspondent pas");
      setLoading(false)
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admins/reset_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricule, mot_de_passe: password })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setError(false);
        setErrorMsg("");
      
        navigate("/login")
           setLoading(false) // redirection après 2s

      } else {
        setError(true);
        setErrorMsg(data.error || "Erreur serveur inconnue");
        setLoading(false)
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setErrorMsg("Erreur réseau ou serveur.");
      setLoading(false)
    }
  };

  
  return (
    <div className={styles.container}>
           <img
               src={Logo}
               alt="Logo"
               style={{
                 position: "fixed",  // reste en haut même si la page scroll
                 top: 16,
                 left: 100,
                 width: 77,
                 height: 68,
                 zIndex: 1000        // pour qu’il soit au-dessus des autres éléments
               }}
             />
      <Box className={styles.card} sx={{ maxWidth: 420, width: "90%", p: 4, borderRadius: 6, boxShadow: "0 8px 30px rgba(0,0,0,0.12)", backgroundColor: "#fff", display: "flex", flexDirection: "column", gap: 2, position: "relative" }}>
        
        <IconButton onClick={handleBack} sx={{ position: "absolute", top: 16, left: 16, color: "#40a9ff" }}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" sx={{ mt: 4, fontWeight: 700, textAlign: "center", color: "#40a9ff" }}>
          Réinitialiser le mot de passe
        </Typography>

        <TextField
          type={showPassword ? "text" : "password"}
          placeholder="Mot de passe"
          variant="outlined"
          fullWidth
          value={password}
          onChange={e => { setPassword(e.target.value); if(error) setError(false); }}
          InputProps={{
            style: { fontSize: 18, textAlign: 'center', marginTop: 13 },
            endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>
          }}
        />

        <TextField
          type={showConfirm ? "text" : "password"}
          placeholder="Confirmer le mot de passe"
          variant="outlined"
          fullWidth
          value={confirm}
          onChange={e => { setConfirm(e.target.value); if(error) setError(false); }}
          InputProps={{
            style: { fontSize: 18, textAlign: 'center', marginTop: 13 },
            endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 2, py: 1.5, fontSize: 16, fontWeight: 600, textTransform: "none", borderRadius: 3, background: "linear-gradient(90deg, #40a9ff, #1890ff)", "&:hover": { background: "linear-gradient(90deg, #1890ff, #096dd9)", transform: "translateY(-1px)" }, transition: "0.3s" }}
        >
             {loading ? <Spin size="large" /> : "Valider"}
         
        </Button>

        {error && <Alert severity="error" sx={{ mt: 2, fontSize: 13 }}>{errorMsg}</Alert>}
        {submitted && !error && <Alert severity="success" sx={{ mt: 2, fontSize: 13 }}>Mot de passe réinitialisé avec succès !</Alert>}
      </Box>
    </div>
  );
};

export default Motdepasse;
