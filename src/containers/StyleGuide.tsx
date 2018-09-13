import * as React from 'react';
import './styles/StyleGuide.css';
import { Table } from 'react-bootstrap';
import { Card, CardContent, TextField, Checkbox, Button, FormControlLabel, Grid } from '@material-ui/core';


class StyleGuide extends React.Component<any, any> {
  public constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  public render() {
    return (
      <div className="StyleGuide">
        <h1>Style Guide</h1>
        <hr/>
        Here you can see all of the styled components that are used throughout this application. It also acts as a 
        source for developers to know what components should be used to create those components across the app. For 
        reference, all components used here are contained in the <code>components/styled</code> directory of the 
        project.
        
        <br/><br/>
        <h2>Colors</h2>
        <hr/>
        
        <br/><br/>
        <h2>Typography</h2>
        <hr/>
        <Table bordered>
          <thead>
            <tr>
              <th>Element</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><h1>Example Text</h1></td>
              <td><code>{'<h1>Example Text</h1>'}</code></td>
            </tr>
            <tr>
              <td><h2>Example Text</h2></td>
              <td><code>{'<h2>Example Text</h2>'}</code></td>
            </tr>
            <tr>
              <td><p>Example Text</p></td>
              <td><code>{'<p>Example Text</p>'}</code></td>
            </tr>
            <tr>
              <td><p>Example Text</p></td>
              <td><code>{'<p>Example Text</p>'}</code></td>
            </tr>
          </tbody>
        </Table>
        Note: The default text throughout the applcation should be Roboto 16px with a line-height of 19px.

        <br/><br/>
        <h2>Buttons</h2>
        <hr/>

        <br/><br/>
        <h2>Lists</h2>
        <hr/>

        <br/><br/>
        <h2>Forms</h2>
        <hr/>
        <h3>Login Form</h3>
        <Card raised style={{width: '40%', margin: '0 auto'}}>
          <CardContent>
            <form>
              <TextField 
                fullWidth
                label="Email"
                type="email"
              />
              <TextField 
                fullWidth 
                label="Password"
                type="password"
              />
              <Grid container>
                <Grid item xs={9} sm={9}>
                  <FormControlLabel control={<Checkbox color="primary" />} label="Remember Me" />
                </Grid>
                <Grid item xs={3} sm={3}>
                <Button
                  value="login"
                  type="submit"
                  color="primary"
                  variant="raised"
                  >Sign In
                </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default StyleGuide;