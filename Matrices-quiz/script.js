document.addEventListener('DOMContentLoaded', function() {
    // Quiz questions data
    const quizQuestions = [
        {
            question: "What is the result of multiplying matrix A = \(\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}\) by matrix B = \(\\begin{bmatrix} 2 & 0 \\\\ 1 & 2 \\end{bmatrix}\)?",
            options: [
                "\(\\begin{bmatrix} 4 & 4 \\\\ 10 & 8 \\end{bmatrix}\)",
                "\(\\begin{bmatrix} 2 & 0 \\\\ 3 & 8 \\end{bmatrix}\)",
                "\(\\begin{bmatrix} 2 & 4 \\\\ 4 & 8 \\end{bmatrix}\)",
                "\(\\begin{bmatrix} 5 & 6 \\\\ 7 & 8 \\end{bmatrix}\)"
            ],
            correctIndex: 0,
            explanation: "The correct answer is obtained by multiplying rows of A with columns of B: (1*2 + 2*1, 1*0 + 2*2, 3*2 + 4*1, 3*0 + 4*2)."
        },
        {
            question: "If matrix C is 2×3 and matrix D is 3×4, what are the dimensions of their product CD?",
            options: [
                "2×4",
                "3×3",
                "2×3",
                "Multiplication is not possible"
            ],
            correctIndex: 0,
            explanation: "When multiplying an m×n matrix by an n×p matrix, the result is an m×p matrix."
        },
        {
            question: "Which of the following properties does matrix multiplication have?",
            options: [
                "Commutative (AB = BA for all A, B)",
                "Associative (A(BC) = (AB)C)",
                "Distributive over addition (A(B+C) = AB + AC)",
                "Both B and C"
            ],
            correctIndex: 3,
            explanation: "Matrix multiplication is associative and distributive over addition, but not commutative in general."
        },
        {
            question: "What is the result of \(\\begin{bmatrix} 1 & 0 & 2 \\\\ -1 & 3 & 1 \\end{bmatrix}\) \(\\begin{bmatrix} 3 & 1 \\\\ 2 & 1 \\\\ 1 & 0 \\end{bmatrix}\)?",
            options: [
                "\(\\begin{bmatrix} 5 & 1 \\\\ 4 & 2 \\end{bmatrix}\)",
                "\(\\begin{bmatrix} 3 & 1 \\\\ -3 & 3 \\end{bmatrix}\)",
                "\(\\begin{bmatrix} 6 & 1 \\\\ 4 & 2 \\end{bmatrix}\)",
                "\(\\begin{bmatrix} 3 & 2 \\\\ -1 & 4 \\end{bmatrix}\)"
            ],
            correctIndex: 0,
            explanation: "Multiply each row of the first matrix by each column of the second matrix."
        },
        {
            question: "If E is the identity matrix and A is any square matrix of the same size, what is EA?",
            options: [
                "A",
                "E",
                "The zero matrix",
                "Undefined"
            ],
            correctIndex: 0,
            explanation: "Multiplying any matrix by the identity matrix returns the original matrix."
        }
    ];

    // Render the quiz questions
    const quizContainer = document.getElementById('quiz-container');
    
    quizQuestions.forEach((question, qIndex) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question bg-gray-50 p-6 rounded-lg';
        questionElement.innerHTML = `
            <h2 class="text-xl font-semibold mb-4">Question ${qIndex + 1}:</h2>
            <div class="question-text mb-4 text-lg">${question.question}</div>
            <div class="options space-y-3">
                ${question.options.map((option, oIndex) => `
                    <div class="option flex items-center">
                        <input type="radio" id="q${qIndex}-o${oIndex}" name="q${qIndex}" value="${oIndex}" class="mr-3 h-5 w-5">
                        <label for="q${qIndex}-o${oIndex}" class="text-lg">${option}</label>
                    </div>
                `).join('')}
            </div>
        `;
        quizContainer.appendChild(questionElement);
    });

    // Handle quiz submission
    document.getElementById('submit-btn').addEventListener('click', function() {
        let score = 0;
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '<h2 class="text-2xl font-bold mb-4">Quiz Results</h2>';
        resultsContainer.classList.remove('hidden');
        
        quizQuestions.forEach((question, qIndex) => {
            const selectedOption = document.querySelector(`input[name="q${qIndex}"]:checked`);
            const isCorrect = selectedOption && parseInt(selectedOption.value) === question.correctIndex;
            
            if (isCorrect) score++;
            
            const resultElement = document.createElement('div');
            resultElement.className = `mb-6 p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`;
            resultElement.innerHTML = `
                <h3 class="font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}">
                    Question ${qIndex + 1}: ${isCorrect ? 'Correct!' : 'Incorrect'}
                </h3>
                ${!isCorrect ? `
                    <div class="mt-2">
                        <p class="font-medium">Correct answer:</p>
                        <p class="ml-4">${question.options[question.correctIndex]}</p>
                        <p class="mt-2 text-sm">${question.explanation}</p>
                    </div>
                ` : ''}
            `;
            resultsContainer.appendChild(resultElement);
        });
        
        const scoreElement = document.createElement('div');
        scoreElement.className = 'text-center mt-6 p-4 bg-blue-100 rounded-lg';
        scoreElement.innerHTML = `
            <p class="text-xl font-bold">Your score: ${score} out of ${quizQuestions.length}</p>
            <p class="mt-2">${score === quizQuestions.length ? 'Perfect! You got all questions right!' : 
                             score >= quizQuestions.length/2 ? 'Good job! Keep practicing!' : 
                             'Keep studying matrix multiplication!'}</p>
        `;
        resultsContainer.appendChild(scoreElement);
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    });
});