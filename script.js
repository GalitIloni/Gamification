// אתחול משתנים
let answers = {};
let results = {};

// פונקציה להצגת מסך
function showScreen(screenId) {
    console.log('Showing screen:', screenId);
    
    // הסתרת כל המסכים
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // הצגת המסך הנבחר
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        // גלילה לתחילת המסך
        targetScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        console.error('Screen not found:', screenId);
    }
}

// פונקציה לרישום תשובה
function registerAnswer(question, statement, value) {
    // שמירת התשובה
    const key = `q${question}_${statement}`;
    answers[key] = parseInt(value);
    
    console.log('Registered answer:', key, '=', value);
    
    // סימון הכפתור שנבחר
    const rating = document.querySelector(`.rating[data-question="${question}"][data-statement="${statement}"]`);
    if (rating) {
        const buttons = rating.querySelectorAll('.rating-btn');
        
        buttons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const selectedButton = rating.querySelector(`.rating-btn[data-value="${value}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }
    }
}

// פונקציה לחישוב התוצאות
function calculateResults() {
    let visualScore = 0;
    let auditoryScore = 0;
    let kinestheticScore = 0;
    let totalQuestions = 9;
    
    // סכימת הנקודות לכל סגנון
    for (let q = 1; q <= totalQuestions; q++) {
        // היגד 0 = חזותי, היגד 1 = שמיעתי, היגד 2 = תנועתי
        if (answers[`q${q}_0`]) visualScore += answers[`q${q}_0`];
        if (answers[`q${q}_1`]) auditoryScore += answers[`q${q}_1`];
        if (answers[`q${q}_2`]) kinestheticScore += answers[`q${q}_2`];
    }
    
    const totalScore = visualScore + auditoryScore + kinestheticScore;
    
    // חישוב אחוזים
    const visualPercent = totalScore > 0 ? (visualScore / totalScore) * 100 : 0;
    const auditoryPercent = totalScore > 0 ? (auditoryScore / totalScore) * 100 : 0;
    const kinestheticPercent = totalScore > 0 ? (kinestheticScore / totalScore) * 100 : 0;
    
    // קביעת הסגנון הדומיננטי
    let dominantStyle = 'visual';
    let maxScore = visualScore;
    
    if (auditoryScore > maxScore) {
        dominantStyle = 'auditory';
        maxScore = auditoryScore;
    }
    
    if (kinestheticScore > maxScore) {
        dominantStyle = 'kinesthetic';
    }
    
    // שם הסגנון בעברית
    const styleNames = {
        visual: 'חזותי (Visual)',
        auditory: 'שמיעתי (Auditory)',
        kinesthetic: 'תנועתי (Kinesthetic)'
    };
    
    return {
        visualScore,
        auditoryScore,
        kinestheticScore,
        visualPercent,
        auditoryPercent,
        kinestheticPercent,
        dominantStyle,
        dominantStyleName: styleNames[dominantStyle],
        totalScore
    };
}

// פונקציה להצגת התוצאות
function displayResults(results) {
    // הצגת אחוזים
    const visualPercentEl = document.getElementById('visual-percent');
    const auditoryPercentEl = document.getElementById('auditory-percent');
    const kinestheticPercentEl = document.getElementById('kinesthetic-percent');
    const dominantStyleEl = document.getElementById('dominant-style');
    
    if (visualPercentEl) visualPercentEl.textContent = `${Math.round(results.visualPercent)}%`;
    if (auditoryPercentEl) auditoryPercentEl.textContent = `${Math.round(results.auditoryPercent)}%`;
    if (kinestheticPercentEl) kinestheticPercentEl.textContent = `${Math.round(results.kinestheticPercent)}%`;
    if (dominantStyleEl) dominantStyleEl.textContent = results.dominantStyleName;
    
    // הצגת גרפים באנימציה
    setTimeout(() => {
        const visualBar = document.getElementById('visual-bar');
        const auditoryBar = document.getElementById('auditory-bar');
        const kinestheticBar = document.getElementById('kinesthetic-bar');
        
        if (visualBar) visualBar.style.width = `${results.visualPercent}%`;
        if (auditoryBar) auditoryBar.style.width = `${results.auditoryPercent}%`;
        if (kinestheticBar) kinestheticBar.style.width = `${results.kinestheticPercent}%`;
    }, 500);
    
    // הסתרת כל חלקי ההמלצות
    document.querySelectorAll('.recommendation-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // הצגת ההמלצות הרלוונטיות
    const recommendationSection = document.getElementById(`${results.dominantStyle}-recommendations`);
    if (recommendationSection) {
        recommendationSection.style.display = 'block';
    }
}

// פונקציה לבדיקה אם כל ההיגדים נענו בשאלה
function checkAllAnswered(questionNumber) {
    const statements = [0, 1, 2];
    return statements.every(statement => 
        answers[`q${questionNumber}_${statement}`] !== undefined
    );
}

// אתחול האירועים
function initializeEvents() {
    console.log('Initializing all events...');
    
    // כפתורי הדירוג
    document.querySelectorAll('.rating-btn').forEach(button => {
        button.addEventListener('click', function() {
            const rating = this.closest('.rating');
            const question = rating.getAttribute('data-question');
            const statement = rating.getAttribute('data-statement');
            const value = this.getAttribute('data-value');
            registerAnswer(question, statement, value);
        });
    });
    
    // כפתורי ניווט קדימה
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function() {
            const nextScreen = this.getAttribute('data-next');
            if (nextScreen) {
                const currentQuestion = parseInt(this.closest('.screen').id.split('-')[1]);
                if (checkAllAnswered(currentQuestion)) {
                    showScreen(nextScreen);
                } else {
                    alert('נא לענות על כל ההיגדים בשאלה זו לפני שתמשיך');
                }
            }
        });
    });
    
    // כפתורי ניווט אחורה
    document.querySelectorAll('.back-btn').forEach(button => {
        button.addEventListener('click', function() {
            const prevScreen = this.getAttribute('data-prev');
            if (prevScreen) {
                showScreen(prevScreen);
            }
        });
    });
    
    // כפתור סיום
    const finishBtn = document.getElementById('finish-btn');
    if (finishBtn) {
        finishBtn.addEventListener('click', function() {
            if (checkAllAnswered(9)) {
                // חישוב תוצאות
                results = calculateResults();
                // הצגת תוצאות
                displayResults(results);
                // מעבר למסך תוצאות
                showScreen('results-screen');
            } else {
                alert('נא לענות על כל ההיגדים בשאלה זו לפני שתמשיך');
            }
        });
    }
    
    // כפתור המלצות
    const recommendationsBtn = document.getElementById('recommendations-btn');
    if (recommendationsBtn) {
        recommendationsBtn.addEventListener('click', function() {
            showScreen('recommendations-screen');
        });
    }
    
    // כפתור חזרה לתוצאות
    const backToResultsBtn = document.getElementById('back-to-results-btn');
    if (backToResultsBtn) {
        backToResultsBtn.addEventListener('click', function() {
            showScreen('results-screen');
        });
    }
    
    // כפתורי התחלה מחדש
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetAssessment();
        });
    }
    
    const resetFromRecommendationsBtn = document.getElementById('reset-from-recommendations-btn');
    if (resetFromRecommendationsBtn) {
        resetFromRecommendationsBtn.addEventListener('click', function() {
            resetAssessment();
        });
    }
}

// פונקציה לאיפוס האבחון
function resetAssessment() {
    // איפוס התשובות
    answers = {};
    results = {};
    
    // איפוס בחירת הכפתורים
    document.querySelectorAll('.rating-btn').forEach(button => {
        button.classList.remove('active');
    });
    
    // איפוס גרפי התוצאות
    document.querySelectorAll('.result-bar').forEach(bar => {
        bar.style.width = '0%';
    });
    
    // חזרה למסך הראשון
    showScreen('intro-screen');
}

// הפעלת האירועים בטעינת הדף
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing events...');
    
    // כפתור התחלה - טיפול מיוחד
    const startBtn = document.getElementById('start-btn');
    console.log('Start button found:', startBtn);
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            console.log('Start button clicked!');
            showScreen('question-1-screen');
        });
    } else {
        console.error('Start button not found!');
    }
    
    // אתחול יתר האירועים
    initializeEvents();
    
    // הצגת המסך הראשון
    showScreen('intro-screen');
});

// פונקציות עזר לבדיקת שלמות האבחון
function getCompletionStatus() {
    const totalQuestions = 9;
    const totalStatements = totalQuestions * 3;
    const answeredStatements = Object.keys(answers).length;
    
    return {
        totalStatements,
        answeredStatements,
        completionPercentage: (answeredStatements / totalStatements) * 100,
        isComplete: answeredStatements === totalStatements
    };
}

// פונקציה להצגת סטטוס השלמה (אופציונלי)
function showCompletionStatus() {
    const status = getCompletionStatus();
    console.log(`אבחון הושלם: ${Math.round(status.completionPercentage)}% (${status.answeredStatements}/${status.totalStatements})`);
}
