const Components = {
    // --- Legacy Component Adapters ---
    createMetricCard(title, value, subtitle, status) {
        return `
            <div class="card metric-card ${status.toLowerCase()} fade-in">
                <h3>${title}</h3>
                <div class="metric-value">${value}</div>
                <p style="font-size: 0.9rem; opacity: 0.7;">${subtitle}</p>
            </div>
        `;
    },

    createTipsList(tips) {
        const items = tips.map(t => `
            <li class="tip-item ${t.type}">
                <span class="tip-icon">💡</span>
                <span class="tip-text">${t.text}</span>
            </li>
        `).join('');
        return `
            <div class="card fade-in">
                <h2>AI Recommendations</h2>
                <ul class="tips-list-visual">${items}</ul>
            </div>
        `;
    },

    createPrediction(current, potential) {
        return `
            <div class="card fade-in prediction-card">
                <h2>Retention Prediction</h2>
                <div class="prediction-container">
                    <div class="pred-row">
                        <span>Current</span><span class="score-text">${current}%</span>
                    </div>
                    <div class="progress-track"><div class="progress-fill current" style="width: ${current}%"></div></div>
                    <div class="pred-row" style="margin-top: 1rem">
                        <span>Potential</span><span class="score-text highlight">${potential}%</span>
                    </div>
                    <div class="progress-track"><div class="progress-fill potential" style="width: ${potential}%"></div></div>
                </div>
            </div>
        `;
    },

    // --- New V2 Components ---

    createHeatmap(data) {
        if (!data || data.length === 0) return '';
        const cells = data.map(item => `
            <div class="heatmap-cell ${item.confidence}">
                ${item.subject}
                <div style="font-size:0.8rem; opacity:0.8">${item.confidence.toUpperCase()}</div>
            </div>
        `).join('');

        return `
            <div class="card fade-in">
                <h2>Knowledge Heatmap</h2>
                <p class="subtitle">Visualizing your confidence levels</p>
                <div class="heatmap-container">
                    ${cells}
                </div>
            </div>
        `;
    },

    createRevisionCalendar(calendar) {
        const days = calendar.map(d => {
            const hasTask = d.tasks.length > 0;
            return `
                <div class="rev-day ${hasTask ? 'active' : ''}">
                    <span class="day-name">${d.day}</span>
                    ${d.tasks.map(() => '<span class="task-dot"></span>').join('')}
                    ${hasTask ? `<div style="font-size:0.7rem; margin-top:4px">${d.tasks[0].split(' ')[1]}</div>` : ''}
                </div>
            `;
        }).join('');

        return `
            <div class="card fade-in">
                <h2>Spaced Repetition Plan</h2>
                <div class="revision-grid">
                    ${days}
                </div>
            </div>
        `;
    },

    createSchedule(scheduleItems) {
        const items = scheduleItems.map(item => `
            <li class="schedule-item">
                <span class="time-slot">${item.time}</span>
                <div class="activity-details">
                    <span class="activity-name">${item.activity} ${item.badge ? `<span style="background:#f59e0b; color:#000; padding:2px 6px; border-radius:10px; font-size:0.7rem;">${item.badge}</span>` : ''}</span>
                    <span class="activity-tech">${item.technique}</span>
                </div>
            </li>
        `).join('');

        return `
            <div class="card fade-in">
                <h2>Adaptive Schedule</h2>
                <ul class="schedule-list">
                    ${items}
                </ul>
            </div>
        `;
    }
};
