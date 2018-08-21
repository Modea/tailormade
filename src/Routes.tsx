import * as React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from './components/AppliedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import Login from "./containers/Login";
import Studies from "./containers/Studies";
import NotFound from "./containers/NotFound";
import StyleGuide from "./containers/StyleGuide";
import AdminDashboard from "./containers/AdminDashboard";
import StudyInfo from "./containers/StudyInfo"
import ParticipantInfo from "./containers/ParticipantInfo";
import FitbitCode from "./containers/FitbitCode";

export default ({ childProps }) => 
<Switch>
  <UnauthenticatedRoute path="/" exact component={Login} props={childProps} />
  <AuthenticatedRoute path="/studies" exact component={Studies} props={childProps} />
  <AuthenticatedRoute path="/studies/:id" exact component={StudyInfo} props={childProps} />
  <AuthenticatedRoute path="/studies/:studyId/participant/:id" exact component={ParticipantInfo} props={childProps} />
  <AuthenticatedRoute path="/dashboard" exact component={AdminDashboard} props={childProps} />
  <AuthenticatedRoute path="/fitbitcode" exact component={FitbitCode} props={childProps} />
  <AppliedRoute path="/style-guide" exact component={StyleGuide} props={childProps} />
  <Route default component={NotFound} />
</Switch>;