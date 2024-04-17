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
      title = 'Text Improvement'; // Default title
  }
  

  // Create a small popup window to display the response text with the appropriate title
  chrome.windows.create({
      url: "data:text/html," + encodeURIComponent('<!DOCTYPE html><html><head><title>' + title + '</title></head><body><p>' + responseText + '</p></body></html>'),
      type: 'popup',
      width: 500,
      height: 300
  });
}  

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
      promptText = `Generate 10 multiple choice questions with four choices each about the following text. Ensure each question includes exactly four choices and mark the correct answer with a '#' character before it:\n${text}`;
      break;
    case "addCommentsCode":
      if (!isCode(text)) {
          handleResponse("This text does not appear to be code.", menuItemId);
          return;  
        }
      promptText = `Add comments to the following code and show it with the code. This is the code:\n${text}`;
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

function displayCodeComments(text, menuItemId){
  let htmlContent = text.split('\n').map(line => `<p>${line}</p>`).join('');
  handleResponse(htmlContent, menuItemId);
}

function displayMCQ(mcqText, menuItemId) {
  let htmlContent = mcqText.split('\n').map((item) => {
    // Check if the item contains '#' - indicating it is the correct answer 
    if (item.includes('#')) {
      let cleanedItem = item.replace(/#/g, ''); // Bold the item, color it green, and remove all instances of '#'
      return `<div><strong style="color: green;">${cleanedItem}</strong></div>`;
    } else {
      // Non-modified items
      return `<div>${item}</div>`;
    }
  }).join('');

  // Create a popup window to display the MCQs
  handleResponse(htmlContent, menuItemId);
}

function isCode(text) {
  // Simple pattern detection for common programming elements
  const patterns = [
      /function\s+\w+\s*\(/,  // Matches function declarations
      /const|let|var\s+\w+\s*=/,  // Matches variable declarations
      /\w+\s*\(\s*\)/,  // Matches function calls
      /\{|\}/,  // Matches braces
      /;/  // Matches semicolons
  ];
  return patterns.some(pattern => pattern.test(text));
}

