(function() {
    'use strict';

    // ==========================
    // Questions — strategic dilemmas
    //
    // Each answer shifts position on two axes:
    //   competence: positive = competence-first, negative = strategy-first
    //   act:        positive = act now, negative = assess first
    // ==========================
    const questions = [
        {
            number: 1, topic: 'roadmap',
            text: "Your board asks for an AI agent roadmap. Your first move is\u2026",
            answers: [
                { label: "Get 20 people building agents. Use what they learn to shape the roadmap.", tag: 'build_first', short: 'Train 20 people', competence: 2, act: 2 },
                { label: "Hire a consultancy who has done this before.", tag: 'hire_consultancy', short: 'Hire consultancy', competence: -2, act: 1 },
                { label: "Define the roadmap internally, then invest in capability.", tag: 'define_internally', short: 'Define internally', competence: -1, act: 1 },
                { label: "Talk to companies who are already doing it. Learn from their experience.", tag: 'learn_from_peers', short: 'Learn from peers', competence: 1, act: -1 }
            ]
        },
        {
            number: 2, topic: 'rollout',
            text: "You are rolling out AI agent capability. Do you start with whole teams \u2014 or find the early adopters and let them lead?",
            answers: [
                { label: "Find the innovators. They will figure it out and pull others along.", tag: 'innovators_lead', short: 'Innovators lead', competence: 2, act: 1 },
                { label: "Whole teams. Capability only matters when a team can use it together.", tag: 'whole_teams', short: 'Whole teams', competence: -1, act: 1 },
                { label: "Innovators first, but inside a structured program.", tag: 'structured_innovators', short: 'Structured program', competence: 1, act: 0 },
                { label: "Neither. We need to define what \u2018agent capability\u2019 means for us first.", tag: 'define_first', short: 'Define capability first', competence: -1, act: -2 }
            ]
        },
        {
            number: 3, topic: 'platform',
            text: "Your organization could standardize on one AI platform \u2014 or let teams pick their own tools. You\u2026",
            answers: [
                { label: "Let people experiment. The best tools win.", tag: 'let_experiment', short: 'Let people experiment', competence: 2, act: 1 },
                { label: "Standardize. One platform, governed, secure, supported.", tag: 'standardize', short: 'Standardize one', competence: -1, act: 1 },
                { label: "Pick a primary platform but allow exceptions for power users.", tag: 'primary_plus_exceptions', short: 'Primary + exceptions', competence: 0, act: 0 },
                { label: "We are not ready to make that choice yet.", tag: 'not_ready', short: 'Not ready yet', competence: 0, act: -2 }
            ]
        },
        {
            number: 4, topic: 'competitor',
            text: "Your competitor announces they have deployed AI agents across customer service, logistics, and internal operations. You\u2026",
            answers: [
                { label: "Already building. This validates our direction.", tag: 'already_building', short: 'Already building', competence: 0, act: 2 },
                { label: "Need to accelerate. We are behind.", tag: 'need_to_accelerate', short: 'Need to accelerate', competence: 0, act: 1 },
                { label: "Not worried. First-mover advantage is overrated in enterprise AI.", tag: 'not_worried', short: 'First-mover overrated', competence: 0, act: -1 },
                { label: "Skeptical. Announcements are not results.", tag: 'skeptical', short: 'Announcements \u2260 results', competence: 0, act: -2 }
            ]
        },
        {
            number: 5, topic: 'learning',
            text: "When it comes to building new capabilities, your organization\u2026",
            answers: [
                { label: "Learns by doing. Put tools in people\u2019s hands, get out of the way.", tag: 'learn_by_doing', short: 'Learn by doing', competence: 2, act: 1 },
                { label: "Learns through programs. Structured curricula, clear milestones.", tag: 'structured_programs', short: 'Structured programs', competence: -1, act: 0 },
                { label: "Learns from peers. What are similar companies doing?", tag: 'learn_from_peers', short: 'Learn from peers', competence: 1, act: 0 },
                { label: "Learns from experts. We hire the best and absorb their knowledge.", tag: 'hire_experts', short: 'Hire the best experts', competence: -2, act: 0 }
            ]
        },
        {
            number: 6, topic: 'budget',
            text: "You have \u20AC50K in AI budget. Where does it go?",
            answers: [
                { label: "Train 50 people in agent fundamentals.", tag: 'train_50_people', short: 'Train 50 people', competence: 2, act: 1 },
                { label: "Hire one senior AI specialist.", tag: 'hire_specialist', short: 'Hire one specialist', competence: -1, act: 0 },
                { label: "License an enterprise AI platform.", tag: 'license_platform', short: 'License platform', competence: -1, act: 1 },
                { label: "Commission a strategic assessment.", tag: 'strategic_assessment', short: 'Commission assessment', competence: -2, act: -1 }
            ]
        },
        {
            number: 7, topic: 'scaling',
            text: "You trained 20 people. They built working agents. They want to scale. You\u2026",
            answers: [
                { label: "Let the best ones become internal trainers. They carry it forward.", tag: 'internal_trainers', short: 'Internal trainers', competence: 1, act: 1 },
                { label: "Bring in more external training. The experts should keep leading.", tag: 'more_external', short: 'More external training', competence: -1, act: 1 },
                { label: "Build a center of excellence first. Structure before scale.", tag: 'center_of_excellence', short: 'Center of excellence', competence: -1, act: -1 },
                { label: "Slow down. Twenty is enough until we see results.", tag: 'slow_down', short: 'Slow down, see results', competence: 0, act: -2 }
            ]
        }
    ];

    // ==========================
    // Profiles — 2x2, no good/bad
    // ==========================
    const profiles = {
        pioneer: {
            name: "Bias to Action",
            subtitle: "Competence-first. Act now.",
            headline: "Start building. Learn from what happens.",
            body: `<p>Your answers favour putting tools in people's hands and seeing what they build. You want experience with agents to inform the decisions about where to use them.</p>
            <p>A working attempt gives people something to inspect. They can see what the agent got wrong, which information it lacked, and how much checking the result needed. Those observations help shape the next attempt.</p>
            <p>The learning needs somewhere to go. Save the useful rules and checks, show colleagues what happened, and make it easier for the next person to try.</p>`,
            bet: "Building on actual work will reveal useful possibilities and problems you would otherwise miss.",
            risk: "Experiments can stay isolated. People may learn a lot individually while the rest of the organisation keeps repeating the same mistakes.",
            question: "What did the last experiment teach your team, and where will the next person find that learning?"
        },
        methodical: {
            name: "Deliberate Builder",
            subtitle: "Competence-first. Assess first.",
            headline: "You want to understand the options before committing.",
            body: `<p>Your answers suggest you want people to build agent skills, with some preparation before they start. You want to know what others have tried and which conditions helped them.</p>
            <p>That preparation can help you choose a useful first task. You can check access to the necessary information, decide how to judge the result, and give the group enough time to learn.</p>
            <p>The risk is waiting for certainty that building would give you sooner.</p>`,
            bet: "Studying earlier attempts will help you avoid some mistakes and choose a better first experiment.",
            risk: "There will still be things you can only learn in your own setting. More preparation can become a way to postpone finding them.",
            question: "Which unanswered question could you resolve by having a few people try the work?"
        },
        planner: {
            name: "Directed Momentum",
            subtitle: "Strategy-first. Act now.",
            headline: "You want a business purpose for the work.",
            body: `<p>Your answers favour choosing where to apply agents before investing broadly in skills. You want to connect the work to outcomes your company cares about.</p>
            <p>You want each experiment to have a business purpose. You still have to test whether it produces the outcome you expect.</p>
            <p>Write down what should change, how you will notice, and which assumptions the experiment needs to test. Then use what happens to revise the plan.</p>`,
            bet: "A clear purpose will help people choose useful work and judge whether it is worth continuing.",
            risk: "A plan made before anyone has built an agent may assume too much about what is possible and what will be difficult. Leave room to change it.",
            question: "What would your strategy look like if ten people on the strategy team had already built a working agent? Would the roadmap be different?"
        },
        evaluator: {
            name: "Strategic Timing",
            subtitle: "Strategy-first. Assess first.",
            headline: "You want more evidence before committing.",
            body: `<p>Your answers favour watching how agents develop and understanding the options before making a larger investment.</p>
            <p>Other people's experience can help you identify questions to ask. It will still leave gaps about your own data, work, and organisation.</p>
            <p>Decide what evidence would change your mind and how you could get it. A small experiment can help you answer a specific question while keeping the larger commitment open.</p>`,
            bet: "Waiting and studying will make the eventual choice better informed.",
            risk: "Tools may improve while your organisation gains little experience using them. You could face the same practical learning when you eventually start.",
            question: "What would you need to see to decide to act, and could you test for it now?"
        }
    };

    // ==========================
    // State
    // ==========================
    let currentQuestion = 0;
    let answers = [];

    // ==========================
    // DOM
    // ==========================
    const introEl = document.getElementById('intro');
    const questionsSectionEl = document.getElementById('questions-section');
    const resultsSectionEl = document.getElementById('results-section');
    const progressEl = document.getElementById('progress');
    const questionAreaEl = document.getElementById('question-area');
    const startButton = document.getElementById('start-button');

    // ==========================
    // URL decode
    // ==========================
    function checkForResults() {
        const params = new URLSearchParams(window.location.search);
        const r = params.get('r');
        if (r && r.length === questions.length) {
            const decoded = r.split('').map(c => parseInt(c, 10));
            if (decoded.every(d => d >= 0 && d <= 3)) {
                answers = decoded;
                showResults();
                return true;
            }
        }
        return false;
    }

    // ==========================
    // Init
    // ==========================
    function init() {
        if (checkForResults()) return;
        startButton.addEventListener('click', startCheck);
    }

    function track(event, data) {
        if (typeof umami !== 'undefined') umami.track(event, data);
    }

    function startCheck() {
        track('check_start');
        introEl.style.display = 'none';
        questionsSectionEl.classList.add('visible');
        buildProgress();
        showQuestion(0);
    }

    // ==========================
    // Progress
    // ==========================
    function buildProgress() {
        progressEl.innerHTML = '';
        for (let i = 0; i < questions.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            progressEl.appendChild(dot);
        }
    }

    function updateProgress(index) {
        const dots = progressEl.querySelectorAll('.progress-dot');
        dots.forEach((dot, i) => {
            dot.className = 'progress-dot';
            if (i < index) dot.classList.add('done');
            if (i === index) dot.classList.add('active');
        });
    }

    // ==========================
    // Questions
    // ==========================
    function showQuestion(index) {
        currentQuestion = index;
        updateProgress(index);
        const q = questions[index];

        const slide = document.createElement('div');
        slide.className = 'question-slide';
        slide.innerHTML = `
            <div class="question-number">Question ${q.number} of ${questions.length}</div>
            <div class="question-text">${q.text}</div>
            <div class="answers">
                ${q.answers.map((a, i) => `
                    <div class="answer-card" data-index="${i}">${a.label}</div>
                `).join('')}
            </div>
        `;

        questionAreaEl.querySelectorAll('.exiting').forEach(el => el.remove());

        const currentActive = questionAreaEl.querySelector('.active');
        if (currentActive) {
            currentActive.classList.remove('active');
            currentActive.classList.add('exiting');
            setTimeout(() => currentActive.remove(), 400);
        }

        questionAreaEl.appendChild(slide);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                slide.classList.add('active');
            });
        });

        slide.querySelectorAll('.answer-card').forEach(card => {
            card.addEventListener('click', function() {
                selectAnswer(parseInt(this.dataset.index));
            });
        });
    }

    function selectAnswer(answerIndex) {
        answers[currentQuestion] = answerIndex;
        const q = questions[currentQuestion];
        const a = q.answers[answerIndex];
        track('check_answer', { question: currentQuestion + 1, topic: q.topic, choice: a.tag });

        const cards = questionAreaEl.querySelectorAll('.active .answer-card');
        cards.forEach(c => c.classList.remove('selected'));
        cards[answerIndex].classList.add('selected');

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                showQuestion(currentQuestion + 1);
            } else {
                finishCheck();
            }
        }, 300);
    }

    // ==========================
    // Scoring — two axes
    // ==========================
    function calculateAxes() {
        let competence = 0; // positive = competence-first, negative = strategy-first
        let act = 0;        // positive = act now, negative = assess first

        answers.forEach((answerIndex, qIndex) => {
            const a = questions[qIndex].answers[answerIndex];
            competence += a.competence;
            act += a.act;
        });

        // Normalize to -1..1 range
        // Max possible: ~14 per axis (all extreme answers)
        const maxC = 14;
        const maxA = 14;

        return {
            competence: Math.max(-1, Math.min(1, competence / maxC)),
            act: Math.max(-1, Math.min(1, act / maxA))
        };
    }

    function getProfile(axes) {
        if (axes.competence >= 0 && axes.act >= 0) return profiles.pioneer;
        if (axes.competence >= 0 && axes.act < 0) return profiles.methodical;
        if (axes.competence < 0 && axes.act >= 0) return profiles.planner;
        return profiles.evaluator;
    }

    // ==========================
    // Results
    // ==========================
    function finishCheck() {
        questionsSectionEl.classList.remove('visible');

        const encoded = answers.join('');
        const url = new URL(window.location);
        url.searchParams.set('r', encoded);
        history.replaceState(null, '', url);

        const axes = calculateAxes();
        const profile = getProfile(axes);
        track('check_complete', {
            profile: profile.name,
            answers: encoded,
            competence: axes.competence.toFixed(2),
            act: axes.act.toFixed(2)
        });

        showResults();
    }

    function showResults() {
        introEl.style.display = 'none';
        questionsSectionEl.classList.remove('visible');
        resultsSectionEl.classList.add('visible');

        const axes = calculateAxes();
        const profile = getProfile(axes);

        document.getElementById('results-profile-name').textContent = profile.name;
        document.getElementById('results-subtitle').textContent = profile.subtitle;

        drawMatrix(axes);

        document.getElementById('profile-copy').innerHTML = `
            <div class="profile-headline">${profile.headline}</div>
            <div class="profile-body">${profile.body}</div>
        `;

        document.getElementById('tradeoffs').innerHTML = `
            <div class="tradeoff-card tradeoff-card--bet">
                <div class="tradeoff-label">What you are betting on</div>
                <div class="tradeoff-text">${profile.bet}</div>
            </div>
            <div class="tradeoff-card tradeoff-card--risk">
                <div class="tradeoff-label">The trade-off</div>
                <div class="tradeoff-text">${profile.risk}</div>
            </div>
        `;

        document.getElementById('shareable-insight-text').textContent = profile.question;

        renderCrowd();

        document.getElementById('share-button').addEventListener('click', copyShareLink);

        // Feedback meter
        (function() {
            var btnUp = document.getElementById('feedback-up');
            var btnDown = document.getElementById('feedback-down');
            var thanks = document.getElementById('feedback-thanks');

            function vote(value) {
                track('feedback', { quiz: 'check', value: value });
                var voted = value === 'insight' ? btnUp : btnDown;
                var other = value === 'insight' ? btnDown : btnUp;
                voted.classList.add('voted');
                other.classList.add('dimmed');
                thanks.style.display = 'block';
                btnUp.disabled = true;
                btnDown.disabled = true;
            }

            btnUp.addEventListener('click', function() { vote('insight'); });
            btnDown.addEventListener('click', function() { vote('fluff'); });
        })();

        window.scrollTo(0, 0);
    }

    // ==========================
    // 2x2 Matrix (SVG)
    // ==========================
    function drawMatrix(axes) {
        const container = document.getElementById('matrix-container');
        const size = 480;
        const pad = 80;          // padding for labels
        const gridSize = size - pad * 2;
        const cx = size / 2;
        const cy = size / 2;

        // User position in pixel space
        const ux = cx - axes.competence * (gridSize / 2);
        const uy = cy - axes.act * (gridSize / 2);  // invert Y: up = positive

        // Quadrant labels
        const quadrants = [
            { x: pad + gridSize * 0.25, y: pad + gridSize * 0.25, label: 'Bias to\nAction', opacity: axes.competence >= 0 && axes.act >= 0 ? 1 : 0.3 },
            { x: pad + gridSize * 0.75, y: pad + gridSize * 0.25, label: 'Directed\nMomentum', opacity: axes.competence < 0 && axes.act >= 0 ? 1 : 0.3 },
            { x: pad + gridSize * 0.25, y: pad + gridSize * 0.75, label: 'Deliberate\nBuilder', opacity: axes.competence >= 0 && axes.act < 0 ? 1 : 0.3 },
            { x: pad + gridSize * 0.75, y: pad + gridSize * 0.75, label: 'Strategic\nTiming', opacity: axes.competence < 0 && axes.act < 0 ? 1 : 0.3 }
        ];

        let quadrantSvg = '';
        quadrants.forEach(q => {
            const lines = q.label.split('\n');
            quadrantSvg += `<text x="${q.x}" y="${q.y}" text-anchor="middle" fill="white" font-size="13" font-weight="500" font-family="Inter, sans-serif" opacity="${q.opacity}">`;
            lines.forEach((line, i) => {
                quadrantSvg += `<tspan x="${q.x}" dy="${i === 0 ? 0 : 16}">${line}</tspan>`;
            });
            quadrantSvg += `</text>`;
        });

        // Axis labels
        const axisLabels = `
            <text x="${cx}" y="${pad - 16}" text-anchor="middle" fill="#888" font-size="11" font-family="Inter, sans-serif">ACT NOW</text>
            <text x="${cx}" y="${pad + gridSize + 28}" text-anchor="middle" fill="#888" font-size="11" font-family="Inter, sans-serif">ASSESS FIRST</text>
            <text x="${pad - 16}" y="${cy}" text-anchor="middle" fill="#888" font-size="11" font-family="Inter, sans-serif" transform="rotate(-90 ${pad - 16} ${cy})">COMPETENCE-FIRST</text>
            <text x="${pad + gridSize + 16}" y="${cy}" text-anchor="middle" fill="#888" font-size="11" font-family="Inter, sans-serif" transform="rotate(90 ${pad + gridSize + 16} ${cy})">STRATEGY-FIRST</text>
        `;

        // Quadrant backgrounds
        const bgOpacity = 0.03;
        const quadBgs = `
            <rect x="${pad}" y="${pad}" width="${gridSize/2}" height="${gridSize/2}" fill="rgba(255,107,53,${axes.competence >= 0 && axes.act >= 0 ? 0.06 : bgOpacity})" rx="2"/>
            <rect x="${cx}" y="${pad}" width="${gridSize/2}" height="${gridSize/2}" fill="rgba(255,255,255,${axes.competence < 0 && axes.act >= 0 ? 0.04 : bgOpacity})" rx="2"/>
            <rect x="${pad}" y="${cy}" width="${gridSize/2}" height="${gridSize/2}" fill="rgba(255,255,255,${axes.competence >= 0 && axes.act < 0 ? 0.04 : bgOpacity})" rx="2"/>
            <rect x="${cx}" y="${cy}" width="${gridSize/2}" height="${gridSize/2}" fill="rgba(255,255,255,${axes.competence < 0 && axes.act < 0 ? 0.04 : bgOpacity})" rx="2"/>
        `;

        container.innerHTML = `
            <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
                <!-- Grid -->
                <rect x="${pad}" y="${pad}" width="${gridSize}" height="${gridSize}" fill="none" stroke="#222" stroke-width="1"/>
                ${quadBgs}
                <line x1="${cx}" y1="${pad}" x2="${cx}" y2="${pad + gridSize}" stroke="#333" stroke-width="1"/>
                <line x1="${pad}" y1="${cy}" x2="${pad + gridSize}" y2="${cy}" stroke="#333" stroke-width="1"/>

                <!-- Quadrant labels -->
                ${quadrantSvg}

                <!-- Axis labels -->
                ${axisLabels}

                <!-- User dot -->
                <circle cx="${ux}" cy="${uy}" r="8" fill="#ff6b35" stroke="#ff6b35" stroke-width="2" opacity="0.9"/>
                <circle cx="${ux}" cy="${uy}" r="16" fill="none" stroke="#ff6b35" stroke-width="1.5" opacity="0.3"/>
            </svg>
            <div class="matrix-note">Your position based on seven strategic choices. No right answer \u2014 only trade-offs.</div>
        `;
    }

    // ==========================
    // Crowd comparison data
    // Update these numbers from Umami dashboard periodically
    // ==========================
    const crowdData = {
        lastUpdated: null,
        totalResponses: 0,
        // Profile counts: [Bias to Action, Deliberate Builder, Directed Momentum, Strategic Timing]
        profiles: [0, 0, 0, 0],
        // Counts per question: [answer0, answer1, answer2, answer3]
        questions: [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    };

    const profileOrder = [
        { key: 'pioneer', name: 'Bias to Action' },
        { key: 'methodical', name: 'Deliberate Builder' },
        { key: 'planner', name: 'Directed Momentum' },
        { key: 'evaluator', name: 'Strategic Timing' }
    ];

    function renderCrowd() {
        const section = document.getElementById('crowd-section');

        if (crowdData.totalResponses < 10) {
            section.innerHTML = `
                <div class="crowd-section">
                    <h3>How others answered</h3>
                    <div class="crowd-empty">
                        Not enough responses yet. Share your link and come back to see how others answered.
                    </div>
                </div>
            `;
            return;
        }

        const axes = calculateAxes();
        const currentProfile = getProfile(axes);

        let html = `
            <div class="crowd-section">
                <h3>How others answered</h3>
                <p class="crowd-intro">${crowdData.totalResponses} people have taken this check.</p>
        `;

        // Profile distribution
        const profileTotal = crowdData.profiles.reduce((a, b) => a + b, 0);
        if (profileTotal > 0) {
            html += `<div class="crowd-question">`;
            html += `<div class="crowd-question-label">profiles</div>`;
            profileOrder.forEach((p, i) => {
                const pct = Math.round(crowdData.profiles[i] / profileTotal * 100);
                const isYours = currentProfile.name === p.name;
                html += `
                    <div class="crowd-bar-row">
                        <div class="crowd-bar-label">${p.name}</div>
                        <div class="crowd-bar-track">
                            <div class="crowd-bar-fill ${isYours ? 'yours' : ''}" style="width: ${pct}%"></div>
                        </div>
                        <div class="crowd-bar-pct">${pct}%</div>
                        <div class="crowd-bar-you">${isYours ? '\u2190 you' : ''}</div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        questions.forEach((q, qi) => {
            const counts = crowdData.questions[qi];
            const total = counts.reduce((a, b) => a + b, 0);

            html += `<div class="crowd-question">`;
            html += `<div class="crowd-question-label">${q.topic}</div>`;

            q.answers.forEach((a, ai) => {
                const pct = total > 0 ? Math.round(counts[ai] / total * 100) : 0;
                const isYours = answers[qi] === ai;

                html += `
                    <div class="crowd-bar-row">
                        <div class="crowd-bar-label">${a.short}</div>
                        <div class="crowd-bar-track">
                            <div class="crowd-bar-fill ${isYours ? 'yours' : ''}" style="width: ${pct}%"></div>
                        </div>
                        <div class="crowd-bar-pct">${pct}%</div>
                        <div class="crowd-bar-you">${isYours ? '\u2190 you' : ''}</div>
                    </div>
                `;
            });

            html += `</div>`;
        });

        if (crowdData.lastUpdated) {
            html += `<p style="text-align: center; font-size: 0.7rem; color: #555; margin-top: 16px;">Last updated: ${crowdData.lastUpdated}</p>`;
        }
        html += `</div>`;

        section.innerHTML = html;
    }

    // ==========================
    // Share
    // ==========================
    function copyShareLink() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            document.getElementById('share-copied').style.display = 'block';
            setTimeout(() => {
                document.getElementById('share-copied').style.display = 'none';
            }, 3000);
        });
    }

    // ==========================
    // Start
    // ==========================
    init();
})();
