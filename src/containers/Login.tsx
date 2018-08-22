import * as React from 'react';
import { Auth } from "aws-amplify";
import { Card, CardContent, TextField, Checkbox, Button, FormControlLabel, Grid, withStyles, LinearProgress } from '@material-ui/core';
import Logo from '../components/Logo';
import './styles/Login.css';
import { StyleRules } from '@material-ui/core/styles/withStyles'

const styles = function(theme): StyleRules {
  return ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  cssFocused: {},
  cssLabel: {
    color: '#dadada',
    '&$cssFocused': {
      color: '#fafafa',
    },
  },
  cssUnderline: {
    '&:after': {
      borderBottomColor: '#fafafa',
    },
  },
  cssInput: {
    color: '#fafafa',
    '&:before': {
      borderBottomColor: '#dadada',
    },
    '&:hover:before': {
      borderBottom: '2px solid #dadada !important',
    }
  }
})};
class Login extends React.Component<any, any> {
  public constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      newPassword: "",
      confirmNewPassword: "",
      isNewPassword: false,
      userNewPassword: null
    };
  }

  private handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      Auth.signIn(this.state.email, this.state.password).then(
        async (user) => {
          console.log(user);
          if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
            console.log("change password");
            this.setState({userNewPassword: user, isNewPassword: true, isLoading: false})
          } else {
            try {
              const userInfo = await Auth.currentAuthenticatedUser(); 
              console.log(userInfo);
              
              if (userInfo) {
                this.props.userHasAuthenticated(true)
              }
            } catch (e) {
              console.log(e); 
            }
          }
        }
      );
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  private handleChange = (event) => {
    this.setState({[(event.target as HTMLInputElement).id]: (event.target as HTMLInputElement).value});
  }

  private validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  private validatePasswordForm() {
    return this.state.newPassword.length > 0 && this.state.confirmNewPassword.length > 0 && this.state.newPassword === this.state.confirmNewPassword;
  }

  private handlePasswordSubmit = async event => {
    event.preventDefault();

    this.setState({isLoading: true});

    this.state.userNewPassword.completeNewPasswordChallenge(this.state.newPassword, this.state.userNewPassword.challengeParams, {
      onSuccess: async user => {
        Auth.signIn(this.state.email, this.state.newPassword).then(async (user) => {
          const userInfo = await Auth.currentAuthenticatedUser(); 
          console.log(userInfo);
          
          if (userInfo) {
            this.props.userHasAuthenticated(true)
          }
        });
      }
    });
  }

  public render() {
    if (this.state.isNewPassword) {
      return (
        <div className="Login">
          <Card raised style={{width: '40%', maxWidth: '474px', margin: 'auto', padding: '50px 40px', backgroundColor: '#333333', position: "relative"}}>
            {this.state.isLoading && <LinearProgress variant="indeterminate" color="primary" style={{width: "40%", maxWidth: '474px', margin:"auto", position:"absolute", top: "0px", left: "0px"}} />} 
            <CardContent>
              <Logo alt />
              <p className="change-password-message">Welcome! Please change your password below to complete the sign-in process.</p>
              <form onSubmit={(event) => this.handlePasswordSubmit(event)}>
                <TextField 
                  fullWidth
                  label="New Password"
                  type="password"
                  id="newPassword"
                  onChange={(event) => this.handleChange(event)}
                  margin="normal"
                  InputLabelProps={{FormLabelClasses:{root: this.props.classes.cssLabel, focused: this.props.classes.cssFocused}}}
                  InputProps={{classes: {underline: this.props.classes.cssUnderline, input: this.props.classes.cssInput, root: this.props.classes.cssInput}}}
                />
                <TextField 
                  fullWidth 
                  label="Confirm New Password"
                  type="password"
                  id="confirmNewPassword"
                  onChange={(event) => this.handleChange(event)}
                  margin="normal"
                  InputLabelProps={{FormLabelClasses:{root: this.props.classes.cssLabel, focused: this.props.classes.cssFocused}}}
                  InputProps={{classes: {underline: this.props.classes.cssUnderline, input: this.props.classes.cssInput, root: this.props.classes.cssInput}}}
                />
                  <Button
                    value="login"
                    type="submit"
                    color="secondary"
                    variant="raised"
                    disabled={!this.validatePasswordForm() || this.state.isLoading}
                    >Change Password
                  </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    }
    return (
      <div className="Login">
        <Card raised style={{width: '40%', maxWidth: '474px', margin: 'auto', padding: '40px 40px 60px', backgroundColor: '#333333', position: "relative"}}>
          {this.state.isLoading && <LinearProgress variant="indeterminate" color="primary" style={{width: "100%", maxWidth: '474px', margin:"auto", position:"absolute", top: "0px", left: "0px"}} />}
          <CardContent>
            <Logo alt />
            <form onSubmit={(event) => this.handleSubmit(event)}>
              <TextField 
                fullWidth
                label="Email"
                type="text"
                id="email"
                onChange={(event) => this.handleChange(event)}
                margin="normal"
                InputLabelProps={{FormLabelClasses:{root: this.props.classes.cssLabel, focused: this.props.classes.cssFocused}}}
                InputProps={{classes: {underline: this.props.classes.cssUnderline, input: this.props.classes.cssInput, root: this.props.classes.cssInput}}}
              />
              <TextField 
                fullWidth 
                label="Password"
                type="password"
                id="password"
                onChange={(event) => this.handleChange(event)}
                margin="normal"
                InputLabelProps={{FormLabelClasses:{root: this.props.classes.cssLabel, focused: this.props.classes.cssFocused}}}
                InputProps={{classes: {underline: this.props.classes.cssUnderline, input: this.props.classes.cssInput, root: this.props.classes.cssInput}}}
              />
              <Grid container>
                <Grid item xs={8} sm={8}>
                  <FormControlLabel control={<Checkbox color="default" style={{color: "white"}} />} label="Remember Me" classes={{label: "remember-me"}}/>
                </Grid>
                <Grid item xs={4} sm={4} style={{textAlign: "right"}}>
                <Button
                  value="login"
                  type="submit"
                  color="secondary"
                  variant="raised"
                  disabled={!this.validateForm() || this.state.isLoading}
                  >Sign In
                </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(Login);