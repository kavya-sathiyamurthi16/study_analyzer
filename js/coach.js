/**
 * AI Chatbot Logic
 */

let coachVisible = false;

// DOM Elements (assigned on init)
let widget, msgs, toggleBtn, closeBtn;

function initCoach() {
    widget = document.getElementById('ai-coach-widget');
    msgs = document.getElementById('coach-messages');
    toggleBtn = document.getElementById('coach-toggle-btn');
    closeBtn = document.getElementById('close-coach');

    // Show toggle button when analysis starts
    // (This allows us to hide it during onboarding)
}

function showCoachButton() {
    if (toggleBtn) toggleBtn.classList.remove('hidden');
}

function toggleCoach() {
    coachVisible = !coachVisible;
    if (coachVisible) {
        widget.classList.remove('hidden');
        widget.style.display = 'flex'; // Ensure flex
    } else {
        widget.classList.add('hidden');
    }
}

// Global function for onclick in HTML
window.askCoach = function (type) {
    if (!msgs) initCoach(); // Safety

    // Add User Message
    addMessage("User", type === 'motivation' ? "Give me motivation!" : (type === 'break' ? " I need a break" : "Give me a tip"));

    // Simulate AI Delay
    setTimeout(() => {
        let response = "";

        if (type === 'motivation') {
            const quotes = [
                "Success is the sum of small efforts, repeated day in and day out.",
                "Don't stop when you're tired. Stop when you're done.",
                "Your future self will thank you for the work you do today."
            ];
            response = quotes[Math.floor(Math.random() * quotes.length)];
        }
        else if (type === 'break') {
            response = "Take a 5-minute breather. Drink water, stretch, or look out a window. Your brain needs this reset!";
        }
        else if (type === 'tip') {
            response = "Try the Feynman technique: Explain a concept out loud as if teaching a 5-year-old. It reveals gaps instantly.";
        }

        addMessage("Bot", response);
        // Scroll to bottom
        msgs.scrollTop = msgs.scrollHeight;
    }, 600);
}

function addMessage(sender, text) {
    const div = document.createElement('div');
    div.className = `msg ${sender === 'User' ? 'user' : 'bot'}`;
    div.textContent = text;
    msgs.appendChild(div);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initCoach();
    if (toggleBtn) toggleBtn.addEventListener('click', toggleCoach);
    if (closeBtn) closeBtn.addEventListener('click', toggleCoach);
});
