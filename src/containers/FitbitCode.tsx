import * as React from 'react';

class FitbitCode extends React.Component<any, any> {
    constructor(props) {
      super(props);
    }
  
    render() {
        const queryString = require('query-string');
        const parsed = queryString.parse(this.props.location.search);
        let studyMark = parsed.state.indexOf('studies-');
        let participentMark = parsed.state.indexOf('--participant-');
        let studyID = parsed.state.substr(studyMark+8,participentMark-8);
        let participentID = parsed.state.substr(participentMark+14);
        console.log(parsed);
      return(
        <div>
          <div>{parsed.code}</div>
          <div>{studyID}</div>
          <div>{participentID}</div>
        </div>
      );
    }
  
  }
  
  export default FitbitCode;