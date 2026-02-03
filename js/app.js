document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const formSection = document.getElementById('input-form');
    const onboardingSection = document.getElementById('onboarding');
    const form = document.getElementById('study-data-form');
    const resultsSection = document.getElementById('results-dashboard');

    // Multi-select Elements
    const subjectSearch = document.getElementById('subject-search');
    const subjectDropdown = document.getElementById('subject-dropdown');
    const selectedSubjectsContainer = document.getElementById('selected-subjects');

    // State
    let selectedSubjects = [];

    // Navigation: Intro -> Form
    startBtn.addEventListener('click', () => {
        onboardingSection.classList.add('hidden');
        formSection.classList.remove('hidden');
        formSection.classList.add('fade-in');
    });

    // Preset Buttons
    const btn1Week = document.getElementById('set-1-week');
    if (btn1Week) {
        btn1Week.addEventListener('click', () => {
            const date = new Date();
            date.setDate(date.getDate() + 7); // 1 week
            document.getElementById('deadline').value = date.toISOString().split('T')[0];
        });
    }

    // --- Multi-Select Logic ---

    // Filter Subjects
    subjectSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length === 0) {
            subjectDropdown.classList.add('hidden');
            return;
        }

        const matches = ALL_SUBJECTS.filter(sub =>
            sub.toLowerCase().includes(query) && !selectedSubjects.some(s => s.name === sub)
        );

        renderDropdown(matches);
    });

    // Handle Dropdown Selection
    function renderDropdown(matches) {
        subjectDropdown.innerHTML = '';
        if (matches.length === 0) {
            subjectDropdown.classList.add('hidden');
            return;
        }

        matches.forEach(match => {
            const li = document.createElement('li');
            li.className = 'dropdown-item';
            li.textContent = match;
            li.onclick = () => addSubject(match);
            subjectDropdown.appendChild(li);
        });

        subjectDropdown.classList.remove('hidden');
    }

    function addSubject(subjectName) {
        if (!selectedSubjects.some(s => s.name === subjectName)) {
            selectedSubjects.push({ name: subjectName, confidence: 'medium' });
            renderSelectedSubjects();
            subjectSearch.value = '';
            subjectDropdown.classList.add('hidden');
        }
    }

    function removeSubject(subjectName) {
        selectedSubjects = selectedSubjects.filter(s => s.name !== subjectName);
        renderSelectedSubjects();
    }

    function renderSelectedSubjects() {
        selectedSubjectsContainer.innerHTML = '';
        selectedSubjects.forEach((subObj, index) => {
            // subObj is now { name: 'Math', confidence: 'medium' }
            // For backward compatibility if it's just a string, convert it
            if (typeof subObj === 'string') {
                selectedSubjects[index] = { name: subObj, confidence: 'medium' };
                subObj = selectedSubjects[index];
            }

            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.setAttribute('data-confidence', subObj.confidence);
            tag.innerHTML = `
                ${subObj.name}
                <span class="tag-remove">×</span>
            `;

            // Toggle Confidence on click (excluding remove btn)
            tag.addEventListener('click', (e) => {
                if (e.target.classList.contains('tag-remove')) return;
                toggleConfidence(index);
            });

            // Remove Listener
            const removeBtn = tag.querySelector('.tag-remove');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeSubject(subObj.name);
            });

            selectedSubjectsContainer.appendChild(tag);
        });
    }

    function toggleConfidence(index) {
        const levels = ['low', 'medium', 'high'];
        const current = selectedSubjects[index].confidence;
        const next = levels[(levels.indexOf(current) + 1) % levels.length];
        selectedSubjects[index].confidence = next;
        renderSelectedSubjects();
    }

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.multi-select-container')) {
            subjectDropdown.classList.add('hidden');
        }
    });


    // --- Form Submission ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validation
        // if (selectedSubjects.length === 0) {
        //    alert("Please select at least one subject.");
        //    return;
        // }

        // new V3 Data
        const mainGoal = document.getElementById('main-goal').value;
        const deadline = document.getElementById('deadline').value;

        // Gather Data
        const formData = {
            hours: document.getElementById('hours').value,
            peakTime: document.getElementById('peak-time').value,
            subjects: selectedSubjects,
            methods: [document.getElementById('methods').value],
            feel: document.getElementById('feeling').value,
            goal: { name: mainGoal, deadline: deadline } // Add to data
        };

        // Run Analysis (V2)
        const results = analyzeStudyPattern(formData);

        // Run V3 Logic
        const planTimeline = Planner.generatePlan(mainGoal, deadline, selectedSubjects);
        Gamification.addXP(50); // Award XP for generating a plan
        showCoachButton(); // Enable chatbot

        // Render Dashboard
        resultsSection.innerHTML = `
            <div class="card fade-in" style="margin-bottom: 2rem;">
                <h2>Analysis Report</h2>
                <p class="subtitle">${results.pattern.summary}</p>
            </div>

            <!-- V3 Gamification & Heatmap Row -->
            <div class="dashboard-grid">
                ${Gamification.renderProfile()}
                <div style="grid-column: span 2;">
                     ${Components.createHeatmap(results.heatmap)}
                </div>
            </div>

            <div class="dashboard-grid">
                ${Components.createMetricCard('Health Score', results.pattern.health.score, results.pattern.health.status, results.pattern.health.score > 70 ? 'Good' : 'Bad')}
                ${Components.createMetricCard('Efficiency', results.metrics.efficiency, 'Based on Methodology', 'Neutral')}
                ${Components.createPrediction(results.prediction.current, results.prediction.potential)}
            </div>

            <!-- V3 Planner & Schedule -->
            <div class="dashboard-grid">
                <div style="display:flex; flex-direction:column; gap:1.5rem">
                    ${Planner.renderTimeline(planTimeline)}
                    ${Components.createSchedule(results.schedule)}
                </div>
                <div style="display:flex; flex-direction:column; gap:1.5rem">
                    ${Components.createRevisionCalendar(results.calendar)}
                    ${Components.createTipsList(results.tips)}
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 3rem;">
                <button onclick="location.reload()" class="btn">Start Over</button>
            </div>
        `;

        // Navigation: Form -> Dashboard
        formSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
    });

});
