import * as React from 'react';
import './styles/ManageStudy.css';
import { withRouter } from 'react-router';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { CircularProgress, Tabs, Tab } from '@material-ui/core';
// import * as got from 'got';
import SurveyKeyList from '../components/redCapAPI/SurveyKeyList';
import { GraphQLResult } from 'aws-amplify/lib/API/types';

interface ApiKeyListResult {
  data: any
}
class ManageStudy extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);

    this.state = {
      study: {title: ""},
      studySettings: {},
      tabIndex: 0,
      isLoading: true
    };
  }

  public async componentDidMount() {
    const GetStudy = `
      query GetStudy {
        getStudies(groupId: "${this.props.match.params.id.split(":")[1]}", studyId: "${this.props.match.params.id.split(":")[0]}") {
          title
        }
      }`;

    const user = await Auth.currentAuthenticatedUser();

    this.setState({user})

    if (user) {
      if (user.attributes['custom:unsecureRole'] === "admin") {
        const study = await API.graphql(graphqlOperation(GetStudy));
        if ((study as GraphQLResult).data !== undefined) {
          //console.log(study);
          this.setState({study: {title: (study as ApiKeyListResult).data.getStudies.title}});
        }
      } else {

      }
    } else {

    }

    this.setState({isLoading: false});
  }

  // private closeSnackbar = () => {
  //   this.setState({snackbar: false});
  // }

  // private openSnackbar = (message) => {
  //   this.setState({snackbar: true, snackbarMessage: message})
  // }

  private goBack = (event) => {
    event.preventDefault();

    this.props.history.push(`/studies/${this.props.match.params.id}`)
  }

  private handleTabChange = (event, value) => {
    event.preventDefault();
    this.setState({
      tabIndex: value
    });
  }

  private getCurrentTab = () => {
    switch (this.state.tabIndex) {
      case 0:
        return null;
      case 1:
        return (
          <div className="manage-study-tab-container">
            <h2 className="manage-study-subhead">REDCap API Keys</h2>
            <SurveyKeyList studyId={this.props.match.params.id.split(":")[0]} />
          </div>
        );
      default:
        console.error("Cannot find tab with this index.");
        return null;
    }
  }

  public render() {
    if (this.state.isLoading) {
      return (
        <div className="loading-wrapper">
          <CircularProgress color="primary"/>
        </div>
      );
    }
    return ( !this.state.isLoading &&
      <div className="ManageStudy">
        <a className="manage-study-back" onClick={this.goBack}>Back to Study</a>
        <div className="manage-study-header">
          <h1 className="manage-study-title">Settings for {this.state.study.title}</h1>
        </div>
        <Tabs
          onChange={this.handleTabChange}
          value={this.state.tabIndex}
          indicatorColor="primary"
        >
          <Tab 
            label="General Settings"
            disableRipple
          />
          <Tab 
            label="REDCap Integration"
            disableRipple
          />
          <Tab 
            label="Twilio Integration" 
            disableRipple
          />
        </Tabs>
        {this.getCurrentTab()}
      </div>
    );
  }
}

export default withRouter(ManageStudy);