const people = [
  {
    name: "bob",
    age: 23,
  },
  {
    name: "marle",
    age: 25,
  },
  {
    name: "jon",
    age: 30,
  },
  {
    name: "merry",
    age: 18,
  },
];

const sumOfage = people.reduce((total, p) => total + p.age, 0);
const avg = sumOfage / people.length;
console.log("average age is =", avg);
