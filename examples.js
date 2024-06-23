
const codeExamples = [
    "function greet(name) {\n  console.log('Hello, ' + name + '!');\n}",
    "const sum = (a, b) => a + b;",
    "let count = 0;\nfor (let i = 0; i < 10; i++) {\n  count += i;\n}",
    "class Person {\n  constructor(name, age) {\n    this.name = name;\n    this.age = age;\n  }\n\n  greet() {\n    console.log(`Hello, my name is ${this.name}`);\n  }\n}",
];

const codeWithComments = [
    "// Function declaration\nfunction greet(name) {\n  // Print a greeting with the name\n  console.log('Hello, ' + name + '!');\n}",
    "// Arrow function expression\nconst sum = (a, b) => a + b; // Returns the sum of a and b",
    "// Variable declaration\nlet count = 0;\n\n// For loop\nfor (let i = 0; i < 10; i++) {\n  // Add the current value of i to count\n  count += i;\n}",
    "// Class definition\nclass Person {\n  // Constructor method\n  constructor(name, age) {\n    // Assign properties\n    this.name = name;\n    this.age = age;\n  }\n\n  // Instance method\n  greet() {\n    // Print a greeting with the person's name\n    console.log(`Hello, my name is ${this.name}`);\n  }\n}",
];

const questionExample = ["1. What is another name for the region where Israel is located historically?:\na) Mesopotamia\nb) Canaan#\nc) Persia\nd) Egypt"];

export { codeExamples, codeWithComments, questionExample };
