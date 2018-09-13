export const parseChoices = (choicesString) => {
  let choices = new Array();

  let rawArray = choicesString.split("}, {");

  for (let i = 0; i < rawArray.length; i++) {
    let choice;
    if (i === 0) {
      choice = rawArray[i].substring(2);
    } else if (i === rawArray.length - 1) {
      choice = rawArray[i].substring(0, rawArray[i].length - 2);
    } else {
      choice = rawArray[i];
    }

    //let index = parseInt(choice.split(', ')[1].substring(4));
    if (choice.split(', ').length === 1) {
      console.log(choice.split(', '));
    }
    
    choices[i] = choice.split(', ')[0].substring(6);
  }

  return null;
}