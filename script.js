// Track learned items
let learnedItems = new Set();
let currentQuizIndex = 0;
let quizScore = 0;
let totalQuizQuestions = 0;

// Quiz questions
const quizQuestions = [
    {
        question: "What is the Korean word for 'school' (学校/学校)?",
        options: ["학교 (hak-gyo)", "도서관 (do-seo-gwan)", "전화 (jeon-hwa)", "시간 (si-gan)"],
        correct: 0,
        explanation: "학교 comes from Chinese 學校, same as Japanese 学校 (gakkō)"
    },
    {
        question: "Which particle is equivalent to Japanese は (wa)?",
        options: ["을/를", "은/는", "이/가", "의"],
        correct: 1,
        explanation: "은/는 (eun/neun) is the topic marker, same function as は in Japanese"
    },
    {
        question: "What is the word order in Korean?",
        options: ["SVO (like Chinese)", "SOV (like Japanese)", "VSO", "VOS"],
        correct: 1,
        explanation: "Korean uses SOV order, same as Japanese: Subject + Object + Verb"
    },
    {
        question: "How do you say 'Thank you' in Korean?",
        options: ["안녕하세요", "감사합니다", "미안합니다", "사랑해요"],
        correct: 1,
        explanation: "감사합니다 (gam-sa-ham-ni-da) means 'thank you'"
    },
    {
        question: "What does 전화 (jeon-hwa) mean?",
        options: ["Time", "Music", "Telephone", "Family"],
        correct: 2,
        explanation: "전화 (電話) means telephone, same characters as Chinese 电话 and Japanese 電話"
    },
    {
        question: "Which is the object marker particle?",
        options: ["은/는", "이/가", "을/를", "의"],
        correct: 2,
        explanation: "을/를 marks the object, similar to を in Japanese"
    },
    {
        question: "What percentage of Korean vocabulary comes from Chinese?",
        options: ["30%", "60%", "90%", "10%"],
        correct: 1,
        explanation: "About 60% of Korean vocabulary is Sino-Korean (한자어)"
    },
    {
        question: "What is 'water' in Korean?",
        options: ["밥", "물", "사랑", "시간"],
        correct: 1,
        explanation: "물 (mul) means water (水 in Chinese, 水/mizu in Japanese)"
    },
    {
        question: "Which politeness level is most common in daily conversation?",
        options: ["합니다체 (formal)", "해요체 (informal polite)", "반말 (casual)", "None"],
        correct: 1,
        explanation: "해요체 (haeyo-che) is the informal polite form, most used in daily life"
    },
    {
        question: "What is the possessive particle in Korean?",
        options: ["은/는", "이/가", "을/를", "의"],
        correct: 3,
        explanation: "의 (ui) is possessive, same as の in Japanese and 的 in Chinese"
    },
    {
        question: "What does 가족 mean?",
        options: ["School", "Family", "Music", "Time"],
        correct: 1,
        explanation: "가족 (家族) means family, same as Japanese 家族 (kazoku) and Chinese 家族"
    },
    {
        question: "How do you say 'Hello' politely in Korean?",
        options: ["감사합니다", "안녕하세요", "미안합니다", "안녕"],
        correct: 1,
        explanation: "안녕하세요 (annyeonghaseyo) is the polite way to say hello"
    }
];

// Section navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Add active class to clicked tab
    event.target.classList.add('active');

    // Initialize quiz if quiz section is selected
    if (sectionId === 'quiz') {
        initQuiz();
    }

    updateProgress();
}

// Play sound (visual feedback for now)
function playSound(sound) {
    const card = event.currentTarget;
    card.style.transform = 'scale(1.1)';
    card.style.background = 'linear-gradient(135deg, #667eea30 0%, #764ba230 100%)';

    setTimeout(() => {
        card.style.transform = '';
        card.style.background = '';
    }, 300);
}

// Mark vocabulary as learned
function markLearned(card) {
    if (!card.classList.contains('learned')) {
        card.classList.add('learned');
        const koreanWord = card.querySelector('.korean-word').textContent;
        learnedItems.add(koreanWord);

        const btn = card.querySelector('.learn-btn');
        btn.textContent = '✓ Learned';

        // Celebration animation
        card.style.transform = 'scale(1.05)';
        setTimeout(() => {
            card.style.transform = '';
        }, 300);

        updateProgress();
    }
}

// Update progress bar
function updateProgress() {
    const totalVocabCards = document.querySelectorAll('.vocab-card').length;
    const totalItems = totalVocabCards + quizQuestions.length;
    const completedItems = learnedItems.size + (quizScore > 0 ? Math.floor(quizScore) : 0);

    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressPercent').textContent = percentage;
}

// Quiz functionality
function initQuiz() {
    currentQuizIndex = 0;
    totalQuizQuestions = 0;
    loadQuestion();
}

