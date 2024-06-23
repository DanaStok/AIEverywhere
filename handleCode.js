//Format of the code comments
export function handleCodeComments(text, menuItemId) {
    let htmlContent = '<pre><code>';
    htmlContent += text.split('\n').map(line => line.replace(/</g, '&lt;').replace(/>/g, '&gt;')).join('\n');
    htmlContent += '</code></pre>';
    console.log(htmlContent);

    return {
        htmlContent: htmlContent,
        menuItemId: menuItemId
    };
    
  }
  