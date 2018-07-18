import * as React from 'react';
import './styles/Studies.css';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '../../node_modules/aws-amplify/lib/API/types';
import { Grid, Button } from '@material-ui/core';
import StudiesCard from '../components/StudiesCard';

interface StudiesResult {
  data: any
}
class Studies extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);

    this.state = {
      studies: [],
      isLoadingList: true
    };
  }

  public async componentDidMount() {
    const GetAllStudies = `
      query GetAllStudies {
        listStudies {
          items {
            title
            studyId
            groupId
            numOfParticipants
            clinicalTrialsId
            renewDate
          }
        }
      }`;

      const GetUserStudies = `
      query GetMyStudies {
        getStudiesForUser {
          items {
            title
            studyId
            groupId
            numOfParticipants
            clinicalTrialsId
            renewDate
          }
        }
      }`;

    const user = await Auth.currentAuthenticatedUser();

    this.setState({user})

    if (user) {
      if (user.attributes['custom:unsecureRole'] === "admin") {
        const studies = await API.graphql(graphqlOperation(GetAllStudies));
        if ((studies as GraphQLResult).data !== undefined) {
          this.setState({studies: (studies as StudiesResult).data.listStudies.items, isLoadingList: false});
        }
      } else {
        const studies = await API.graphql(graphqlOperation(GetUserStudies));
        if ((studies as GraphQLResult).data !== undefined) {
          this.setState({studies: (studies as StudiesResult).data.getStudiesForUser.items, isLoadingList: false});
        }
      }
    } else {

    }
  }

  public render() {
    return ( !this.state.isLoadingList &&
      <div className="Studies">
        <Grid container spacing={24}>
          <Grid item md={8}>
            <h2>Current Studies</h2>
          </Grid>
          <Grid item md={4} style={{textAlign: "right"}}>
            {this.state.user.attributes['custom:unsecureRole'] === 'admin' && <Button variant="raised" color="primary">New Study</Button>}
          </Grid>
          {this.state.studies.map((element, index) => 
          (<Grid key={index} item md={4}>
            <StudiesCard
              title={element.title} 
              numOfParticipants={element.numOfParticipants}
              daysRemaining={((element.renewDate - Date.now()) / (1000 * 60 * 60 * 24)).toFixed(0)}
              id={element.studyId}
              groupId={element.groupId}
              clinicalTrialId={element.clinicalTrialsId}
            />
          </Grid>)
          )}
        </Grid>
      </div>
    );
  }
}

export default Studies;