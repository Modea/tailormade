import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import Routes from './Routes';
import './App.css';

class App extends React.Component<any, any> {
  public constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  public async componentDidMount() {
    try {
      if (await Auth.currentSession()) { 
        this.userHasAuthenticated(true);
      } 
    } catch(e) {
      if (e !== 'No current user') {
        alert(e); 
      }
    }
    this.setState({ isAuthenticating: false });
  }

  private userHasAuthenticated = (authenticated: boolean) => {
    this.setState({ isAuthenticated: authenticated });
  }

  private handleLogout = async event => { 
    await Auth.signOut();

    this.userHasAuthenticated(false);

    this.props.history.push("/");
  }

  public render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
    }

    return (
      !this.state.isAuthenticating &&
      <div className="App">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Research App</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.state.isAuthenticated
                ? <NavItem onClick={this.handleLogout}>Logout</NavItem> : 
                <React.Fragment>
                  <LinkContainer to="/">
                    <NavItem>Login</NavItem> 
                  </LinkContainer>
                </React.Fragment> }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
