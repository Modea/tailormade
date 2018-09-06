import * as React from 'react';
import { withRouter } from 'react-router';
import './styles/ParticipantListItem.css';
import { Paper, Switch, Button } from '@material-ui/core';

class ParticipantListItem extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      smsActive: this.props.sms
    }
  }

  toggleExpansion = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({expanded: !this.state.expanded})
  }

  handleClick = (event) => {
    event.preventDefault();

    this.props.history.push(`${this.props.permalink}`)
  }

  handleSMSClick = (event) => {
    event.stopPropagation();
    event.preventDefault();

    this.setState({smsActive: !this.state.smsActive});
  }

  render() {
    const surveyDetails = this.state.expanded ? <div className="survey-text">Survey results would appear here.</div> : null;
    return (
      <Paper style={this.props.dark ? {background: "#e0e0e0", marginBottom: "25px"} : {marginBottom: "25px"}}>
        <div className="part-li-wrapper">
          <div className="part-li-id">
            {this.props.studyId}
          </div>
          <div className="part-li-first-name">
            {this.props.firstName}
          </div>
          <div className="part-li-last-name">
            {this.props.lastName}
          </div>
          <div className="part-li-status">
            {this.props.status}
          </div>
          <div className="part-li-group">
            {this.props.group}
          </div>
          <div className="part-li-sms">
            <Switch value="id" color="primary" checked={this.state.smsActive} onClick={this.handleSMSClick}/>
          </div>
          <div className="part-li-view">
            <Button variant="raised" color="secondary" style={{minWidth: 100}} onClick={this.handleClick}>View</Button>
          </div>
          <div className="part-li-expand">
            <i className="material-icons part-li-more" onClick={this.toggleExpansion}>more_vert</i>
          </div>
        </div>
        {surveyDetails}
      </Paper>
    );
  }
}

export default withRouter(ParticipantListItem);