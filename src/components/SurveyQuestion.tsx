import * as React from "react";
import * as surveyService from '../util/surveyService';

export default (props) => 
  props.question.questions !== null ? 
  <div className="survey-question sq-group">
    <div className="survey-label">{props.question.label}</div>
    <div className="survey-group-questions">{
      props.question.questions.map((element, index) => 
        <div key={index}>
        <div>{element.label}</div>
        {element.choices !== null ? <ul>
          {surveyService.parseChoices(element.choices)}
        </ul>: null}
        </div>
      )
    }</div>
  </div> :
  <div className="survey-question">
    <div className="survey-label">{props.question.label}</div>
  </div>;