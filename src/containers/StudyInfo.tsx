import * as React from 'react';
import './styles/StudyInfo.css';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '../../node_modules/aws-amplify/lib/API/types';
import { List, Button, Dialog, DialogContent, DialogTitle, TextField, Tabs, Tab, CircularProgress } from '@material-ui/core';
import Search from '../components/Search';
import ParticipantListItem from '../components/ParticipantListItem';
import uuidv1 from 'uuid';
import { withRouter } from 'react-router';
import * as participantSort from '../util/participantSort';
import SurveyQuestionList from '../components/SurveyQuestionList';
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
      sort: { 
        by: "shortId", 
        order: "asc"
      },
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
      await this.fetchSurveyData();
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
        let participantList = (participants as StudyResult).data.listParticipantsForStudy.items;
        participantList.sort(participantSort.sortById);
        this.setState({study: (study as StudyResult).data.getStudies, participants:participantList, isLoading: false});
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

  private fetchSurveyData = async () => {
    const GetSurveys = `query GetSurveyDetails {
      getSurveyDetails(studyId: "${this.props.match.params.id.split(":")[0]}") {
        items {
          surveyId
          studyId
          surveyObject {
            choices
            label
            name
            type
            groupName
            form
            questions {
              choices
              label
              name
              type
              groupName
              form
            }
          }
          friendlyName
        }
      }
    }`;

    const surveys = await API.graphql(graphqlOperation(GetSurveys));
    console.log(surveys);
    if ((surveys as GraphQLResult).data !== undefined) {
      this.setState({surveys:((surveys as StudyResult).data.getSurveyDetails.items)});
    }
  }

  private getSortIcon(columnName) {
    if (columnName === this.state.sort.by) {
      if (this.state.sort.order === "asc") {
        return (
          <div className="sort-icon-wrapper">
            <i className="material-icons sort-icon">keyboard_arrow_up</i>
          </div>
        );
      } else {
        return (
          <div className="sort-icon-wrapper">
            <i className="material-icons sort-icon">keyboard_arrow_down</i>
          </div>
        );
      }
    } else {
      return null;
    }
  }

  private handleSortColumn = (columnName) => {
    if (columnName !== this.state.sort.by) {
      this.setState({
        sort: {
          by: columnName,
          order: "asc"
        }
      });
      this.sortParticipants(columnName, "asc");
    } else {
      this.setState({
        sort: {
          by: columnName,
          order: (this.state.sort.order === "asc" ? "desc" : "asc")
        }
      });
      this.sortParticipants(columnName, (this.state.sort.order === "asc" ? "desc" : "asc"));
    }
  }

  private sortParticipants = (by, order) => {
    let participantList = new Array();
    
    this.state.participants.forEach(element => {
      participantList.push(element);
    });

    switch (by) {
      case "shortId":
        if (order === "asc") {
          participantList.sort(participantSort.sortById);
        } else {
          participantList.sort((a, b) => {return -1 * participantSort.sortById(a, b)});
        }
        break;
      case "firstName":
        if (order === "asc") {
          participantList.sort(participantSort.sortByFirstName);
        } else {
          participantList.sort((a, b) => {return -1 * participantSort.sortByFirstName(a, b)});
        }
        break;
      case "lastName":
        if (order === "asc") {
          participantList.sort(participantSort.sortByLastName);
        } else {
          participantList.sort((a, b) => {return -1 * participantSort.sortByLastName(a, b)});
        }
        break;
      case "studyGroup":
        if (order === "asc") {
          participantList.sort(participantSort.sortByGroup);
        } else {
          participantList.sort((a, b) => {return -1 * participantSort.sortByGroup(a, b)});
        }
        break;
      case "participantStatus":
        if (order === "asc") {
          participantList.sort(participantSort.sortByStatus);
        } else {
          participantList.sort((a, b) => {return -1 * participantSort.sortByStatus(a, b)});
        }
        break;
    }

    this.setState({
      participants: participantList
    });
  }

  private getCurrentTab() {
    switch (this.state.tabIndex) {
      case 0:
        return (
          <div className="participants-wrapper">
          <h2>Participants</h2>
          <div className="part-li-header-wrapper">
            <div className="part-li-header-id" onClick={(event) => {this.handleSortColumn("shortId");}}>
              <h3>Study ID</h3>
              {this.getSortIcon("shortId")}
            </div>
            <div className="part-li-header-first-name" onClick={(event) => {this.handleSortColumn("firstName");}}>
              <h3>First Name</h3>
              {this.getSortIcon("firstName")}
            </div>
            <div className="part-li-header-last-name" onClick={(event) => {this.handleSortColumn("lastName");}}>
              <h3>Last Name</h3>
              {this.getSortIcon("lastName")}
            </div>
            <div className="part-li-header-status" onClick={(event) => {this.handleSortColumn("participantStatus");}}>
              <h3>Status</h3>
              {this.getSortIcon("participantStatus")}
            </div>
            <div className="part-li-header-group" onClick={(event) => {this.handleSortColumn("studyGroup");}}>
              <h3>Group</h3>
              {this.getSortIcon("studyGroup")}
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
        return this.getSurveyTab();
      default: 
        console.log("Recieved tab index that doesn't exist.")
        return null;
    }
  }

  private getSurveyTab = () => {
    if (this.state.surveys.length > 0) {
      return (
        <div className="surveys-wrapper">
          <div className="surveys-selector">
            {this.state.surveys.map((element, index) => 
              <div className="survey-selector-item selected" key={index}>{element.friendlyName}</div>
            )}
          </div>
          <div className="survey-details-wrapper">
            <SurveyQuestionList questionList={this.state.surveys[0].surveyObject} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="surveys-wrapper">
          No survey data found for this study.
        </div>
      );
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
      <div className="StudyInfo">
        <div className="study-info-search-wrapper">
          <Search searchList={this.state.participants} study={this.props.match.params.id}/>
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