import React from "react";
import Logo from "../../Logo/Logo";
import DrawerToggle from "../SideDrawer/DrawerToggle/DrawerToggle";
import { AppBar, Hidden } from "@material-ui/core";
import ToolbarItem from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import auth from "../../Auth/Auth";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
  },
  inlineFlex: {
    display: "inline-flex",
    alignItems: "center",
    },
  signOutButton: {
    marginLeft: theme.spacing(1),
  },
  accntBtn: {
    backgroundColor: "#028941",
    height: "48px",
    width: "48px",
    "&:hover": {
      backgroundColor: "#026430",
    },
    "&:active": {
      backgroundColor: "#03b053",
    },
  },
}));

function Toolbar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          props.history.push("/my-account");
        }}
      >
        My account
      </MenuItem>
      <MenuItem
        onClick={() => {
          auth.clearAppStorage();
          props.history.push("/login");
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );
  return (
    <div>
      <AppBar className={classes.root}>
        <ToolbarItem style={{justifyContent: "space-between", flexWrap: "wrap",}}>
          <Logo />
          <div className={classes.inlineFlex}>
          <h4 style={{ color: "#000", paddingRight: "1rem", whiteSpace: "nowrap", }}>
            Welcome {auth.getUserInfo().contact.name}
          </h4>
          <Hidden mdDown>
            <IconButton
              className={classes.accntBtn}
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <AccountCircle />
            </IconButton>
          </Hidden>
          <Hidden lgUp>
            <DrawerToggle clicked={props.drawerToggleClicked} />
          </Hidden>
          </div>
        </ToolbarItem>
      </AppBar>
      {renderMenu}
    </div>
  );
}

export default withRouter(Toolbar);
