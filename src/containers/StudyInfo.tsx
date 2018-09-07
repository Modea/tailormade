import * as React from 'react';
import './styles/StudyInfo.css';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '../../node_modules/aws-amplify/lib/API/types';
import { List, Button, Dialog, DialogContent, DialogTitle, TextField, Tabs, Tab, CircularProgress } from '@material-ui/core';
import Search from '../components/Search';
import ParticipantListItem from '../components/ParticipantListItem';
import uuidv1 from 'uuid';
import { withRouter } from 'react-router';
//import { StyleRules } from '@material-ui/core/styles/withStyles';
//import SurveyProcessor from '../surveyProcessor';

interface StudyResult {
  data: any
}
class StudyInfo extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);

    this.state = {
      study: {},
      participants: {},
      tabIndex: 0,
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
            participantId
            studyId
            canRecieveSMS
            email
            studyGroup
            participantStatus
            shortId
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
        createParticipants(input: {participantId: "${id}", studyId: "${this.props.match.params.id.split(":")[0]}", firstName:"${this.state.firstName}", lastName:"${this.state.lastName}"}) {
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
            participantId
            studyId
            canRecieveSMS
            email
            studyGroup
            participantStatus
            shortId
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

  private handleTabChange = async (event, value) => {
    event.preventDefault();
    this.setState({
      tabIndex: value
    });
  };

  private handleManageStudyClick = event => {
    event.stopPropagation();
    event.preventDefault();

    this.props.history.push(`${this.props.match.params.id}/manage-study`);
  }

  private fetchData = async (event) => {
    const GetSurveys = `
    query FetchData {
      getSurveyData(userId: "aalderman", studyId: "DwMLAgMACAU") {
        body
      }
    }`;

    const surveys = await API.graphql(graphqlOperation(GetSurveys));
    console.log(surveys);
    if ((surveys as GraphQLResult).data !== undefined) {
      this.setState({surveys:JSON.parse((surveys as StudyResult).data.getSurveyData.body)});
    }
  }

  private getCurrentTab() {
    switch (this.state.tabIndex) {
      case 0:
        return (
          <div className="participants-wrapper">
          <h2>Participants</h2>
          <div className="part-li-header-wrapper">
            <div className="part-li-header-id">
              <h3>Study ID</h3>
            </div>
            <div className="part-li-header-first-name">
              <h3>First Name</h3>
            </div>
            <div className="part-li-header-last-name">
              <h3>Last Name</h3>
            </div>
            <div className="part-li-header-status">
              <h3>Status</h3>
            </div>
            <div className="part-li-header-group">
              <h3>Group</h3>
            </div>
            <div className="part-li-header-sms">
              <h3>SMS</h3>
            </div>
          </div>
            <List>
              {this.state.participants.map((element, index) => 
                <ParticipantListItem 
                  key={index} 
                  dark={index%2 === 1} 
                  firstName={element.firstName} 
                  lastName={element.lastName} 
                  permalink={`/studies/${this.props.match.params.id}/participant/${element.participantId}`}
                  studyId={element.shortId}
                  group={element.studyGroup}
                  status={element.participantStatus}
                  sms={element.canRecieveSMS}
                />)}
            </List>
          </div>
        );
      case 1:
        return (
          <div className="groups-wrapper">
            This is the groups tab.
          </div>
        );
      case 2:
        return (
          <div className="messages-wrapper">
            This is the messages tab.
          </div>
        );
      case 3:
        return (
          <div className="calls-wrapper">
            This is the calls tab.
          </div>
        );
      case 4:
        return (
          <div className="surveys-wrapper">
            This is the surveys tab.
            <Button
              onClick={this.fetchData}
            >
              Fetch Data
            </Button>
          </div>
        );
      default: 
        console.log("Recieved tab index that doesn't exist.")
        return null;
    }
  }

  public render() {
    console.log(this.state.surveys);
    if (this.state.isLoading) {
      return (
        <div className="loading-wrapper">
          <CircularProgress color="primary"/>
        </div>
      );
    }
    return ( !this.state.isLoading &&
      <div className="StudyInfo">
        <div className="study-info-search-wrapper">
          <Search searchList={this.state.participants}/>
        </div>
        <div className="study-info-header">
          <h1 className="study-info-title">{this.state.study.title}</h1>
          {this.state.tabIndex === 0 && <Button
            variant="raised"
            color="secondary"
            style={{width: "198px"}}
            onClick={(event) => {event.preventDefault(); this.setState({modalOpen: true})}}
          >
            Add Participant
          </Button>}
          <Button
            style={{width: "198px", marginLeft: "30px"}}
            variant="outlined"
            onClick={this.handleManageStudyClick}
          >
            Manage Study
          </Button>
        </div>
        <div className="study-info-tab-wrapper">
          <Tabs
            onChange={this.handleTabChange}
            value={this.state.tabIndex}
            indicatorColor="primary"
          >
            <Tab 
              label="Participants"
              disableRipple
            />
            <Tab 
              label="Groups"
              disableRipple
            />
            <Tab 
              label="Messages" 
              disableRipple
            />
            <Tab 
              label="Calls" 
              disableRipple
            />
            <Tab 
              label="Surveys" 
              disableRipple
            />
          </Tabs>
        </div>
        {this.getCurrentTab()}
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

export default withRouter(StudyInfo);