function loadQuestion() {
    if (currentQuizIndex >= quizQuestions.length) {
        showQuizResults();
        return;
    }

    const question = quizQuestions[currentQuizIndex];
    const questionEl = document.getElementById('quizQuestion');
    const optionsEl = document.getElementById('quizOptions');
    const feedbackEl = document.getElementById('quizFeedback');

    questionEl.textContent = question.question;
    feedbackEl.textContent = '';
    feedbackEl.className = 'quiz-feedback';

    optionsEl.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectAnswer(index);
        optionsEl.appendChild(optionDiv);
    });

    document.getElementById('nextQuizBtn').disabled = true;
    updateQuizScore();
}

function selectAnswer(selectedIndex) {
    const question = quizQuestions[currentQuizIndex];
    const options = document.querySelectorAll('.quiz-option');
    const feedbackEl = document.getElementById('quizFeedback');

    // Disable all options
    options.forEach(opt => {
        opt.classList.add('disabled');
        opt.onclick = null;
    });

    // Mark correct and incorrect
    options[question.correct].classList.add('correct');

    if (selectedIndex === question.correct) {
        feedbackEl.textContent = '✓ Correct! ' + question.explanation;
        feedbackEl.className = 'quiz-feedback correct';
        quizScore++;
    } else {
        options[selectedIndex].classList.add('incorrect');
        feedbackEl.textContent = '✗ Incorrect. ' + question.explanation;
        feedbackEl.className = 'quiz-feedback incorrect';
    }

    totalQuizQuestions++;
    document.getElementById('nextQuizBtn').disabled = false;
    updateQuizScore();
    updateProgress();
}

function nextQuestion() {
    currentQuizIndex++;
    loadQuestion();
}

function updateQuizScore() {
    document.getElementById('quizScore').textContent = quizScore;
    document.getElementById('quizTotal').textContent = totalQuizQuestions;
}

function showQuizResults() {
    const percentage = Math.round((quizScore / totalQuizQuestions) * 100);
    const questionEl = document.getElementById('quizQuestion');
    const optionsEl = document.getElementById('quizOptions');
    const feedbackEl = document.getElementById('quizFeedback');

    questionEl.innerHTML = `
        <div style="text-align: center;">
            <h3>Quiz Complete! 测验完成！</h3>
            <p style="font-size: 2rem; margin: 1rem 0;">Score: ${quizScore}/${totalQuizQuestions}</p>
            <p style="font-size: 1.5rem; color: ${percentage >= 80 ? '#4caf50' : percentage >= 60 ? '#ff9800' : '#f44336'};">
                ${percentage}%
            </p>
        </div>
    `;

    optionsEl.innerHTML = '';

    let message = '';
    if (percentage >= 80) {
        message = '🎉 Excellent! 太棒了！すごい！';
    } else if (percentage >= 60) {
        message = '👍 Good job! 不错！よくできました！';
    } else {
        message = '📚 Keep studying! 继续加油！頑張って！';
    }

    feedbackEl.textContent = message;
    feedbackEl.className = 'quiz-feedback';
    feedbackEl.style.background = '#f8f9ff';
    feedbackEl.style.color = '#667eea';
    feedbackEl.style.fontSize = '1.3rem';

    const nextBtn = document.getElementById('nextQuizBtn');
    nextBtn.textContent = 'Restart Quiz';
    nextBtn.disabled = false;
    nextBtn.onclick = () => {
        quizScore = 0;
        totalQuizQuestions = 0;
        nextBtn.textContent = 'Next Question';
        nextBtn.onclick = nextQuestion;
        initQuiz();
    };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();

    // Add some welcome animation
    const header = document.querySelector('header');
    header.style.opacity = '0';
    header.style.transform = 'translateY(-20px)';

    setTimeout(() => {
        header.style.transition = 'all 0.5s ease';
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 100);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Alt + 1-4 to switch tabs
    if (e.altKey) {
        const tabs = ['hangul', 'vocabulary', 'grammar', 'quiz'];
        const key = parseInt(e.key);
        if (key >= 1 && key <= 4) {
            const tabBtns = document.querySelectorAll('.tab-btn');
            if (tabBtns[key - 1]) {
                tabBtns[key - 1].click();
            }
        }
    }
});

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        const sections = ['hangul', 'vocabulary', 'grammar', 'quiz'];
        const currentSection = document.querySelector('.content-section.active').id;
        const currentIndex = sections.indexOf(currentSection);

        if (diff > 0 && currentIndex < sections.length - 1) {
            // Swipe left - next section
            document.querySelectorAll('.tab-btn')[currentIndex + 1].click();
        } else if (diff < 0 && currentIndex > 0) {
            // Swipe right - previous section
            document.querySelectorAll('.tab-btn')[currentIndex - 1].click();
        }
    }
}

// Console easter egg
console.log('%c한국어 배우기 🇰🇷', 'font-size: 24px; color: #667eea; font-weight: bold;');
console.log('%cWelcome to Korean Learning! 欢迎学习韩语！韓国語を学ぼう！', 'font-size: 14px; color: #764ba2;');
console.log('Keyboard shortcuts: Alt + 1-4 to switch tabs');
