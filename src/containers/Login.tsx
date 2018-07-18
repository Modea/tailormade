import * as React from 'react';
import { Auth } from "aws-amplify";
import { Card, CardContent, TextField, Checkbox, Button, FormControlLabel, Grid } from '@material-ui/core';
import './styles/Login.css';

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
            this.setState({userNewPassword: user, isNewPassword: true})
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
          <Card raised style={{width: '40%', margin: '0 auto', padding: '50px 40px'}}>
            <CardContent>
              <p className="logo">Tailor<span className="bold">Made</span></p>
              <p className="change-password-message">Welcome! Please change your password below to complete the sign-in process.</p>
              <form onSubmit={(event) => this.handlePasswordSubmit(event)}>
                <TextField 
                  fullWidth
                  label="New Password"
                  type="password"
                  id="newPassword"
                  onChange={(event) => this.handleChange(event)}
                  margin="normal"
                />
                <TextField 
                  fullWidth 
                  label="Confirm New Password"
                  type="password"
                  id="confirmNewPassword"
                  onChange={(event) => this.handleChange(event)}
                  margin="normal"
                />
                  <Button
                    value="login"
                    type="submit"
                    color="primary"
                    variant="raised"
                    disabled={!this.validatePasswordForm()}
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
        <Card raised style={{width: '40%', margin: '0 auto', padding: '50px 40px'}}>
          <CardContent>
            <p className="logo">Tailor<span className="bold">Made</span></p>
            <form onSubmit={(event) => this.handleSubmit(event)}>
              <TextField 
                fullWidth
                label="Email"
                type="email"
                id="email"
                onChange={(event) => this.handleChange(event)}
                margin="normal"
              />
              <TextField 
                fullWidth 
                label="Password"
                type="password"
                id="password"
                onChange={(event) => this.handleChange(event)}
                margin="normal"
              />
              <Grid container>
                <Grid item xs={8} sm={8}>
                  <FormControlLabel control={<Checkbox color="primary" />} label="Remember Me" />
                </Grid>
                <Grid item xs={4} sm={4} style={{textAlign: "right"}}>
                <Button
                  value="login"
                  type="submit"
                  color="primary"
                  variant="raised"
                  disabled={!this.validateForm()}
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

export default Login;