import * as React from "react";

export default (props) => 
!props.subtext ? <p className="text">{props.children}</p> : <p className="subtext">{props.children}</p>;