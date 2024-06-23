//Format of the multiple choice questions
export function handleMCQ(mcqText, menuItemId) {
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
    return {
        htmlContent: htmlContent,
        menuItemId: menuItemId
    };
  }
