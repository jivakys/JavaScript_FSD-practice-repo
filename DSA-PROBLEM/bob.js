// Bob Jones lives with his family. His family has N members with member IDs 0 to N-1. Bob Jones is the head of the family with member ID 0. His family has K number of earning members. Every month, each earning member receives their salary in a particular order and then gives it to their parent; the parent in turn gives the salary to their parents, and so
// Bob Jones lives with his family. His family has N members with member IDs
// 0 to N-1. Bob Jones is the head of the family with member ID 0. His family has K number of earning members. Every month, each earning member receives their salary in a particular order and then gives it to their parent; the parent in turn gives the salary to their parents, and so on.
// The salary will be given to the highest member of the family hierarchy. If member A is the parent of member B and if A has already received the salary, then B will keep the salary.
// For example, in the given family hierarchy A > B > C. B is the parent of A and C is the parent of B,
// so if A receives the salary, then it first goes to B, and then it goes to C but in case if C already had received the salary then B will keep the salary of A and if in case B also received the salary already then, A will keep the salary.
// You are given two integers, N and K, where N is the total number of members in the family, and K is the total number of earning members in the family. You are given an array parents representing the parent's member ID,where the index represents the child's member ID.
//  As Bob Jones is the head of the family, he will have no parent that will be represented by -1,
//  and therefore, the parent array will always start with -1. You are given an array salary_order representing the member IDs of all the earning members of the family in the order they receive the salary that is index 0 receives the salary first and then index 1
//  and so on. Return an array containing the member ID of all members that keep the salary in the order they receive it.
// Function description
// Complete the Solve() function. This function takes the following 4 arguments and returns the answer:
// •N:Represents the total number of family members
// •K: Represents the total number of earning members
// •parents[]: Represents the array of parents that is parents[represent the parent of anth member
// •salary_order. Represents all the earning members of the tech in the order they receive the salary
// Input format for custom testing
// Note: Use this input format if you are testing against custom input or writing code in a language where we don't provide boilerplate code.
// •The first line contains integer N, denoting the total number of family members.
// •The second line contains integer K, denoting the total number of earning members.
// •The third line contains N space-separated integers denoting ine array of parents of each member.
// •The fourth line contains K space-separated integers denotin the array of earning members of the family in the order receive the salary.
// Output format
// Print the array of all the members that keep the salary in the order they receive it
// .
// Constraints
// 1<=N<=1051<=k<=105
// Sample input ->
// 9
// 4
// -1 0 1 1 2 2 3 4 4
// 8 4 6 5
// Sample output
// 0 1 3 2

// SOLUTION
function Solve(N, K, parents, salaryOrder) {
  const receivedSalary = new Array(N).fill(false);

  // Function to check if a member has received the salary
  const hasReceivedSalary = (member) => {
    return receivedSalary[member];
  };

  // Function to mark a member as received salary
  const markReceivedSalary = (member) => {
    receivedSalary[member] = true;
  };

  const result = [];

  // Iterate through the salary order
  for (let i = 0; i < K; i++) {
    const currentMember = salaryOrder[i];

    // Mark the current member as received salary
    markReceivedSalary(currentMember);
    result.push(currentMember);

    // Check the parent hierarchy and distribute the salary
    let parent = parents[currentMember];
    while (parent !== -1 && !hasReceivedSalary(parent)) {
      markReceivedSalary(parent);
      result.push(parent);
      parent = parents[parent];
    }
  }

  return result;
}

// Example usage:
const N = 9;
const K = 4;
const parents = [-1, 0, 1, 1, 2, 2, 3, 4, 4];
const salaryOrder = [8, 4, 6, 5];

const result = Solve(N, K, parents, salaryOrder);
console.log(result.join("\n"));
