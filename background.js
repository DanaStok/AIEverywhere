
 chrome.runtime.onInstalled.addListener(() => {
 //"Improve English" menu item 
  chrome.contextMenus.create({
      id: "improveEnglish",
      title: "Improve English",
      contexts: ["selection"]
  });
  // //"Improve English Creatively" menu item 
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
  // New menu item for multiple choice questions
  chrome.contextMenus.create({
    id: "generateMCQ",
    title: "Generate Multiple Choice Questions",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "improveEnglish" || info.menuItemId === "improveEnglishCreative" || info.menuItemId === "summarize") {
    const isCreative = (info.menuItemId === "improveEnglishCreative");
    const toSummarize = (info.menuItemId === "summarize");
    changeText(info.selectionText, tab.id, isCreative, toSummarize);
  } else if (info.menuItemId === "generateMCQ") {
    generateMCQ(info.selectionText, tab.id);
  }
});

function handleResponse(tabId, responseText, isCreative, toSummarize, isQuestions) {
  let title = 'Text Improvement'; // Default title

  if (toSummarize) {
    title = 'Summary';
  } else if (isCreative) {
    title = 'Text Improved Creatively';
  } else if (isQuestions) {
    title = 'Multiple Choice Questions';
  }

  // Create a small popup window to display the response text with the dynamic title
  chrome.windows.create({
      url: "data:text/html," + encodeURIComponent('<!DOCTYPE html><html><head><title>' + title + '</title></head><body><p>' + responseText + '</p></body></html>'),
      type: 'popup',
      width: 500,
      height: 300
  });
}  


function changeText(text, tabId, isCreative, toSummarize) {
  let promptText = toSummarize ?
    `Summarize the text into a single paragraph:\n${text}` :
    (isCreative ?
        `Improve the following English text creatively with a high temperature setting so the output will be much more creative or even crazy:\n${text}` :
        `Improve the following English text to sound like it was written by an English teacher:\n${text}`);
  
  console.log("Sending request to improve text:", text); 
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
          max_tokens: 150
      })
  })
  .then(response => {
    console.log("Received response:", response); // Log fetch response
    return response.json();
  })
  .then(data => {
    console.log("Data processed:", data); // Log processed data
    if (data.choices && data.choices.length > 0) {
        console.log("message content:", data.choices[0].message.content);
        handleResponse(tabId, data.choices[0].message.content, isCreative, toSummarize);
    }
  })
  .catch(error => {
    console.error('Error with fetch operation:', error);
    handleResponse(tabId, `Error: ${error.message}`);
  });
}

function generateMCQ(text, tabId) {
  // Create a prompt to request multiple choice questions from the API
  let promptText = `Generate 10 multiple choice questions with four choices each about the following text. Ensure each question includes exactly four choices and mark the correct answer with a '#' character before it:\n${text}`;
  
  console.log("Sending request to generate MCQ:", text); 
  fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-proj-J7sXcS7k7lrtDdVKOchHT3BlbkFJO0K5XWRMHys8X71pqela' // Add your OpenAI API token here
      },
      body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
              role: "user",
              content: promptText
          }],
          max_tokens: 1024 // Adjust token count as necessary
      })
  })

  .then(response => {
    console.log("Received response:", response); // Log fetch response
    return response.json();
  })
  .then(data => {
    console.log("Data processed:", data); // Log processed data
    if (data.choices && data.choices.length > 0) {
        displayMCQ(tabId, data.choices[0].message.content);
    }
  })
  .catch(error => {
    console.error('Error with fetch operation:', error);
    handleResponse(tabId, `Error: ${error.message}`, false, false);
  });
}

function displayMCQ(tabId, mcqText) {
  let htmlContent = mcqText.split('\n').map((item, index) => {
    // Check if the item contains '#'
    if (item.includes('#')) {
      // Bold the item, color it green, and remove all instances of '#'
      let cleanedItem = item.replace(/#/g, ''); // Remove all '#' characters
      return `<div><strong style="color: green;">${cleanedItem}</strong></div>`;
    } else {
      // Non-modified items
      return `<div>${item}</div>`;
    }
  }).join('');

  // Create a popup window to display the MCQs
  handleResponse(tabId, htmlContent, false, false, true);
}

