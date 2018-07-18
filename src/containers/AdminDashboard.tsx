import * as React from "react";
import "./styles/AdminDashboard.css";
import Heading from "../components/styled/Heading";
import { TextField, Select, Button, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '../../node_modules/aws-amplify/lib/API/types';

class AdminDashboard extends React.Component<any, any> {
  public constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      name: "",
      email: "",
      userRole: "select",
      userGroup: "select",
      newUser: null
    };
  }

  public validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.userRole !== "select" &&
      this.state.userGroup !== "select"
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    
    const CreateUser = `
      mutation createUser {
        createUser(input: {name:"${this.state.name}", email: "${this.state.email}", role: "${this.state.userRole}", group: "${this.state.userGroup}"}) {
          body
        }
      }
    `;

    const response = await API.graphql(graphqlOperation(CreateUser));
    if ((response as GraphQLResult).data !== undefined) {
      this.setState({ isLoading: false });
    } else {

    }

    this.setState({ isLoading: false });
  };

  public render() {
    return (
      <div className="AdminDashboard">
        <Heading>Admin Dashboard</Heading>
        <br />
        <br />
        <Heading subhead>Create New User</Heading>
        <hr />
        <form onSubmit={(event) => this.handleSubmit(event)}>
              <TextField 
                label="Name"
                type="text"
                name="name"
                onChange={(event) => this.handleChange(event)}
                margin="normal"
              />
              <TextField 
                label="Email"
                type="email"
                name="email"
                onChange={(event) => this.handleChange(event)}
                margin="normal"
              />
              <FormControl>
                <InputLabel htmlFor="role">User Role</InputLabel>
                <Select
                  value={this.state.userRole}
                  id='userRole'
                  onChange={(event) => {this.handleChange(event)}}
                  inputProps={{
                    name: 'userRole',
                    id: 'userRole',
                  }}
                >
                  <MenuItem value="select">Select an option...</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="researcher">Research Assistant</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="group">User Group</InputLabel>
                <Select
                  value={this.state.userGroup}
                  id='userGroup'
                  onChange={(event) => {this.handleChange(event)}}
                  inputProps={{
                    name: 'userGroup',
                    id: 'userGroup',
                  }}
                >
                  <MenuItem value="select">Select an option...</MenuItem>
                  <MenuItem value="0">Vanderbilt</MenuItem>
                  <MenuItem value="1">University of Miami</MenuItem>
                </Select>
              </FormControl>
              <Button
                value="login"
                type="submit"
                color="primary"
                variant="raised"
                disabled={!this.validateForm()}
                >Create User
              </Button>
            </form>
      </div>
    );
  }
}

export default AdminDashboard;
