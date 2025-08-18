import React, { useState ,useEffect } from 'react'
import styles from './header.module.css'
import Logo from '../../assets/finances.png';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from "@mui/icons-material/Close";
import { Tooltip } from 'antd';
import Switch from '@mui/material/Switch';
import { useNavigate

 } from 'react-router-dom';
import DarkModeSwitch from './DarkModeSwitch';
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "white",
    borderRadius: "30px",
    padding: theme.spacing(4),
    width: "100%",
    
    maxWidth: "500px",
  },
    "& .MuiDialog-container": {
    alignItems: "flex-start", // pousse vers le haut
    marginTop: theme.spacing(12), // ajoute de l'espace depuis le haut
  },
}));
const StyledConfirmDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '20px',
    padding: theme.spacing(2),
    maxWidth: 400,
    width: '90%',
    backgroundColor: '#fff',
  },
}));

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name = '') {
  const words = name.trim().split(' ');
  const first = words[0]?.[0] ?? '';
  const second = words[1]?.[0] ?? '';
  return {
    sx: { bgcolor: stringToColor(name) },
    children: `${first}${second}`.toUpperCase(),
  };
}

const Header = () => {
  const navigate=useNavigate()
  const [isHovered ,setisHovered]=useState(false)
  const [open, setOpen] = React.useState(false);
const [menuAnchorEl, setMenuAnchorEl] = useState(null);
const [openConfirmLogout, setOpenConfirmLogout] = useState(false);
const [admin, setAdmin] = useState(null);
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  document.body.classList.toggle("dark-mode", darkMode);
}, [darkMode]);


 useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Non authentifié');
        const data = await res.json();
        setAdmin(data);               // { idadmin, matricule, nom }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAdmin();
  }, []);
const toggleDarkMode = () => {
  setDarkMode(!darkMode);
  // Ajoutez cette classe dans votre CSS globale
};

const handleAvatarClick = (event) => {
  setMenuAnchorEl(event.currentTarget);   // ouvre le menu
};

const handleMenuClose = () => {
  setMenuAnchorEl(null);                  // ferme le menu
};

const handleLogout = async () => {
  await fetch("http://localhost:5000/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  localStorage.removeItem("isLoggedIn");
  navigate("/login");
};


  const openPerso =()=>{
    navigate("/global/personnel")
  }

   const openTab =()=>{
    navigate("/global/tableau_bord")
  }
 const openPresences =()=>{
    navigate("/global/fiche_presence")
  }

    const openConge =()=>{
    navigate("/global/autorisation")
  }
  const handleClose = () => {
    setOpen(false);
  };
   const openAssd =()=>{
    navigate("/global/assiduite")
  }
  const handleClickOpen = () => {
    setOpen(true);
  };
  return (
  <div className={`${styles.navbar} ${darkMode ? styles.darkNavbar : ''}`}>


    <div className={styles.gauche}>
    <div className={styles.logo}>
 <img src={Logo} alt="" />


       </div>
   
    </div>
        <div className={styles.menu}>
   <ul>
    <li onClick={openTab}>Tableau de bord</li>
    <li onClick={openPerso}>Personnels</li>
<li>
  <div
    className={styles.iconWrapper} // englobe Fiches + dropdown
    onMouseEnter={() => setisHovered(true)}
    onMouseLeave={() => setisHovered(false)}
  >
    <span className={darkMode ? styles.darkText : ''}>Fiches</span>
    {isHovered ? (
      <i className={`fa-solid fa-chevron-up ${darkMode ? styles.iconDark : ""}`}></i>
    ) : (
      <i className={`fa-solid fa-chevron-down ${darkMode ? styles.iconDark : ""}`}></i>
    )}

    {isHovered && (
      <div className={`${styles.dropdown} ${darkMode ? styles.darkDropdown : ""}`}>
        <p onClick={openPresences} className={darkMode ? styles.darkText : ''}>
          Fiche de présence
        </p>
        <p onClick={openAssd} className={darkMode ? styles.darkText : ''}>
          Fiche d'assiduités
        </p>
      </div>
    )}
  </div>
</li>
    <li onClick={openConge}>Autorisations</li>
   </ul>
       </div>
   
       <div className={styles.compte}>

<Tooltip title="Actualiser">
  <i className={`fa-solid fa-arrows-rotate ${darkMode ? styles.darkIcon : ""}`}
    onClick={() => window.location.reload()}
></i>
</Tooltip>

<DarkModeSwitch darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

<div
  className={`${styles.avatar} ${darkMode ? styles.avatarDark : ""}`}
  onClick={handleAvatarClick}
>
  <div className={`${styles.nom} ${darkMode ? styles.nomDark : ""}`}>
    <h3>{admin ? admin.nom : '...'}</h3>
    <p>Admin</p>
  </div>

  <StyledBadge
    overlap="circular"
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    variant="dot"
  >
    <Avatar
      {...stringAvatar(admin ? admin.nom : '')}
      sx={{
        width: 58,
        height: 59,
        backgroundColor: '#1B6979',
        color: '#fff',
        fontWeight: 'bold',
      }}
    />
  </StyledBadge>
</div>

<Menu
  anchorEl={menuAnchorEl}
  open={Boolean(menuAnchorEl)}
  onClose={handleMenuClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  PaperProps={{
    sx: {
      borderRadius: 3,
      mt: 1,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      minWidth: 120,
      px: 3,   // horizontal padding
      py: 3,   // vertical padding

    },
  }}
>
  <div className={styles.button1}>
         <button   onClick={handleLogout}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, color: "white", fontSize: 18 }}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Se deconnecter</span>
      </div>
          </button>
    </div>  
 
</Menu>
</div>


           <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        > 
         <div style={{display :"flex" ,flexDirection :"column" ,
            width :"100%"
           }}>
           <div className={styles.dialog}>
  <input type="text" placeholder='Rechercher...' />
   <i class="fa-solid fa-magnifying-glass" ></i>
 </div>
           </div>

          <DialogContent>
         <div className={styles.liste}>

  <div  className={styles.resultat}>
     <div className={styles.liste1}>
      <div className={styles.liste2}>
   <h3>Personnels</h3>
        <p>Ajout Personnels</p>
      </div>
       <i class="fa-solid fa-bars-staggered"></i>
     </div>
    <div className={styles.liste1}>
      <div className={styles.liste2}>
   <h3>Personnels</h3>
        <p>Ajout Personnels</p>
      </div>
       <i class="fa-solid fa-bars-staggered"></i>
     </div>    <div className={styles.liste1}>
      <div className={styles.liste2}>
   <h3>Personnels</h3>
        <p>Ajout Personnels</p>
      </div>
       <i class="fa-solid fa-bars-staggered"></i>
     </div>    <div className={styles.liste1}>
      <div className={styles.liste2}>
   <h3>Personnels</h3>
        <p>Ajout Personnels</p>
      </div>
       <i class="fa-solid fa-bars-staggered"></i>
     </div>

  </div>
         </div>
  </DialogContent>

           </BootstrapDialog>
    </div>
  )
}

export default Header 