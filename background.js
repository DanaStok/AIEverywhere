
 import { codeExamples, codeWithComments, questionExample } from './examples.js';
 import { handleMCQ } from './handleMCQ.js'
 import { handleCodeComments } from './handleCode.js'
 import { config } from './config.js'
 import { handleResponse } from './handleResponse.js'

 chrome.runtime.onInstalled.addListener(function() {
  // Store the API key in Chrome's secure storage
   chrome.storage.sync.set({ 'openAIKey': config.OPENAI_API_KEY }, function() {
      console.log('API Key is stored securely.');
  });
 });

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

//Interacts with openAI and returns the desired text 
function fetchImprovement(text, menuItemId) {
  chrome.storage.sync.get('openAIKey', function(result) {
    let openAIKey = result.openAIKey;
    if (!openAIKey) {
      console.error('API Key not found in storage');
      return;
    }

    let promptText;
    switch (menuItemId) {
      case "summarize":
        promptText = `Summarize the text into a single paragraph:\n${text}`;
        break;
      case "improveEnglishCreative":
        promptText = `Improve the following English text creatively with a high temperature setting so the output will be much more creative or even crazy:\n${text}`;
        break;
      case "generateMCQ":
        promptText = `Generate 10 multiple choice questions with four choices each about the following text.\n
        Ensure each question includes exactly four choices and mark the correct answer with a '#'.\n
        A question should look like this:\n${questionExample}.\n
        Do this on the following text:\n${text}`;
        break;
      case "addCommentsCode":
        promptText = `Take the following text and determine if it is code.
        We know it is code if it has elements that look like the following:\n${codeExamples}.
        Notice that if it is code I want you to give me the same code but with comments (Do not tell me what language it is written in).\n
        An example of code with comments looks like this:\n${codeWithComments}.
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
        'Authorization': 'Bearer ' + openAIKey
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
        let contentResult;
        if(menuItemId === "generateMCQ" || menuItemId === "addCommentsCode") {
          contentResult = (menuItemId === "generateMCQ" ? handleMCQ : handleCodeComments)(data.choices[0].message.content, menuItemId);
          handleResponse(contentResult.htmlContent, contentResult.menuItemId);
        } else {
          handleResponse(data.choices[0].message.content, menuItemId);
        }
      }
    })
    .catch(error => {
      console.error('Error with fetch operation:', error);
      handleResponse(`Error: ${error.message}`, menuItemId);
    });
  });
}
