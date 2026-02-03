/**
 * Goal Planner Engine
 * Breaks down main goals into milestones
 */

const Planner = {
    generatePlan(mainGoal, deadline, subjects) {
        const now = new Date();
        const end = new Date(deadline);
        const diffTime = Math.abs(end - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const timeline = [];

        // If duration is short (e.g. <= 10 days), generate Daily Plan
        if (diffDays <= 10) {
            for (let i = 0; i < diffDays; i++) {
                const dayDate = this.addDays(now, i + 1);
                const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' });

                // Intelligent Daily Theme
                let title = `${dayName}: Focus Session`;
                if (i === 0) title = `${dayName}: Kickoff & Planning`;
                else if (i === diffDays - 1) title = `${dayName}: Final Review`;

                // Assign subject
                const focusSubject = subjects.length > 0 ? subjects[i % subjects.length].name : 'General Study';

                timeline.push({
                    type: 'day', // Marker for renderer
                    title: title,
                    focus: focusSubject,
                    date: dayDate.toLocaleDateString()
                });
            }
        } else {
            // Weekly Plan (Legacy Logic)
            const weeks = Math.ceil(diffDays / 7);
            for (let i = 0; i < weeks; i++) {
                const weekNum = i + 1;
                let title = `Week ${weekNum}: Progress`;

                if (weeks === 4) {
                    const themes = [
                        "Conceptual Foundation & Notes",
                        "Deep Dive & Problem Solving",
                        "Active Recall & Weakness Targeting",
                        "Mock Tests & Final Polish"
                    ];
                    title = `Week ${weekNum}: ${themes[i] || 'Review'}`;
                } else {
                    if (i === 0) title = `Week ${weekNum}: Foundation`;
                    else if (i === weeks - 1) title = `Week ${weekNum}: Final Review`;
                    else title = `Week ${weekNum}: Deep Work & Practice`;
                }

                const focusSubject = subjects.length > 0 ? subjects[i % subjects.length].name : 'General Review';

                timeline.push({
                    type: 'week',
                    week: weekNum,
                    title: title,
                    focus: focusSubject,
                    date: this.addDays(now, i * 7).toLocaleDateString()
                });
            }
        }

        return timeline;
    },

    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    renderTimeline(timeline) {
        if (!timeline || timeline.length === 0) return '';

        const items = timeline.map(t => `
            <div class="timeline-item">
                <div class="timeline-date">${t.date}</div>
                <div class="timeline-title">${t.title}</div>
                <div style="font-size:0.9rem; opacity:0.8; margin-top:0.2rem;">
                    <span class="badge badge-sm" style="background:var(--primary-color); color:white">${t.focus}</span>
                </div>
            </div>
        `).join('');

        return `
            <div class="card fade-in" style="grid-column: span 1;">
                <h2>Your Roadmap</h2>
                <div class="timeline-container">
                    ${items}
                </div>
            </div>
        `;
    }
};
