// Title Animation
document.addEventListener('DOMContentLoaded', () => {
    const letters = document.querySelectorAll('.letter');
    
    // Add staggered delays to the animations
    letters.forEach((letter, index) => {
        const delay = index * 0.1;
        letter.style.animationDelay = `${delay}s`;
    });

    // Initial animation
    letters.forEach((letter, index) => {
        letter.style.animation = `titleIntro 0.5s ease ${index * 0.1}s forwards`;
        letter.style.opacity = '0';
        
        // After intro animation, start the continuous animations
        setTimeout(() => {
            const wordIndex = letter.parentElement.dataset.wordIndex;
            const isSpecial = (wordIndex === '0' && index % 2 === 1) || 
                            (wordIndex === '1' && index % 2 === 0) || 
                            (wordIndex === '2' && index % 3 === 0);
            
            if (isSpecial) {
                letter.style.animation = `floatAnimation 3s ease-in-out infinite ${index * 0.1}s, 
                                        glowAnimation 4s ease-in-out infinite ${index * 0.1}s`;
            } else {
                letter.style.animation = `floatAnimation 3s ease-in-out infinite ${index * 0.1}s`;
            }
        }, 500 + (index * 100));
    });

    // Add wave animation on title hover
    const words = document.querySelectorAll('.word');
    words.forEach(word => {
        word.addEventListener('mouseover', () => {
            const letters = word.querySelectorAll('.letter');
            letters.forEach((letter, index) => {
                letter.style.animation = `letterWave 0.5s ease ${index * 0.1}s`;
            });
        });

        word.addEventListener('mouseout', () => {
            const letters = word.querySelectorAll('.letter');
            letters.forEach(letter => {
                letter.style.animation = '';
            });
        });
    });

    // Add click effect
    letters.forEach(letter => {
        letter.addEventListener('click', () => {
            letter.style.animation = '';
            void letter.offsetWidth; // Trigger reflow
            letter.style.animation = 'letterGlow 1s ease';
        });
    });
});

// Game state
const state = {
    playerScore: 0,
    computerScore: 0,
    choices: ['rock', 'paper', 'scissors'],
    currentFocusIndex: 0
};

// DOM Elements
const playerScoreElement = document.getElementById('playerScore');
const computerScoreElement = document.getElementById('computerScore');
const resultMessage = document.getElementById('resultMessage');
const choices = document.querySelectorAll('.choice');
const resetButton = document.getElementById('resetButton');
const playerChoiceIcon = document.getElementById('playerChoice');
const computerChoiceIcon = document.getElementById('computerChoice');

// Game rules
const rules = {
    rock: { beats: 'scissors', icon: 'fa-hand-rock' },
    paper: { beats: 'rock', icon: 'fa-hand-paper' },
    scissors: { beats: 'paper', icon: 'fa-hand-scissors' }
};

// Initialize keyboard navigation
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                state.currentFocusIndex = (state.currentFocusIndex - 1 + choices.length) % choices.length;
                choices[state.currentFocusIndex].focus();
                break;
            case 'ArrowRight':
                state.currentFocusIndex = (state.currentFocusIndex + 1) % choices.length;
                choices[state.currentFocusIndex].focus();
                break;
            case 'Enter':
            case ' ':
                if (document.activeElement.classList.contains('choice')) {
                    document.activeElement.click();
                }
                break;
        }
    });
}

// Animate score change
function animateScore(element, oldScore, newScore) {
    const duration = 1000;
    const frames = 60;
    const step = (newScore - oldScore) / frames;
    let current = oldScore;
    let frame = 0;

    const animate = () => {
        current += step;
        element.textContent = Math.round(current);
        frame++;

        if (frame < frames) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = newScore;
        }
    };

    requestAnimationFrame(animate);
}

// Update move display
function updateMoveDisplay(playerChoice, computerChoice) {
    // Remove all existing classes except fa-question
    playerChoiceIcon.className = 'fas';
    computerChoiceIcon.className = 'fas';

    // Add new icons with animation
    setTimeout(() => {
        playerChoiceIcon.classList.add(rules[playerChoice].icon);
        computerChoiceIcon.classList.add(rules[computerChoice].icon);
        
        playerChoiceIcon.classList.add('bounce');
        computerChoiceIcon.classList.add('bounce');
    }, 100);
}

// Remove animation classes
function removeAnimationClasses() {
    playerChoiceIcon.classList.remove('bounce', 'winner', 'loser', 'tie');
    computerChoiceIcon.classList.remove('bounce', 'winner', 'loser', 'tie');
    resultMessage.classList.remove('bounce');
}

// Determine winner and update UI
function determineWinner(playerChoice, computerChoice) {
    removeAnimationClasses();

    if (playerChoice === computerChoice) {
        resultMessage.textContent = "It's a tie!";
        playerChoiceIcon.classList.add('tie');
        computerChoiceIcon.classList.add('tie');
        return 'tie';
    }

    if (rules[playerChoice].beats === computerChoice) {
        resultMessage.textContent = 'You win!';
        playerChoiceIcon.classList.add('winner');
        computerChoiceIcon.classList.add('loser');
        return 'player';
    } else {
        resultMessage.textContent = 'Computer wins!';
        playerChoiceIcon.classList.add('loser');
        computerChoiceIcon.classList.add('winner');
        return 'computer';
    }
}

// Handle player choice
function handleChoice(playerChoice) {
    const computerChoice = state.choices[Math.floor(Math.random() * state.choices.length)];
    
    // Update move display
    updateMoveDisplay(playerChoice, computerChoice);

    // Determine winner and update scores
    const winner = determineWinner(playerChoice, computerChoice);
    
    if (winner === 'player') {
        animateScore(playerScoreElement, state.playerScore, state.playerScore + 1);
        state.playerScore++;
    } else if (winner === 'computer') {
        animateScore(computerScoreElement, state.computerScore, state.computerScore + 1);
        state.computerScore++;
    }

    // Animate result message
    resultMessage.classList.add('bounce');
}

// Reset game
function resetGame() {
    if (confirm('Are you sure you want to reset the game?')) {
        state.playerScore = 0;
        state.computerScore = 0;
        playerScoreElement.textContent = '0';
        computerScoreElement.textContent = '0';
        resultMessage.textContent = 'Choose your move!';
        
        // Reset move displays
        playerChoiceIcon.className = 'fas fa-question';
        computerChoiceIcon.className = 'fas fa-question';
        
        removeAnimationClasses();
    }
}

// Event listeners
choices.forEach(choice => {
    choice.addEventListener('click', (e) => {
        const playerChoice = e.currentTarget.dataset.choice;
        handleChoice(playerChoice);
    });
});

resetButton.addEventListener('click', resetGame);

// Initialize keyboard navigation
initKeyboardNav();

// Remove animation classes after they complete
playerChoiceIcon.addEventListener('animationend', () => {
    playerChoiceIcon.classList.remove('bounce');
});

computerChoiceIcon.addEventListener('animationend', () => {
    computerChoiceIcon.classList.remove('bounce');
});

resultMessage.addEventListener('animationend', () => {
    resultMessage.classList.remove('bounce');
}); 