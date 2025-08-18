import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './oublie.module.css';
import { useNavigate } from "react-router-dom";
import Logo from '../../assets/finances.png';

const Oublier = () => {
  const [matricule, setMatricule] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

const handleSubmit = async () => {
  setSubmitted(true);
  setLoading(true);

  if (!matricule) {
    setError(true);
    setErrorMsg("Veuillez saisir votre matricule");
    setLoading(false);
    return;
  }
  if (matricule.length < 4) {
    setError(true);
    setErrorMsg("Le matricule doit comporter 4 caractères");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/admins/verify/${matricule}`);
    const data = await response.json();

    if (response.ok && data.exists) {
      setError(false);
      setErrorMsg("");
      
      navigate("/mdp", { state: { matricule } });
    } else {
      setError(true);
      setErrorMsg(data.error || "Erreur inconnue");
    }
  } catch (err) {
    console.error("Erreur réseau :", err);
    setError(true);
    setErrorMsg("Erreur réseau ou serveur.");
  } finally {
    setLoading(false);
  }
};

  const handleBack = () => window.history.back();

  const handleMatriculeChange = (e) => {
    const value = e.target.value;
    if (value.length <= 8) { 
      setMatricule(value);
      if (error) {
        setError(false);
        setErrorMsg("");
      }
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
      <Box
        className={styles.card}
        sx={{
          maxWidth: 420,
          width: "90%",
          p: 4,
          borderRadius: 6,
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          position: "relative",
        }}
      >
        <IconButton onClick={handleBack} sx={{ position: "absolute", top: 16, left: 16, color: "#40a9ff" }}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" sx={{ mt: 4, fontWeight: 700, textAlign: "center", color: "#40a9ff" }}>
          Mot de passe oublié
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="body2" sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
            <span style={{ fontWeight: 600 }}>
              <span style={{ color: "red", marginRight: 4 }}>*</span>
              Matricule
            </span>
            <span style={{ color: "#555", fontSize: 14 }}>
              Merci de saisir votre matricule pour réinitialiser votre mot de passe
            </span>
          </Typography>

          <TextField
            id="matricule"
            placeholder="Entrez votre matricule"
            variant="outlined"
            fullWidth
            value={matricule}
            onChange={handleMatriculeChange}
              InputProps={{ style: { fontSize: 18, textAlign: 'center' } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": { borderColor: "#40a9ff" },
              },
            }}
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            mt: 2,
            py: 1.5,
            fontSize: 16,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 3,
            background: "linear-gradient(90deg, #40a9ff, #1890ff)",
            "&:hover": {
              background: "linear-gradient(90deg, #1890ff, #096dd9)",
              transform: "translateY(-1px)",
            },
            transition: "0.3s",
          }}
        >
          {loading ? "Vérification..." : "Réinitialiser"}
        </Button>



{/* Alert pour erreur */}
{error && (
  <Alert severity="error" sx={{ mt: 2, fontSize: 13 }}>
    {errorMsg} {/* ici le message peut venir du serveur ou du frontend */}
  </Alert>
)}

      </Box>
    </div>
  );
};

export default Oublier;
