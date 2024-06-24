 import { fetchImprovement } from './fetchImprovement.js'

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
