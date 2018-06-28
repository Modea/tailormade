import * as React from 'react';
import './styles/StyleGuide.css';
import { Table } from 'react-bootstrap';
import Heading from '../components/styled/Heading';
import Text from '../components/styled/Text';


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
              <td><Heading>Example Text</Heading></td>
              <td><code>{'<Heading>Example Text</Heading>'}</code></td>
            </tr>
            <tr>
              <td><Heading subhead>Example Text</Heading></td>
              <td><code>{'<Heading subhead>Example Text</Heading>'}</code></td>
            </tr>
            <tr>
              <td><Text>Example Text</Text></td>
              <td><code>{'<Text>Example Text</Text>'}</code></td>
            </tr>
            <tr>
              <td><Text subtext>Example Text</Text></td>
              <td><code>{'<Text subtext>Example Text</Text>'}</code></td>
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
      </div>
    );
  }
}

export default StyleGuide;