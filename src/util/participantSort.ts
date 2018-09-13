export const sortById = (partA, partB) => {
  return parseInt(partA.shortId.substring(2), 10) - parseInt(partB.shortId.substring(2), 10);
}

export const sortByGroup = (partA, partB) => {
  var nameA = partA.studyGroup.toUpperCase(); // ignore upper and lowercase
  var nameB = partB.studyGroup.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

export const sortByStatus = (partA, partB) => {
  var nameA = partA.participantStatus.toUpperCase(); // ignore upper and lowercase
  var nameB = partB.participantStatus.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

export const sortByFirstName = (partA, partB) => {
  var nameA = partA.firstName.toUpperCase(); // ignore upper and lowercase
  var nameB = partB.firstName.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

export const sortByLastName = (partA, partB) => {
  var nameA = partA.lastName.toUpperCase(); // ignore upper and lowercase
  var nameB = partB.lastName.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}