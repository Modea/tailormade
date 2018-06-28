import * as React from 'react';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import './styles/Login.css';

class Login extends React.Component<any, any> {
  public constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: ""
    };
  }

  private handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await Auth.signIn(this.state.email, this.state.password);
      // const userInfo = await Auth.currentUserPoolUser(); 
      // console.log(userInfo);
      this.props.userHasAuthenticated(true);
    } catch (e) { 
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  private handleChange = (event: React.FormEvent<FormControl>) => {
    this.setState({[(event.target as HTMLInputElement).id]: (event.target as HTMLInputElement).value});
  }

  private validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  public render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large"> 
            <ControlLabel>Email</ControlLabel> 
            <FormControl
              autoFocus
              type="email" 
              value={this.state.email} 
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel> 
            <FormControl
              value={this.state.password} 
              onChange={this.handleChange} 
              type="password"
            /> 
          </FormGroup> 
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            isLoading={this.state.isLoading}
            type="submit"
            text="Login"
            loadingText="Logging In..."
          />
        </form>
      </div>
    );
  }
}

export default Login;