import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import Routes from './Routes';
import './App.css';
import PageHeader from './components/PageHeader';

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
      handleLogout: this.handleLogout
    }

    return (
      !this.state.isAuthenticating &&
      <div className="App">
        {this.state.isAuthenticated && <PageHeader handleLogout={this.handleLogout} />}
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
