"use strict";

//// Make it possible to select a max per group instead of number of groups ////

// Random group generator
let people = [];
let numOfGroups = 0;
let maxPerGroup = 0;
let groups = [];
let fullGroups = [];
let assigned = [];

const groupsEl = document.querySelector(".groups");
const btnGenerate = document.querySelector(".generate--button");
const btnClear = document.querySelector(".clear--button");
const peopleText = document.querySelector(".people");
const numText = document.querySelector(".num");

// 1. Create a random number generator
// 2. Fill the groups arr with new arrays
// 3. Get a random person and do step 4
// 4. Sort a random person into a random group and making sure that no group has more than max

/* Random group */
// If full, add to new group but not the last one
// So keep track of the last one by adding to fullGroups arr
// Add to a new group and check if that is in fullGroups arr, if so redo process

// 1. Loop through the peopleArr array
// 2. Create a curPerson using the random num generator
// 3. Check if the curPerson already has a group (is in the assigned arr), if so then randomize the curPerson again until every person has a group
// 4. Assign the curPerson to a random group using the above method
// 5. Once a person has been assigned to a group then add them an assigned array

const randomInt = (max) => Math.trunc(Math.random() * max);

const createGroups = function (arr, num) {
  for (let i = 0; i < num; i++) {
    arr.push([]);
  }
};

const sortIntoGroup = function (peopleArr, groupsArr) {
  // console.log(peopleArr, groupsArr);

  // Random person
  peopleArr.forEach((el, i, arr) => {
    let curPerson = randomInt(people.length);
    // console.log(`---- Iteration ${people[curPerson]}-----`);

    // console.log("curPerson:", people[curPerson]);

    // for loop to iterate every group
    for (let i = 0; i < peopleArr.length; i++) {
      // console.log(`Trying ${people[curPerson]}`);

      // Checking if person is not assigned
      if (!assigned.includes(people[curPerson])) {
        // console.log(
        //   `${people[curPerson]} is not assigned; adding to assigned arr`
        // );

        // Adding to assigned arr+ if not assigned
        assigned.push(people[curPerson]);

        // Stops the whole loop because the person was not assigned
        break;
      } else if (!assigned.includes(people[i])) {
        // Will be called if person is assigned
        // console.log(`${people[i]} is assigned`);

        assigned.push(people[i]);
        break;
      }
    }

    // console.log("assigned arr:", assigned);
  });

  // Random group
  assigned.forEach((el, i, arr) => {
    /* CASES */
    // If curGroup != full, add
    // If curGroup = full, add to another and log it to fullGroups arr
    // If curGroup is a part of fullGroups give it a new number until it is not in fullgroups anymore

    // console.log(`----- ${i} -----`);

    let curGroup = randomInt(numOfGroups);
    // console.log("curGroup: ", curGroup);

    // Checks to see if curGroup is free
    if (groupsArr[curGroup].length < maxPerGroup) {
      // console.log("add");

      // Adds to it if so
      groupsArr[curGroup].push(el);
    } else if (groupsArr[curGroup].length === maxPerGroup) {
      // Checks to see if curGroup is full
      // console.log("full");

      // for loop to iterate every group
      for (let i = 0; i < groupsArr.length; i++) {
        // console.log(`Trying group ${i}`);

        // console.log(people[i]);

        // Checking if group is not full
        if (groups[i].length < maxPerGroup) {
          // console.log(`Group ${i} is not full; adding to it`);

          // console.log(el);
          // Adding to group if not full
          groups[i].push(el);

          // Stops the whole loop because it has found a free group
          break;
        } else {
          // Will be called if group is full
          // console.log(`Group ${i} is full`);

          // Checks if every group is full
          if (i === groupsArr.length - 1) {
            const randomGroup = randomInt(numOfGroups);
            // console.log(
            //   `Every group is full, increasing the max and adding to ${randomGroup}`
            // );

            maxPerGroup++;
            if (groups[randomGroup].length < maxPerGroup) {
              // console.log(`Random group ${i} is not full; adding to it`);

              // Adds to random group
              groups[randomGroup].push(el);

              break;
            }
          }
        } // End of "if full"
      } // End of for loop
    } // End of "if full"
  }); // End of assigned forEach loop
}; // End of function
// sortIntoGroup(people, groups);
// console.log('----- LOOP DONE -----');

// console.log(assigned);
// console.log(groups);

// Problem: When every group is full it will add to a random group. However if there are more than one person left when every group is full there is a chance that both of them are added to the same group.
// Fix: Increase the maxPerGroup variable when all the groups are full and redo the simulation

/* DOM PART */

// 1. Make inputs for the user to manually add people to be sorted and let them choose how many groups that should be made.
// 2. Store use values in their correct data form
// 3. Show the groups visually on the screen below the "Generate Groups" button.
// 4. Add a clear button and clear the field & add new groups if they generate again
// 5. Save the current groups in session storage so that they remain if you reload the page

const clearGroups = function (el) {
  // Clears the page
  let child = groupsEl.lastElementChild;
  while (child) {
    groupsEl.removeChild(child);
    child = groupsEl.lastElementChild;
  }

  // Clears the arrays to start over fresh
  assigned = [];
  groups = [];
};

btnGenerate.addEventListener("click", (ev) => {
  ev.preventDefault();
  // If there already is context on page: clear
  if (groupsEl.hasChildNodes) clearGroups();

  // Sets all the values based on the input
  people = peopleText.value.split(",");
  numOfGroups = Number(numText.value);
  maxPerGroup = Math.floor(people.length / numOfGroups);

  // Give same result if someone has seperated by ", " and not ","
  people.forEach((el) => {
    if (el[0] === " ") el.slice(1);
  });
  // console.log(people);

  // Creates the groups and does the sorting
  createGroups(groups, numOfGroups);
  sortIntoGroup(people, groups);

  // Making the groups visible on the web page
  groups.forEach((el, i, arr) => {
    // console.log(el);

    // Adding the first pieces of HTML
    groupsEl.insertAdjacentHTML(
      "beforeend",
      `<ul class="group--${i + 1}">
			<h4>Group ${i + 1}</h4>`
    );

    // Looping through every element in the array
    for (let i = 0; i < maxPerGroup; i++) {
      // console.log(i);
      // If the current element doesn't exist: exit
      if (!el[i]) break;

      const html = `
			<li>${el[i]}</li>
      `;

      // Adds the current person to the list
      groupsEl.insertAdjacentHTML("beforeend", html);
    }

    // Adding the last pieces of HTML
    groupsEl.insertAdjacentHTML("beforeend", `<ul>`);
  });
});

btnClear.addEventListener("click", (ev) => {
  ev.preventDefault();
  clearGroups(groupsEl);
});

// Albin,Viggo,Sebbe,Viktor,Olof,Niklas,Theo,Felix,Theodor,Emile,Aaron,Milton,Matilda,Rebecka,Maja,Märta,Melody,Sofia,Alva,Ebba,Othilia
