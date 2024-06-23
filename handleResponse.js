//displays pop-up window of the results
export function handleResponse(responseText, menuItemId) {
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
  