// אתחול משתנים
let answers = {};
let results = {};

const videoLinks = {
    visual: "https://www.youtube.com/watch?v=הקישור_לסרטון_חזותי",
    auditory: "https://www.youtube.com/watch?v=הקישור_לסרטון_שמיעתי", 
    kinesthetic: "https://www.youtube.com/watch?v=הקישור_לסרטון_תנועתי"
};

// פונקציה להצגת מסך
function showScreen(screenId) {
    // הסתרת כל המסכים
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // הצגת המסך הנבחר
    document.getElementById(screenId).classList.add('active');
}

// פונקציה לרישום תשובה
function registerAnswer(question, statement, value) {
    // שמירת התשובה
    const key = `q${question}_${statement}`;
    answers[key] = parseInt(value);
    
    // סימון הכפתור שנבחר
    const rating = document.querySelector(`.rating[data-question="${question}"][data-statement="${statement}"]`);
    const buttons = rating.querySelectorAll('.rating-btn');
    
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedButton = rating.querySelector(`.rating-btn[data-value="${value}"]`);
    selectedButton.classList.add('active');
}

// פונקציה לחישוב התוצאות
function calculateResults() {
    let visualScore = 0;
    let auditoryScore = 0;
    let kinestheticScore = 0;
    let totalScore = 0;
    
    // סכימת הנקודות לכל סגנון
    for (const key in answers) {
        const value = answers[key];
        const statement = parseInt(key.split('_')[1]);
        
        if (statement === 0) {
            visualScore += value;
        } else if (statement === 1) {
            auditoryScore += value;
        } else if (statement === 2) {
            kinestheticScore += value;
        }
        
        totalScore += value;
    }
    
    // חישוב אחוזים
    const visualPercent = (visualScore / totalScore) * 100;
    const auditoryPercent = (auditoryScore / totalScore) * 100;
    const kinestheticPercent = (kinestheticScore / totalScore) * 100;
    
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
        dominantStyleName: styleNames[dominantStyle]
    };
}

// פונקציה להצגת התוצאות
function displayResults(results) {
    // הצגת אחוזים
    document.getElementById('visual-percent').textContent = `${Math.round(results.visualPercent)}%`;
    document.getElementById('auditory-percent').textContent = `${Math.round(results.auditoryPercent)}%`;
    document.getElementById('kinesthetic-percent').textContent = `${Math.round(results.kinestheticPercent)}%`;
    
    // הצגת הסגנון הדומיננטי
    document.getElementById('dominant-style').textContent = results.dominantStyleName;
    
    // הצגת גרפים
    document.getElementById('visual-bar').style.width = `${results.visualPercent}%`;
    document.getElementById('auditory-bar').style.width = `${results.auditoryPercent}%`;
    document.getElementById('kinesthetic-bar').style.width = `${results.kinestheticPercent}%`;
    
    // הסתרת כל חלקי ההמלצות
    document.querySelectorAll('.recommendation-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // הצגת ההמלצות הרלוונטיות
    document.getElementById(`${results.dominantStyle}-recommendations`).style.display = 'block';
}

// פונקציה לפתיחת הסרטון
function openVideo(style) {
    window.open(videoLinks[style], '_blank');
}

// אתחול האירועים
function initializeEvents() {
    // כפתור התחלה
    document.getElementById('start-btn').addEventListener('click', function() {
        showScreen('question-1-screen');
    });
    
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
    
    // כפתורי ניווט קדימה ואחורה
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function() {
            const nextScreen = this.getAttribute('data-next');
            // בדיקה אם כל ההיגדים נענו
            if (nextScreen) {
                const currentQuestion = parseInt(this.closest('.screen').id.split('-')[1]);
                const allAnswered = [0, 1, 2].every(idx => answers[`q${currentQuestion}_${idx}`] !== undefined);
                if (allAnswered) {
                    showScreen(nextScreen);
                } else {
                    alert('נא לענות על כל ההיגדים בשאלה זו לפני שתמשיך');
                }
            }
        });
    });
    
    document.querySelectorAll('.back-btn').forEach(button => {
        button.addEventListener('click', function() {
            const prevScreen = this.getAttribute('data-prev');
            if (prevScreen) {
                showScreen(prevScreen);
            }
        });
    });
    
    // כפתור סיום
    document.getElementById('finish-btn').addEventListener('click', function() {
        // בדיקה אם כל ההיגדים נענו בשאלה האחרונה
        const allAnswered = [0, 1, 2].every(idx => answers[`q9_${idx}`] !== undefined);
        if (allAnswered) {
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
    
    // כפתורי הסרטונים
    document.getElementById('visual-video-btn').addEventListener('click', function() {
        openVideo('visual');
    });
    document.getElementById('auditory-video-btn').addEventListener('click', function() {
        openVideo('auditory');
    });
    document.getElementById('kinesthetic-video-btn').addEventListener('click', function() {
        openVideo('kinesthetic');
    });
    
    // כפתור המלצות
    document.getElementById('recommendations-btn').addEventListener('click', function() {
        showScreen('recommendations-screen');
    });
    
    // כפתור חזרה לתוצאות
    document.getElementById('back-to-results-btn').addEventListener('click', function() {
        showScreen('results-screen');
    });
    
    // כפתורי התחלה מחדש
    document.getElementById('reset-btn').addEventListener('click', function() {
        resetAssessment();
    });
    document.getElementById('reset-from-recommendations-btn').addEventListener('click', function() {
        resetAssessment();
    });
}

// פונקציה לאיפוס האבחון
function resetAssessment() {
    // איפוס התשובות
    for (const key in answers) {
        delete answers[key];
    }
    
    // איפוס בחירת הכפתורים
    document.querySelectorAll('.rating-btn').forEach(button => {
        button.classList.remove('active');
    });
    
    // חזרה למסך הראשון
    showScreen('intro-screen');
}

// הפעלת האירועים בטעינת הדף
document.addEventListener('DOMContentLoaded', function() {
    initializeEvents();
});
