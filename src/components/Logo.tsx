import * as React from "react";
import './styles/Logo.css';

export default (props) => 
  <div className={`logo${props.small ? ' sm' : ''}${props.alt ? ' alt' : ''}${props.left ? ' left' : ''}`}>
    {props.alt ? <img className="logo-image" src="./puzzle-man.png" /> : <img className="logo-image" src="./puzzle-man-dark.svg" />}
    <p className="logo-text">Tailor<span className="logo-text-bold">Made</span></p>
  </div>;