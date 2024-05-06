
 chrome.runtime.onInstalled.addListener(() => {
  //"Improve English" menu item 
  chrome.contextMenus.create({
      id: "improveEnglish",
      title: "Improve English",
      contexts: ["selection"]
  });
  //"Improve English Creatively" menu item 
  chrome.contextMenus.create({
    id: "improveEnglishCreative",
    title: "Improve English Creatively",
    contexts: ["selection"]
  });
   //"Summarize" menu item 
  chrome.contextMenus.create({
    id: "summarize",
    title: "Summarize",
    contexts: ["selection"]
  });
  //"Multiple Choice Questions" menu item
  chrome.contextMenus.create({
    id: "generateMCQ",
    title: "Generate Multiple Choice Questions",
    contexts: ["selection"]
  });
  //"Add Comments to Code" menu item
  chrome.contextMenus.create({
    id: "addCommentsCode",
    title: "Add comments to code",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  fetchImprovement(info.selectionText, info.menuItemId);
});

function handleResponse(responseText, menuItemId) {
  let title;

  switch(menuItemId){
    case("summarize"):
      title = 'Summary';
      break;
    case("improveEnglishCreative"):
      title = 'Text Improved Creatively';
      break;
    case("generateMCQ"):
      title = 'Multiple Choice Questions';
      break;
    case("addCommentsCode"):
      title = 'Code with Comments Added';
      break;
    default:
      title = 'Text Improvement'; 
  }
  
  // Create a small popup window to display the response text with the appropriate title
  chrome.windows.create({
      url: "data:text/html," + encodeURIComponent('<!DOCTYPE html><html><head><title>' + title + '</title></head><body><p>' + responseText + '</p></body></html>'),
      type: 'popup',
      width: 500,
      height: 300
  });
}  

//Interacts with openAI and returns the desired text 
function fetchImprovement(text, menuItemId) {
  let promptText;
  switch (menuItemId) {
    case "summarize":
      promptText = `Summarize the text into a single paragraph:\n${text}`;
      break;
    case "improveEnglishCreative":
      promptText =`Improve the following English text creatively with a high temperature setting so the output will be much more creative or even crazy:\n${text}`;
      break;
    case "generateMCQ":
      promptText = `Generate 10 multiple choice questions with four choices each about the following text.\n
      Ensure each question includes exactly four choices and mark the correct answer with a '#'.\n
      A question should look like this:\n${questionExample[0]}.\n
      Do this on the following text:\n${text}`;
      break;
    case "addCommentsCode":
      promptText = `Take the folowing text and determine if it is code.
      We know it is code if it has elements that look like the following:\n${codeExample[0]}.
      Notice that if it is code I want you to give me the same code but with comments (Do not tell me what language it is written in).\n
      An example of code with comments looks like this:\n${codeExample[1]}. 
      If it is not code, tell me it is not code.\n
      This is the text to evaluate:\n${text}`;
      break;

    default:
      promptText = `Improve the following English text to sound like it was written by an English teacher:\n${text}`;
  }

  fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-proj-J7sXcS7k7lrtDdVKOchHT3BlbkFJO0K5XWRMHys8X71pqela' 
      },
      body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
              role: "user",
              content: promptText
             
          }],
          max_tokens: 1024
      })
  })
  .then(response => response.json())
  .then(data => {
    if (data.choices && data.choices.length > 0) {
      if(menuItemId === "improveEnglishCreative" || menuItemId === "improveEnglish" || menuItemId === "summarize"){
        handleResponse(data.choices[0].message.content, menuItemId);
      } else if (menuItemId === "generateMCQ"){
        displayMCQ(data.choices[0].message.content, menuItemId);
      } else if (menuItemId === "addCommentsCode"){
        displayCodeComments(data.choices[0].message.content, menuItemId);
      }
    }
  })
  .catch(error => {
    console.error('Error with fetch operation:', error);
    handleResponse(`Error: ${error.message}`, menuItemId);
  });
}

//Format of the code comments
function displayCodeComments(text, menuItemId) {
  let htmlContent = '<pre><code>';
  htmlContent += text.split('\n').map(line => line.replace(/</g, '&lt;').replace(/>/g, '&gt;')).join('\n');
  htmlContent += '</code></pre>';
  handleResponse(htmlContent, menuItemId);
}

//Format of the multiple choice questions
function displayMCQ(mcqText, menuItemId) {
  let htmlContent = '';
  const mcqItems = mcqText.split('\n');
  let currentQuestion = '';
  let questionIndex = 0; // Index to uniquely identify each set of answers

  for (let i = 0; i < mcqItems.length; i++) {
    const item = mcqItems[i];

    if (item.match(/^\d+\./)) { // Match numbers followed by a dot to identify questions
      // Update the current question
      currentQuestion = item;
      questionIndex++; // Increment the question index for each new question

      htmlContent += `<div><span class="question-text">${currentQuestion}</span></div>`;
    } else if (item.trim() !== '') { // Avoid empty items being processed as answers
      // Parse the answer text and its correctness
      const isCorrectAnswer = item.includes('#');
      const answerText = isCorrectAnswer ? item.replace(/#/g, '') : item;

      htmlContent += `
        <div>
          <label>
            <input type="radio" class="answer-btn" name="question-${questionIndex}" data-correct="${isCorrectAnswer}" data-question="${questionIndex}" onclick="checkAnswer(this)">
            ${answerText}
          </label>
        </div>
      `;
    }
  }

  // Add the event listener function to handle answer checking
  htmlContent += `
  <script>
    function checkAnswer(btn) {
      const isCorrect = btn.dataset.correct === 'true';
      const question = btn.dataset.question;
    
      // Disable all radio buttons for this question
      const answerBtns = Array.from(document.querySelectorAll('.answer-btn')).filter(btn => btn.dataset.question === question);
      answerBtns.forEach(btn => btn.disabled = true);
    
      // Highlight the answer based on correctness
      const answerLabel = btn.parentNode; // Get the label element surrounding the radio button
      if (isCorrect) {
        answerLabel.style.color = 'green';
      } else {
        answerLabel.style.color = 'red';
        
        // Find the correct answer button and highlight it
        const correctBtn = answerBtns.find(btn => btn.dataset.correct === 'true');
        if (correctBtn) {
          correctBtn.parentNode.style.color = 'green'; // Ensure this is inside the 'if' block
        }
      }
    }    
  </script>
  `;

  // Create a popup window to display the MCQs
  handleResponse(htmlContent, menuItemId);
}

//Examples used to check if text is code
function codeExample() {
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

  return [codeExamples, codeWithComments];
} 
//Example of multiple choice question desired format 
function questionExample(){
    const qExample = ["1. What is another name for the region where Israel is located historically?:\na) Mesopotamia\nb) Canaan#\nc) Persia\nd) Egypt"]
    return [qExample];
}