/*
 * Insert members of an array into array at specified position
 */

function insertIntoArray(arr, pos, el) {
    for (let i = 0; i < el.length; ++i) arr.splice(pos + i, 0, el[i]);
  }
  