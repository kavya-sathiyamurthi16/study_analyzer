/**
 * Gamification Engine
 * Tracks XP, Levels, and Badges
 */

const Gamification = {
    state: {
        xp: 0,
        level: 1,
        badges: []
    },

    // Badges definitions
    badgesList: [
        { id: 'starter', name: 'Rookie Analysis', icon: '🚀', xpReq: 0 },
        { id: 'hard_worker', name: 'Grinder', icon: '💪', xpReq: 100 },
        { id: 'planner', name: 'Master Planner', icon: '📅', xpReq: 250 },
        { id: 'consistency', name: 'Consistency King', icon: '👑', xpReq: 500 }
    ],

    calculateLevel() {
        // Level up every 100 XP
        this.state.level = Math.floor(this.state.xp / 100) + 1;
    },

    addXP(amount) {
        this.state.xp += amount;
        this.calculateLevel();
        this.checkBadges();
        this.saveState();
        return this.state;
    },

    checkBadges() {
        this.badgesList.forEach(badge => {
            if (this.state.xp >= badge.xpReq && !this.state.badges.includes(badge.id)) {
                this.state.badges.push(badge.id);
                // In a real app, we'd trigger a notification here
            }
        });
    },

    saveState() {
        localStorage.setItem('study_game_state', JSON.stringify(this.state));
    },

    loadState() {
        const saved = localStorage.getItem('study_game_state');
        if (saved) {
            this.state = JSON.parse(saved);
        }
    },

    renderProfile() {
        const nextLevelXP = this.state.level * 100;
        const currentLevelStartXP = (this.state.level - 1) * 100;
        const progress = ((this.state.xp - currentLevelStartXP) / 100) * 100;

        const earnedBadges = this.badgesList
            .filter(b => this.state.badges.includes(b.id))
            .map(b => `<div class="badge-item" title="${b.name}">${b.icon}</div>`)
            .join('');

        return `
            <div class="card fade-in" style="grid-column: span 1;">
                <div class="gamer-profile">
                    <div class="level-badge">
                        <span class="level-num">${this.state.level}</span>
                        <span class="level-label">Level</span>
                    </div>
                    <div class="xp-bar-container">
                        <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:#94a3b8;">
                            <span>${this.state.xp} XP</span>
                            <span>Next: ${nextLevelXP} XP</span>
                        </div>
                        <div class="xp-track">
                            <div class="xp-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="badges-grid">
                            ${earnedBadges}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

// Initialize
Gamification.loadState();
