import * as React from 'react';
import { withRouter } from 'react-router';
import { Card, CardContent, LinearProgress, Avatar, Button } from '@material-ui/core';
import './styles/StudiesCard.css';

// const StudiesCard = ({ 
//   daysRemaining = "0",
//   title = "n/a",
//   clinicalTrialId = "n/a",
//   numOfParticipants = 0,
//   id = 0,
//   groupId = 0,
//   avatars = <Avatar sizes="sm">AA</Avatar>, 
//   ...props
// })


class StudiesCard extends React.Component<any, any> {
  public constructor(props) {
    super(props);
  }

  public render() {
    return(
      <Card>
        <CardContent>
          <div className="study-wrapper">
            <div className="study-research-info">
              <div className="study-avatars">{<Avatar sizes="sm">?</Avatar>}</div>
              <div className="study-clinical-trial-id">{this.props.clinicalTrialId}</div>
            </div>
              <div className="study-title">{this.props.title}</div>
              <div className="study-participants">{this.props.numOfParticipants} Participant{this.props.numOfParticipants === 1 ? "" : "s"}</div>
              <Button onClick={() => {this.props.history.push(`/studies/${this.props.id}:${this.props.groupId}`)}} variant="raised" color="secondary">View</Button>
              <div className="study-irb-approval">IRB approval needed in {this.props.daysRemaining} day{this.props.daysRemaining === "1" ? "" : "s" }</div>
              <LinearProgress variant="determinate" value={(366 - parseInt(this.props.daysRemaining))/366 * 100} style={{width: "70%"}} />
            </div>
        </CardContent>
      </Card>
    );
  }
}

export default withRouter(StudiesCard);