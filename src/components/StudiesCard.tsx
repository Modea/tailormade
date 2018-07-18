import * as React from 'react';
import { withRouter } from 'react-router';
import { Card, CardContent, Grid, LinearProgress, Avatar, Button } from '@material-ui/core';
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
          <Grid container direction="row" wrap="wrap" alignContent="center" justify="center" alignItems="center">
            <Grid item md={6}>
              {<Avatar sizes="sm">AA</Avatar>}
            </Grid>
            <Grid item md={6}>
              {this.props.clinicalTrialId}
            </Grid>
            <Grid item md={12}>
              <p>{this.props.title}</p>
            </Grid>
            <Grid item md={12}>
              <p>{this.props.numOfParticipants} Participant{this.props.numOfParticipants === 1 ? "" : "s"}</p>
            </Grid>
            <Grid item md={12}>
              <Button onClick={() => {this.props.history.push(`/studies/${this.props.id}:${this.props.groupId}`)}} variant="raised">View</Button>
            </Grid>
            <Grid item md={12}>
              <p className="subtext">IRB approval needed in {this.props.daysRemaining} day{this.props.daysRemaining === "1" ? "" : "s" }</p>
            </Grid>
            <Grid item md={12}>
              <LinearProgress variant="determinate" value={(366 - parseInt(this.props.daysRemaining))/366 * 100} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withRouter(StudiesCard);