import * as React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Grid, Avatar, Menu, MenuItem } from "@material-ui/core";
import { Auth } from 'aws-amplify';
import Logo from './Logo';
import './styles/PageHeader.css';

class PageHeader extends React.Component<any, any, any> {
  constructor(props) {
    super(props);

    this.state = {
      isGettingUser: true,
      anchorEl: null,
      user: {}
    }
  }

  public async componentDidMount() {
    const info = await Auth.currentUserInfo();

    this.setState({isGettingUser: false, user: info})
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  public render() {
    return ( !this.state.isGettingUser && 
      <Grid container spacing={16} alignContent="center" alignItems="center" style={{margin: "15px 10% 0", width: "80%"}}>
        <Grid item md={3} style={{textAlign: "left"}}>
          <Link to="/studies" className="logo-link"><Logo small left /></Link>
        </Grid>
        <Grid item md={6} style={{textAlign: "center"}}>
          <img className="vanderbilt-logo" src="/VU-logo.png" />
        </Grid>
        <Grid item md={3} className="user-flex" onClick={(event) => this.handleClick(event)}>
          <Avatar style={{float: "right"}}>{this.state.user.attributes['name'] && this.state.user.attributes['name'].split(" ")[0].substring(0, 1)}{this.state.user.attributes['name'] && this.state.user.attributes['name'].split(" ")[this.state.user.attributes['name'].split(" ").length-1].substring(0, 1)}</Avatar>
          <p>{this.state.user !== null && this.state.user.attributes['name']}</p>
          <i className="material-icons">keyboard_arrow_down </i>
        </Grid>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
          anchorOrigin={{horizontal: "right", vertical: "bottom"}}
          transformOrigin={{horizontal: "right", vertical: "top"}}
          getContentAnchorEl={undefined}
        >
          <MenuItem onClick={() => { this.handleClose(); this.props.history.push("/my-profile"); }}>Profile</MenuItem>
          {this.state.user.attributes['custom:unsecureRole'] === 'admin' ? <MenuItem onClick={() => { this.handleClose(); this.props.history.push("/dashboard"); }}>Admin</MenuItem> : null}
          <MenuItem onClick={() => { this.props.handleLogout(); this.handleClose(); }}>Logout</MenuItem>
        </Menu>
      </Grid>
    );
  }
}
 

export default withRouter(PageHeader);