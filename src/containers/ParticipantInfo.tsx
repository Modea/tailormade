import * as React from 'react';
import './styles/ParticipantInfo.css';

class ParticipantInfo extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        <b>{this.props.match.params.studyId}</b>
        {this.props.match.params.id}
        <div>
          <a href={"https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22D3WD&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ffitbitcode&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&prompt=login&state=studies-"+this.props.match.params.studyId+"--participant-"+this.props.match.params.id}>
            Get FitBit Authorization Code
          </a>
        </div>
      </div>
    );
  }

  g

}



export default ParticipantInfo;