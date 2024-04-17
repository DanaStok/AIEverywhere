
 chrome.runtime.onInstalled.addListener(() => {
 //"Improve English" menu item 
  chrome.contextMenus.create({
      id: "improveEnglish",
      title: "Improve English",
      contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "improveEnglish") {
      improveEnglish(info.selectionText, tab.id);
  }
});

function handleResponse(tabId, responseText) {
  // Create a small popup window to display the response text
  chrome.windows.create({
      url: "data:text/html," + encodeURIComponent('<!DOCTYPE html><html><head><title>Text Improvement</title></head><body><p>' + responseText + '</p></body></html>'),
      type: 'popup',
      width: 500,
      height: 300
  });
}

function improveEnglish(text, tabId) {
  console.log("Sending request to improve text:", text); // Log text being sent
  fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-proj-J7sXcS7k7lrtDdVKOchHT3BlbkFJO0K5XWRMHys8X71pqela'  // Replace YOUR_API_KEY_HERE with your actual API key
      },
      body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
              role: "user",
              content: `Improve the following English text to sound like it was written by an English teacher:\n\n${text}`
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
        handleResponse(tabId, data.choices[0].message.content);
    }
  })
  .catch(error => {
    console.error('Error with fetch operation:', error);
    handleResponse(tabId, `Error: ${error.message}`);
  });
}