/**
 * Advanced Analyzer V2
 * Includes Heatmaps, Spaced Repetition, and Adaptive Scheduling
 */

function analyzeStudyPattern(data) {
    const { hours, subjects, methods, feel, peakTime } = data;
    const hourVal = parseFloat(hours) || 0;

    // --- 1. Core Metrics & Health Score ---
    let healthScore = 100;
    if (hourVal > 8) healthScore -= 20; // Overwork
    if (feel === 'exhausted') healthScore -= 30;
    if (feel === 'distracted') healthScore -= 15;
    if (subjects.every(s => s.confidence === 'low')) healthScore -= 10; // Stress factor

    let healthStatus = 'Excelent';
    if (healthScore < 50) healthStatus = 'Burnout Risk';
    else if (healthScore < 75) healthStatus = 'Fatigued';

    // --- 2. Knowledge Heatmap Logic ---
    // subjects is now [{name: 'Math', confidence: 'low'}, ...]
    const heatmap = subjects.map(s => ({
        subject: s.name,
        confidence: s.confidence, // low/medium/high
        score: s.confidence === 'high' ? 90 : (s.confidence === 'medium' ? 60 : 30)
    }));

    // --- 3. Spaced Repetition Calendar (Next 7 Days) ---
    const calendar = generateRevisionCalendar(subjects);

    // --- 4. Adaptive Schedule (Peak Time Optimization) ---
    // Rule: Schedule 'Low' confidence subjects during 'Peak Time'
    const schedule = generateAdaptiveSchedule(hourVal, peakTime, subjects);

    // --- 5. Tips & Predictions (Legacy + Enhanced) ---
    const retentionRate = calculateRetention(methods, feel, healthScore);
    const potentialRetention = Math.min(99, retentionRate + 20).toFixed(1);

    return {
        pattern: {
            summary: generateSummary(healthStatus, hourVal),
            health: { score: healthScore, status: healthStatus }
        },
        heatmap: heatmap,
        calendar: calendar,
        schedule: schedule,
        metrics: {
            load: hourVal > 6 ? 'Heavy' : 'Moderate',
            efficiency: retentionRate > 70 ? 'High' : 'Moderate',
            risk: healthStatus
        },
        prediction: { current: retentionRate.toFixed(1), potential: potentialRetention },
        tips: generateTips(hourVal, feel, methods)
    };
}

// Helpers

function generateSummary(health, hours) {
    if (health === 'Burnout Risk') return "⚠️ High Burnout Risk detected. Your plan needs immediate adjustment to prioritize rest.";
    if (hours > 6) return "You're putting in strong hours. Let's ensure your 'Weak' subjects get your best energy.";
    return "A balanced routine. Focus on raising confidence in your red-flag subjects.";
}

function calculateRetention(methods, feel, health) {
    let base = 50;
    if (methods.includes('teaching') || methods.includes('practice_tests')) base += 20;
    if (feel === 'confident') base += 10;
    if (health < 50) base -= 20;
    return Math.min(95, Math.max(10, base));
}

function generateRevisionCalendar(subjects) {
    // Simple Spaced Repetition Mock
    // Day 1, 3, 7 for new/weak. Day 2, 5 for medium.
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const calendar = [];

    const weakSubs = subjects.filter(s => s.confidence === 'low');
    const medSubs = subjects.filter(s => s.confidence === 'medium');

    days.forEach((day, i) => {
        let tasks = [];
        // Weak subjects every other day
        if (i % 2 === 0 && weakSubs.length > 0) {
            tasks.push(`Review ${weakSubs[i % weakSubs.length].name}`);
        }
        // Medium subjects twice a week
        if ((i === 1 || i === 4) && medSubs.length > 0) {
            tasks.push(`Practice ${medSubs[i % medSubs.length].name}`);
        }

        calendar.push({ day: day, tasks: tasks });
    });
    return calendar;
}

function generateAdaptiveSchedule(hours, peakTime, subjects) {
    let schedule = [];
    let currentTime = 8; // Default start
    const remaining = Math.round(hours);

    // Map peak string to hour range
    const peakMap = {
        'morning': [6, 11],
        'afternoon': [12, 16], // 4 PM
        'evening': [17, 21], // 9 PM
        'night': [22, 26] // 2 AM (represented as 26)
    };

    // Find weak subjects to prioritize
    const prioritySubs = subjects.filter(s => s.confidence === 'low').map(s => s.name);
    let subIndex = 0;

    for (let i = 0; i < remaining; i++) {
        let startH = currentTime;
        let endH = currentTime + 1;

        // Check if this slot falls in user's peak time
        const [pStart, pEnd] = peakMap[peakTime] || [0, 0];
        let isPeak = (startH >= pStart && startH < pEnd);

        let activity = "General Study";
        let badge = "";

        if (isPeak && prioritySubs.length > 0) {
            activity = `Deep Work: ${prioritySubs[subIndex % prioritySubs.length]}`;
            badge = "🔥 Peak Energy";
            subIndex++;
        } else {
            // Fill with other subjects or general
            activity = subjects.length > 0 ? `Study: ${subjects[i % subjects.length].name}` : "Study Block";
        }

        schedule.push({
            time: `${formatTime(startH)} - ${formatTime(endH)}`,
            activity: activity,
            technique: isPeak ? "Active Recall" : "Review",
            badge: badge
        });

        currentTime++;
        if (currentTime === 13) currentTime++; // Lunch skip logic
    }
    return schedule;
}

function formatTime(h) {
    if (h > 24) h -= 24;
    return `${h}:00`;
}

function generateTips(hours, feel, methods) {
    const tips = [];
    tips.push({ text: "Use the 'Space Repetition' calendar below to plan your week.", type: "strategy" });
    if (hours > 6) tips.push({ text: "Schedule 15min breaks every 90min to maintain 'Peak Energy'.", type: "health" });
    return tips;
}
