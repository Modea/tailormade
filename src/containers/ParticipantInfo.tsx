import * as React from 'react';
import './styles/ParticipantInfo.css';

class ParticipantInfo extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        {this.props.match.params.studyId}
        {this.props.match.params.id}
      </div>
    );
  }
}

export default ParticipantInfo;