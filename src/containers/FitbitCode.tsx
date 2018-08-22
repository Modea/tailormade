import * as React from 'react';

class FitbitCode extends React.Component<any, any> {
    constructor(props) {
      super(props);
    }
  
    render() {
        
        let statement: string  = this.getAccessToken();
      return(
        <div>
          {statement}
        </div>
      );
    }
    
    getAccessToken(): string {
      console.log("getAccessToken");

      const queryString = require('query-string');
        const parsed = queryString.parse(this.props.location.search);
        let studyMark = parsed.state.indexOf('studies-');
        let participentMark = parsed.state.indexOf('--participant-');
        let studyID = parsed.state.substr(studyMark+8,participentMark-8);
        let participentID = parsed.state.substr(participentMark+14);
      console.log(studyID+' '+participentID);
        
      fetch('https://api.fitbit.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic MjJEM1dEOjRkNGZiMmFmODVhYmQwODljYjBjM2Q3MTJkZmE5NmEz',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'client_id=22D3WD&grant_type=authorization_code&code='+parsed.code+'&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ffitbitcode',
      }).then(response => {
        console.log(response);
        let r = response;
        let body = r.body;
        response.json().then(json =>{
          let access_token = json.access_token;
          let refresh_token = json.refresh_token;
          console.log(access_token+" "+refresh_token);
        })
        console.log(body);

      })

      return 'getAccessToken';
    }
  }
  
  export default FitbitCode;