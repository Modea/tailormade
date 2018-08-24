export default class SurveyProcessor {
  metadata: [any];
  currentMatrixGroup: {
    name: String,
    label: String,
    questions: any,
    type: String
  } | null;
  currentMatrixGroupName: String;
  surveyObject: any;

  constructor(questions) {
    this.metadata = questions;
    this.currentMatrixGroup = null;
    this.currentMatrixGroupName = "";
    this.surveyObject = [];
  }

  public processSurveyQuestions() {
    this.metadata.map((element, index) => {
      if (this.currentMatrixGroup) {
        if (this.currentMatrixGroupName !== element["matrix_group_name"]) {
          // Push the current group
          this.pushGroup();
          if (element["matrix_group_name"] !== "") {
            // Create a new group and add the question to it.
            this.createNewGroup(element);
            this.addQuestionToCurrentGroup(element);
          } else {
            // Add the question to the survey.
            this.addQuestionToSurvey(element);
          }
        } else {
          // Add question to matrix group.
          this.addQuestionToCurrentGroup(element);
        }
      } else {
        if (this.currentMatrixGroupName !== element["matrix_group_name"]) {
          // Create a new group and add the question to it.
          this.createNewGroup(element);
          this.addQuestionToCurrentGroup(element);
        } else {
          // Add the question to the survey.
          this.addQuestionToSurvey(element);
        }
      }
    });

    console.log(this.surveyObject);
  }

  private pushGroup() {
    this.surveyObject.push(this.currentMatrixGroup);
    this.currentMatrixGroup = null;
    this.currentMatrixGroupName = "";
  }

  private createNewGroup(element) {
    this.currentMatrixGroup = {
      name: element["matrix_group_name"],
      label: element["section_header"],
      questions: [],
      type: "group"
    };

    this.currentMatrixGroupName = element["matrix_group_name"];
  }

  private addQuestionToCurrentGroup(element) {
    if (
      element["field_type"] !== "text" &&
      element["field_type"] !== "calc"
    ) {
      var choices: any = [];
      var splitArray = element["select_choices_or_calculations"].split(" | ");
      splitArray.map(element => {
        choices[element.split(", ")[0]] = element.split(", ")[1];
      });
      this.currentMatrixGroup !== null && this.currentMatrixGroup.questions.push({
        name: element["field_name"],
        label: element["field_label"],
        type: element["field_type"],
        choices,
        groupName: element["matrix_group_name"]
      });
    } else {
      this.currentMatrixGroup !== null && this.currentMatrixGroup.questions.push({
        name: element["field_name"],
        label: element["field_label"],
        type: element["field_type"],
        groupName: element["matrix_group_name"]
      });
    }
  }

  private addQuestionToSurvey(element) {
    if (
      element["field_type"] !== "text" &&
      element["field_type"] !== "calc"
    ) {
      let choices: any = [];
      let splitArray = element["select_choices_or_calculations"].split(" | ");
      splitArray.map(element => {
        choices[element.split(", ")[0]] = element.split(", ")[1];
      });
      this.surveyObject.push({
        name: element["field_name"],
        label: element["field_label"],
        type: element["field_type"],
        choices,
        groupName: element["matrix_group_name"]
      });
    } else {
      this.surveyObject.push({
        name: element["field_name"],
        label: element["field_label"],
        type: element["field_type"],
        groupName: element["matrix_group_name"]
      });
    }
  }

  public convertToDynamoDBMap = processedSurvey => {
    processedSurvey.forEach(element => {
      
    });
  }
}