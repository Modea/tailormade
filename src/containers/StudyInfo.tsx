import * as React from 'react';
import './styles/Studies.css';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '../../node_modules/aws-amplify/lib/API/types';
import { Grid, List, ListItem, Button, Dialog, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import uuidv1 from 'uuid';

interface StudyResult {
  data: any
}
class StudyInfo extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);

    this.state = {
      study: {},
      participants: {},
      modalOpen: false,
      isLoading: true,
      firstName: "",
      lastName: ""
    };
  }

  public async componentDidMount() {
    const user = await Auth.currentAuthenticatedUser();

    this.setState({user})

    if (user) {
      // this.props.match.params.id
      const GetStudy = `
      query GetStudy {
        getStudies(groupId: "${this.props.match.params.id.split(":")[1]}", studyId: "${this.props.match.params.id.split(":")[0]}") {
          title
        }
      }`;

      const GetParticipants = `
      query StudyParticipants {
        listParticipantsForStudy(studyId: "${this.props.match.params.id.split(":")[0]}") {
          items {
            firstName
            lastName
            participantID
            studyID
          }
        }
      }
      `
      
      const study = await API.graphql(graphqlOperation(GetStudy));
      const participants = await API.graphql(graphqlOperation(GetParticipants));
      console.log(participants);
      if ((study as GraphQLResult).data !== undefined) {
        this.setState({study: (study as StudyResult).data.getStudies, participants:(participants as StudyResult).data.listParticipantsForStudy.items, isLoading: false});
      }
    } else {

    }
  }

  private handleSubmit = async event => {
    event.preventDefault();
    const id = uuidv1();
    console.log(id);

    const CreateParticipant = `
      mutation CreateParticipant {
        createParticipants(input: {participantID: "${id}", studyID: "${this.props.match.params.id.split(":")[0]}", firstName:"${this.state.firstName}", lastName:"${this.state.lastName}"}) {
          firstName
          lastName
        }
      }
    `;

    const newParticipant = await API.graphql(graphqlOperation(CreateParticipant));

    if ((newParticipant as GraphQLResult).data !== undefined) {
      console.log(`created participant ${(newParticipant as StudyResult).data.createParticipants.firstName} ${(newParticipant as StudyResult).data.createParticipants.lastName}`);
      this.refreshParticipantList();
      this.setState({modalOpen: false, firstName: "", lastName: ""});
    }
  };

  private refreshParticipantList = async () => {
    const GetParticipants = `
      query StudyParticipants {
        listParticipantsForStudy(studyId: "${this.props.match.params.id.split(":")[0]}") {
          items {
            firstName
            lastName
            participantID
            studyID
          }
        }
      }
      `
      
    const participants = await API.graphql(graphqlOperation(GetParticipants));
    console.log(participants);
    if ((participants as GraphQLResult).data !== undefined) {
      this.setState({participants:(participants as StudyResult).data.listParticipantsForStudy.items});
    }
  }

  private handleChange = async event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  public render() {
    return ( !this.state.isLoading &&
      <div className="Studies">
        <Grid container spacing={24}>
          <Grid item md={12}>
            <h2>{this.state.study.title}</h2>
          </Grid>
          <Grid item md={12}>
            <List>
              {this.state.participants.map((element, index) => <ListItem key={index}>{element.firstName} {element.lastName}</ListItem>)}
            </List>
            <Button
              variant="raised"
              color="primary"
              onClick={(event) => {event.preventDefault(); this.setState({modalOpen: true})}}
            >
              Add New Participant
            </Button>
          </Grid>
        </Grid>
        <Dialog
          open={this.state.modalOpen}
          onClose={(event) => {event.preventDefault(); this.setState({modalOpen: false, firstName: "", lastName: ""})}}
        >
          <DialogTitle>Create New Participant</DialogTitle>
          <DialogContent>
          <form onSubmit={(event) => this.handleSubmit(event)}>
              <TextField 
                label="First Name"
                type="text"
                name="firstName"
                value={this.state.firstName}
                onChange={(event) => this.handleChange(event)}
                fullWidth
              />
              <TextField 
                label="Last Name"
                type="text"
                name="lastName"
                value={this.state.lastName}
                onChange={(event) => this.handleChange(event)}
                fullWidth
              />
              <Button
                variant="raised"
                color="primary"
                onClick={(event) => this.handleSubmit(event)}
                type="submit"
              >
                Create Participant
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default StudyInfo;