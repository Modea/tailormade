let currentMatrixGroup = null;
let currentMatrixGroupName = "";
let surveyObject = [];

export default function processSurveyQuestions(rawData) {

  rawData.map((element, index) => {
    if (currentMatrixGroup) {
      if (currentMatrixGroupName !== element["matrix_group_name"]) {
        // Push the current group
        pushGroup();
        if (element["matrix_group_name"] !== "") {
          // Create a new group and add the question to it.
          createNewGroup(element);
          addQuestionToCurrentGroup(element);
        } else {
          // Add the question to the survey.
          addQuestionToSurvey(element);
        }
      } else {
        // Add question to matrix group.
        addQuestionToCurrentGroup(element);
      }
    } else {
      if (currentMatrixGroupName !== element["matrix_group_name"]) {
        // Create a new group and add the question to it.
        createNewGroup(element);
        addQuestionToCurrentGroup(element);
      } else {
        // Add the question to the survey.
        addQuestionToSurvey(element);
      }
    }
  });

  return surveyObject;
}

function pushGroup() {
  surveyObject.push(currentMatrixGroup);
  currentMatrixGroup = null;
  currentMatrixGroupName = "";
}

function createNewGroup(element) {
  currentMatrixGroup = {
    name: element["matrix_group_name"] !== "" ? element["matrix_group_name"] : "N/A",
    label: element["section_header"] !== "" ? element["section_header"] : "N/A",
    questions: [],
    type: "group"
  };

  currentMatrixGroupName = element["matrix_group_name"];
}

function addQuestionToCurrentGroup(element) {
  if (
    element["field_type"] !== "text" &&
    element["field_type"] !== "calc" &&
    element["field_type"] !== "yesno"
  ) {
    var choices = [];
    var splitArray = element["select_choices_or_calculations"].split(" | ");
    splitArray.map(element => {
      choices.push({
        key: element.split(", ")[0], 
        value: element.split(", ")[1]
      });
    });
    currentMatrixGroup.questions.push({
      name: element["field_name"] !== "" ? element["field_name"] : "N/A",
      label: element["field_label"] !== "" ? element["field_label"] : "N/A",
      type: element["field_type"] !== "" ? element["field_type"] : "N/A",
      choices,
      groupName: element["matrix_group_name"] !== "" ? element["matrix_group_name"] : "N/A"
    });
  } else {
    currentMatrixGroup.questions.push({
      name: element["field_name"] !== "" ? element["field_name"] : "N/A",
      label: element["field_label"] !== "" ? element["field_label"] : "N/A",
      type: element["field_type"] !== "" ? element["field_type"] : "N/A",
      groupName: element["matrix_group_name"] !== "" ? element["matrix_group_name"] : "N/A"
    });
  }
}

function addQuestionToSurvey(element) {
  if (
    element["field_type"] !== "text" &&
    element["field_type"] !== "calc" &&
    element["field_type"] !== "yesno"
  ) {
    var choices = [];
    var splitArray = element["select_choices_or_calculations"].split(" | ");
    splitArray.map(element => {
      choices.push({
        key: element.split(", ")[0], 
        value: element.split(", ")[1]
      });
    });
    surveyObject.push({
      name: element["field_name"] !== "" ? element["field_name"] : "N/A",
      label: element["field_label"] !== "" ? element["field_label"] : "N/A",
      type: element["field_type"] !== "" ? element["field_type"] : "N/A",
      choices,
      groupName: element["matrix_group_name"] !== "" ? element["matrix_group_name"] : "N/A"
    });
  } else {
    surveyObject.push({
      name: element["field_name"] !== "" ? element["field_name"] : "N/A",
      label: element["field_label"] !== "" ? element["field_label"] : "N/A",
      type: element["field_type"] !== "" ? element["field_type"] : "N/A",
      groupName: element["matrix_group_name"] !== "" ? element["matrix_group_name"] : "N/A"
    });
  }
}