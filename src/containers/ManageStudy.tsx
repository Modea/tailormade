import * as React from 'react';
import './styles/ManageStudy.css';
// import { withRouter } from 'react-router';
// import { Auth, API, graphqlOperation } from 'aws-amplify';
// import { GraphQLResult } from '../../node_modules/aws-amplify/lib/API/types';
import { Button, CircularProgress } from '@material-ui/core';
// import * as got from 'got';
import AddREDCapKey from '../components/AddREDCapKey';
// import StudiesCard from '../components/StudiesCard';

class ManageStudy extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);

    this.state = {
      study: {title: "Inner Winner"},
      studySettings: {},
      isLoading: true,
    };
  }

  public async componentDidMount() {
    this.setState({isLoading: false})
  }

  // private handleChange = (event) => {
  //   this.setState({[(event.target as HTMLInputElement).name]: (event.target as HTMLInputElement).value});
  // }

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
        <div className="manage-study-header">
          <h1 className="manage-study-title">Settings for {this.state.study.title}</h1>
          <h2 className="manage-study-subhead">REDCap API Keys</h2>
          <AddREDCapKey />
          <h2 className="manage-study-subhead">Twilio API Key</h2>
          <h2 className="manage-study-subhead">Study Dates</h2>
          <h2 className="manage-study-subhead">Close Study</h2>
          <Button>Close Study</Button>
        </div>
      </div>
    );
  }
}

export default ManageStudy;