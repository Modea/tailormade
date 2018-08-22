import * as React from 'react';
import './styles/CreateStudy.css';
import { Stepper, Step, StepLabel, Typography, TextField } from '@material-ui/core';
import { withRouter } from 'react-router';
import DatePicker from '../components/DatePicker';
// import * as moment from 'moment';

class CreateStudy extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);

    this.state = {
      currentStep: 0,
    };
  }

  public async componentDidMount() {
    
  }

  private handleChange = (event) => {
    this.setState({[(event.target as HTMLInputElement).id]: (event.target as HTMLInputElement).value});
  }

  private handleSubmit = event => {

  }

  private getNavBar = () => {
    let prevButton = null;
    let nextButton = null;
    let skipButton = null;
    let finishButton = null;

    return (
      <div className="create-study-nav-bar">
        {prevButton}
        {nextButton}
        {skipButton}
        {finishButton}
      </div>
    );
  }

  getCurrentScreen = () => {
    switch (this.state.currentStep) {
      case 0: 
        return (
          <div>
            <div>
              <h2>General Info</h2>
              <form onSubmit={(event) => this.handleSubmit(event)}>
                <TextField 
                  label="Study Name"
                  type="text"
                  id="studyName"
                  onChange={(event) => this.handleChange(event)}
                  margin="normal"
                  classes={{root: "field-background"}}
                />
                <TextField 
                  label="Clinical Trial ID"
                  helperText="Optional"
                  type="text"
                  id="studyName"
                  onChange={(event) => this.handleChange(event)}
                  margin="normal"
                  classes={{root: "field-background"}}
                />
                <br />
                <DatePicker dateLabel="Start Date"/>
                <DatePicker dateLabel="End Date"/>
                <br />
              </form>
            </div>
          </div>
        );
      case 1: 
        return (
          null
        );
      case 2: 
        return (
          null
        );
      case 3: 
        return (
          null
        );
      case 4: 
        return (
          null
        );
      default:
        return null;
    }
  }

  public render() {
    return ( !this.state.isLoadingList &&
      <div className="CreateStudy">
        <h1>Create New Study</h1>
        <Stepper classes={{root: "transparent-background"}} activeStep={this.state.currentStep}>
          <Step>
            <StepLabel>
              Study Information
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              Goal Information
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              Connect REDCap API
              <Typography variant="caption">Optional</Typography>
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              Connect Twilio API
              <Typography variant="caption">Optional</Typography>
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              SMS Messaging and IVR
              <Typography variant="caption">Optional</Typography>
            </StepLabel>
          </Step>
        </Stepper>
        {this.getCurrentScreen()}
        {this.getNavBar()}
      </div>
    );
  }
}

export default withRouter(CreateStudy);