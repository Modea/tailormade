import * as React from "react";

export default (props) => 
!props.subhead ? <h1>{props.children}</h1> : <h2>{props.children}</h2>;