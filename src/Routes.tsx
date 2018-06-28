import * as React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from './components/AppliedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import Login from "./containers/Login";
import Studies from "./containers/Studies";
import NotFound from "./containers/NotFound";
import StyleGuide from "./containers/StyleGuide";

export default ({ childProps }) => 
<Switch>
  <UnauthenticatedRoute path="/" exact component={Login} props={childProps} />
  <AuthenticatedRoute path="/my-studies" exact component={Studies} props={childProps} />
  <AppliedRoute path="/style-guide" exact component={StyleGuide} props={childProps} />
  <Route default component={NotFound} />
</Switch>;