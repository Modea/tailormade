import * as React from "react";
import SurveyQuestion from "./SurveyQuestion";
import './styles/SurveyQuestionList.css';

export default (props) => 
  <div className="survey-question-list">
    {props.questionList.length > 0 ? 
      props.questionList.map((element, index) => 
        <SurveyQuestion key={index} question={element} />
      )
      : <div>No questions found.</div>
    }
  </div>;