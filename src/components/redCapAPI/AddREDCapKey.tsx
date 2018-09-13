import * as React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  TextField,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  DialogActions,
  DialogTitle,
  Snackbar,
  IconButton
} from "@material-ui/core";
import * as got from "got";
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from 'aws-amplify/lib/API/types';

enum AddREDCapKeyState {
  ENTER_KEY,
  CONFIRM_TITLE,
  CONNECT_FIELD,
  LOADING,
  API_KEY_ERROR,
  FIELD_ERROR
}

class AddREDCapKey extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);

    this.state = {
      isREDCapDialogOpen: false,
      REDCapKey: "",
      REDCapType: "select",
      REDCapName: "",
      REDCapProjectName: "",
      REDCapPartId: "",
      REDCapState: AddREDCapKeyState.ENTER_KEY,
      REDCapSnackbar: false,
      REDCapSnackbarMessage: "",
      REDCapErrorMessage: ""
    };
  }

  private handleChange = event => {
    this.setState({
      [(event.target as HTMLInputElement)
        .name]: (event.target as HTMLInputElement).value
    });
  };

  private openAddNewREDCapKey = event => {
    this.setState({
      isREDCapDialogOpen: true,
      REDCapKey: "",
      REDCapType: "select",
      REDCapName: "",
      REDCapProjectName: "",
      REDCapPartId: "",
      REDCapState: AddREDCapKeyState.ENTER_KEY,
      REDCapSnackbar: false,
      REDCapSnackbarMessage: "",
      REDCapErrorMessage: ""
    });
  };

  private closeAddNewREDCapKey = event => {
    this.setState({
      isREDCapDialogOpen: false
    });
  };

  private closeSnackbar = event => {
    this.setState({ REDCapSnackbar: false });
  };

  private testREDCapKey = async event => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ REDCapState: AddREDCapKeyState.LOADING });

    const APIOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `token=${
        this.state.REDCapKey
      }&content=project&format=json&returnFormat=json`
    };

    const result = await got(
      "https://redcap.vanderbilt.edu/api/",
      APIOptions
    ).then(
      data => {
        return JSON.parse(data.body).project_title;
      },
      data => {
        return "ERR";
      }
    );

    if (result === "ERR") {
      this.setState({ REDCapState: AddREDCapKeyState.API_KEY_ERROR });
    } else {
      this.setState({
        REDCapState: AddREDCapKeyState.CONFIRM_TITLE,
        REDCapProjectName: result
      });
    }
  };

  private addREDCapKey = async event => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ REDCapState: AddREDCapKeyState.LOADING });

    const APIOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `token=${
        this.state.REDCapKey
      }&content=metadata&format=json&returnFormat=json&fields[0]=${
        this.state.REDCapPartId
      }`
    };

    const result = await got(
      "https://redcap.vanderbilt.edu/api/",
      APIOptions
    ).then(
      data => {
        const res = JSON.parse(data.body);
        if (res.length > 0) {
          return "SUCCESS";
        } else {
          return "ERR";
        }
      },
      data => {
        return "NET_ERR";
      }
    );

    if (result === "ERR") {
      this.setState({ REDCapState: AddREDCapKeyState.FIELD_ERROR });
    } else if (result === "NET_ERR") {
      this.setState({
        REDCapState: AddREDCapKeyState.CONNECT_FIELD,
        REDCapSnackbarMessage: "Could not connect to the REDCap API. Please try again later.",
        REDCapSnackbar: true
      });
    } else if (result === "SUCCESS") {
      const AddAPIKey = `mutation AddAPIKey {
        addREDCapAPIKey(input: {studyId: "${this.props.study}", apiKey: "${this.state.REDCapKey}", friendlyName: "${this.state.REDCapName}", type: "${this.state.REDCapType}", participantIdField: "${this.state.REDCapPartId}"}) {
          studyId
          surveyId
        }
      }`;

      const apiKey = await API.graphql(graphqlOperation(AddAPIKey));

      let surveyId = null;
      let studyId = null;
      
      if ((apiKey as GraphQLResult).data !== undefined) {
        surveyId = (apiKey as any).data.addREDCapAPIKey.surveyId;
        studyId = (apiKey as any).data.addREDCapAPIKey.studyId;
      }

      this.setState({
        REDCapSnackbarMessage: "Successfully added API key and survey.",
        REDCapSnackbar: true
      });

      this.props.onAddKey();

      this.closeAddNewREDCapKey(null);

      const FetchSurvey = `mutation FetchSurveyData {
        fetchSurveyData(studyId: "${studyId}", surveyId: "${surveyId}") {
          body
        }
      }`

      const surveyData = await API.graphql(graphqlOperation(FetchSurvey));

      console.log(surveyData);
    }
  };

  private getCurrentREDCapDialog = () => {
    switch (this.state.REDCapState) {
      case AddREDCapKeyState.ENTER_KEY:
        return (
          <DialogContent>
            <p>Enter the information below to add a REDCap API key.</p>
            <TextField
              fullWidth
              label="Friendly Name"
              type="text"
              name="REDCapName"
              value={this.state.REDCapName}
              onChange={event => this.handleChange(event)}
              margin="dense"
            />
            <TextField
              fullWidth
              label="REDCap API Key"
              type="text"
              name="REDCapKey"
              value={this.state.REDCapKey}
              onChange={event => this.handleChange(event)}
              margin="dense"
            />
            <FormControl>
              <InputLabel htmlFor="role">Survey Type</InputLabel>
              <Select
                value={this.state.REDCapType}
                onChange={event => {
                  this.handleChange(event);
                }}
                inputProps={{
                  name: "REDCapType"
                }}
              >
                <MenuItem dense value="select">
                  Select an option...
                </MenuItem>
                <MenuItem dense value="single">
                  Single Survey
                </MenuItem>
                <MenuItem dense value="multi">
                  Multiple Arms
                </MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
        );
      case AddREDCapKeyState.CONFIRM_TITLE:
        return (
          <DialogContent>
            <p>Is this the project you are trying to connect?</p>
            <h3>{this.state.REDCapProjectName}</h3>
          </DialogContent>
        );
      case AddREDCapKeyState.API_KEY_ERROR:
        return (
          <DialogContent>
            <p>
              The API key that was entered could not be matched to a REDCap project. Please try again.
            </p>
          </DialogContent>
        );
      case AddREDCapKeyState.FIELD_ERROR:
        return (
          <DialogContent>
            <p>
              The field could not be found in this project. Please try again.
            </p>
          </DialogContent>
        );
      case AddREDCapKeyState.CONNECT_FIELD:
        return (
          <DialogContent>
            <p>Enter the name of the field that contains the participant ID.</p>
            <TextField
              fullWidth
              label="Participant ID Field"
              type="text"
              name="REDCapPartId"
              value={this.state.REDCapPartId}
              onChange={event => this.handleChange(event)}
              margin="dense"
            />
          </DialogContent>
        );
      case AddREDCapKeyState.LOADING:
        return (
          <div className="loading-dialog-wrapper">
            <CircularProgress color="primary" />
          </div>
        );
      default:
        return <DialogContent>ERROR: State not recognized.</DialogContent>;
    }
  };

  private getCurrentREDCapActions = () => {
    switch (this.state.REDCapState) {
      case AddREDCapKeyState.ENTER_KEY:
        return (
          <DialogActions>
            <Button onClick={this.closeAddNewREDCapKey} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.testREDCapKey} color="secondary">
              Connect API Key
            </Button>
          </DialogActions>
        );
      case AddREDCapKeyState.CONFIRM_TITLE:
        return (
          <DialogActions>
            <Button onClick={this.closeAddNewREDCapKey} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={event => {
                this.setState({ REDCapState: AddREDCapKeyState.ENTER_KEY });
              }}
              color="secondary"
            >
              No
            </Button>
            <Button
              onClick={event => {
                this.setState({ REDCapState: AddREDCapKeyState.CONNECT_FIELD });
              }}
              color="secondary"
            >
              Yes
            </Button>
          </DialogActions>
        );
      case AddREDCapKeyState.CONNECT_FIELD:
        return (
          <DialogActions>
            <Button onClick={this.closeAddNewREDCapKey} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.addREDCapKey} color="secondary">
              Connect
            </Button>
          </DialogActions>
        );
      case AddREDCapKeyState.API_KEY_ERROR:
        return (
          <DialogActions>
            <Button onClick={this.closeAddNewREDCapKey} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={event => {
                this.setState({ REDCapState: AddREDCapKeyState.ENTER_KEY });
              }}
              color="secondary"
            >
              Try Another API Key
            </Button>
          </DialogActions>
        );
      case AddREDCapKeyState.FIELD_ERROR:
        return (
          <DialogActions>
            <Button onClick={this.closeAddNewREDCapKey} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={event => {
                this.setState({ REDCapState: AddREDCapKeyState.CONNECT_FIELD });
              }}
              color="secondary"
            >
              Ok
            </Button>
          </DialogActions>
        );
      case AddREDCapKeyState.LOADING:
        return null;
      default:
        return <DialogActions>ERROR: State not recognized.</DialogActions>;
    }
  };

  public render() {
    return (
      <div>
        <Button 
            onClick={this.openAddNewREDCapKey} 
            variant="outlined"
          >
            Add New Key
        </Button>
        <Dialog
          open={this.state.isREDCapDialogOpen}
          onClose={this.closeAddNewREDCapKey}
        >
          <DialogTitle>Add New REDCap API Key</DialogTitle>
          {this.getCurrentREDCapDialog()}
          {this.getCurrentREDCapActions()}
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          open={this.state.REDCapSnackbar}
          autoHideDuration={4000}
          onClose={this.closeSnackbar}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={
            <span id="message-id">{this.state.REDCapSnackbarMessage}</span>
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
    );
  }
}

export default AddREDCapKey;
