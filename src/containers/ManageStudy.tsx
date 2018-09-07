import * as React from 'react';
import './styles/ManageStudy.css';
import * as uuid from 'uuid';
// import { withRouter } from 'react-router';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { Button, CircularProgress, DialogContent, Dialog, DialogActions, DialogTitle, TextField, Snackbar, IconButton } from '@material-ui/core';
// import * as got from 'got';
import AddREDCapKey from '../components/AddREDCapKey';
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
      isLoading: true,
      deleteKeyDialogOpen: false, 
      editKeyDialogOpen: false, 
      activeSurveyId: null,
      activeSurveyName: "",
      activeSurveyKey: "",
      activeSurveyType: "",
      activeSurveyParticipantIdField: "",
      deleteKeyConfirm: ""
    };
  }

  public async componentDidMount() {
    const GetStudy = `
      query GetStudy {
        getStudies(groupId: "${this.props.match.params.id.split(":")[1]}", studyId: "${this.props.match.params.id.split(":")[0]}") {
          title
        }
      }`;

    const GetAPIKeys = `query GetAPIKeys {
      getREDCapAPIKeys(studyId: "${this.props.match.params.id.split(":")[0]}") {
        items {
          studyId
          surveyId
          apiKey
          friendlyName
          participantIdField
          type
        }
      }
    }`

    const user = await Auth.currentAuthenticatedUser();

    this.setState({user})

    if (user) {
      if (user.attributes['custom:unsecureRole'] === "admin") {
        const study = await API.graphql(graphqlOperation(GetStudy));
        if ((study as GraphQLResult).data !== undefined) {
          console.log(study);
          this.setState({study: {title: (study as ApiKeyListResult).data.getStudies.title}});
        }
        const apiKeyList = await API.graphql(graphqlOperation(GetAPIKeys));
        if ((apiKeyList as GraphQLResult).data !== undefined) {
          console.log(apiKeyList);
          this.setState({apiKeys: (apiKeyList as ApiKeyListResult).data.getREDCapAPIKeys.items});
        }
      } else {

      }
    } else {

    }

    this.setState({isLoading: false});
  }

  public handleKeyChange = async () => {
    const GetAPIKeys = `query GetAPIKeys {
      getREDCapAPIKeys(studyId: "${this.props.match.params.id.split(":")[0]}") {
        items {
          studyId
          surveyId
          apiKey
          friendlyName
          participantIdField
          type
        }
      }
    }`

    const apiKeyList = await API.graphql(graphqlOperation(GetAPIKeys));
    if ((apiKeyList as GraphQLResult).data !== undefined) {
      console.log(apiKeyList);
      this.setState({apiKeys: (apiKeyList as ApiKeyListResult).data.getREDCapAPIKeys.items});
    }
  }

  private setActiveSurvey = (surveyId) => {
    let activeSurvey: any;

    this.state.apiKeys.forEach((element) => {
      if (element.surveyId === surveyId) {
        activeSurvey = element;
      }
    });

    if (activeSurvey !== null) {
      this.setState({
        activeSurveyId: activeSurvey.surveyId,
        activeSurveyName: activeSurvey.friendlyName,
        activeSurveyKey: activeSurvey.apiKey,
        activeSurveyType: activeSurvey.type,
        activeSurveyParticipantIdField: activeSurvey.participantIdField,
        deleteKeyConfirm: ""
      });
    } else {

    }
  }

  private clearActiveSurvey = () => {
    
  }

  private handleEditKey = (event, surveyId) => {
    event.stopPropagation();
    this.setActiveSurvey(surveyId);
    this.setState({editKeyDialogOpen: true});
  }

  private handleDeleteKey = (event, surveyId) => {
    event.stopPropagation();
    this.setActiveSurvey(surveyId);
    this.setState({deleteKeyDialogOpen: true, activeSurveyId: surveyId});
  }

  private closeDeleteKeyDialog = () => {
    this.clearActiveSurvey();
    this.setState({deleteKeyDialogOpen: false});
  }

  private closeEditKeyDialog = () => {
    this.clearActiveSurvey();
    this.setState({editKeyDialogOpen: false});
  }

  private confirmDeleteKey = async () => {
    const DeleteAPIKey = `mutation DeleteAPIKey {
      deleteREDCapAPIKey(surveyId: "${this.state.activeSurveyId}", studyId: "${this.props.match.params.id.split(":")[0]}") {
        studyId
        surveyId
      }
    }`

    const deleteKey = await API.graphql(graphqlOperation(DeleteAPIKey));
    if ((deleteKey as GraphQLResult).data !== undefined) {
      console.log(deleteKey);
      this.handleKeyChange();
      this.openSnackbar("Successfully deleted API key and survey.");
    }

    this.closeDeleteKeyDialog();
  }

  private saveKeyChanges = async () => {
    const UpdateKey = `mutation UpdateKey {
      updateREDCapAPIKey(input: {surveyId: "${this.state.activeSurveyId}", studyId: "${this.props.match.params.id.split(":")[0]}", friendlyName: "${this.state.activeSurveyName}", participantIdField: "${this.state.activeSurveyParticipantIdField}"}) {
        studyId
        surveyId
      }
    }`;

    const updatedKey = await API.graphql(graphqlOperation(UpdateKey));
    if ((updatedKey as GraphQLResult).data !== undefined) {
      console.log(updatedKey);
      this.handleKeyChange();
      this.openSnackbar("Successfully updated API key.");
    }

    this.closeDeleteKeyDialog();

    this.closeEditKeyDialog();
  }

  private handleChange = (event) => {
    this.setState({[(event.target as HTMLInputElement).name]: (event.target as HTMLInputElement).value});
  }

  private closeSnackbar = () => {
    this.setState({snackbar: false});
  }

  private openSnackbar = (message) => {
    this.setState({snackbar: true, snackbarMessage: message})
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
        <div className="manage-study-header">
          <h1 className="manage-study-title">Settings for {this.state.study.title}</h1>
          <h2 className="manage-study-subhead">REDCap API Keys</h2>
          <div className="manage-study-key-header">
            <div className="key-item-name">
              Friendly Name
            </div>
            <div className="key-item-key">
              API Key
            </div>
            <div className="key-item-type">
              Survey Type
            </div>
            <div className="key-item-id">
              Participant ID Field
            </div>
          </div>
          {this.state.apiKeys.map((element) => <div key={uuid()} className="manage-study-key-item">
            <div className="key-item-name">
              {element.friendlyName}
            </div>
            <div className="key-item-key">
              {element.apiKey}
            </div>
            <div className="key-item-type">
              {element.type}
            </div>
            <div className="key-item-id">
              {element.participantIdField}
            </div>
            <Button
              onClick={(event) => {this.handleEditKey(event, element.surveyId)}}
            >
              Edit
            </Button>
            <Button
              onClick={(event) => {this.handleDeleteKey(event, element.surveyId)}}
            >
              Delete
            </Button>
          </div>)}
          <AddREDCapKey study={this.props.match.params.id.split(":")[0]} onAddKey={this.handleKeyChange} />
          <Dialog
            open={this.state.deleteKeyDialogOpen}
            onClose={this.closeDeleteKeyDialog}
          >
            <DialogTitle>
              Delete API Key?
            </DialogTitle>
            <DialogContent>
              <p>
                {`Deleting the API key will also delete the survey data for every participant in this study. If you wish to continue please type the friendly name of this API key which is '${this.state.activeSurveyName}' into the text field below and click delete.`}
              </p>
              <TextField
              fullWidth
              label="REDCap API Name"
              type="text"
              name="deleteKeyConfirm"
              value={this.state.deleteKeyConfirm}
              onChange={event => this.handleChange(event)}
              margin="dense"
            />
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                onClick={this.closeDeleteKeyDialog}
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                disabled={this.state.deleteKeyConfirm !== this.state.activeSurveyName}
                onClick={this.confirmDeleteKey}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            onClose={this.closeEditKeyDialog}
            open={this.state.editKeyDialogOpen}
          >
            <DialogContent>
              <p>You can edit the friendly name of the survey and the name of the participant ID field below. The API key cannot be changed.</p>
              <TextField
                fullWidth
                disabled
                label="REDCap API Key"
                type="text"
                name="activeSurveyKey"
                value={this.state.activeSurveyKey}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Friendly Name"
                type="text"
                name="activeSurveyName"
                value={this.state.activeSurveyName}
                onChange={event => this.handleChange(event)}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Participant ID Field"
                type="text"
                name="activeSurveyParticipantIdField"
                value={this.state.activeSurveyParticipantIdField}
                onChange={event => this.handleChange(event)}
                margin="dense"
              />
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                onClick={this.closeEditKeyDialog}
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                onClick={this.saveKeyChanges}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          open={this.state.snackbar}
          autoHideDuration={4000}
          onClose={this.closeSnackbar}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={
            <span id="message-id">{this.state.snackbarMessage}</span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.closeSnackbar}
            >
              <i className="material-icons">close</i>
            </IconButton>
          ]}
        />
        </div>
      </div>
    );
  }
}

export default ManageStudy;