    /**
     * Domain Readiness Assessment — quiz.js
     *
     * A self-assessment tool that measures how structurally ready a business
     * domain is for AI agent deployment. The user selects a domain (e.g.,
     * Finance, HR, Operations), answers 5 questions, and receives:
     *   - A radar chart comparing their domain to coding (the reference case)
     *   - A readiness profile (Agent-Ready / Infrastructure Gap / etc.)
     *   - Benchmark data showing Practitioner Signal Density across domains
     *
     * METHODOLOGY
     * -----------
     * The assessment is built on two layers:
     *
     * 1. FIVE STRUCTURAL DIMENSIONS — the quiz questions.
     *    Coding became the proving ground for AI agents because it has all five
     *    structural ingredients. Other domains have them to varying degrees.
     *    The five dimensions are:
     *
     *    - Verification Infrastructure (Q1: "Verification Speed")
     *      How fast can you tell if output is correct? Coding has compilers,
     *      test suites, CI pipelines. Finance has reconciliation. HR has... less.
     *
     *    - Data Quality & Tool Access (Q2: "Tool Access")
     *      Can an AI operate the tools your team uses? This measures both
     *      whether workflows are digital/API-accessible AND whether the data
     *      flowing through them is structured enough for agent use.
     *
     *    - Governance & Iteration Safety (Q3: "Iteration Safety")
     *      How reversible are mistakes? This captures both the technical ability
     *      to roll back AND the governance maturity to allow iterative deployment.
     *      Domains with high reversibility can iterate faster with agents.
     *
     *    - Process Readiness & Success Clarity (Q4: "Success Clarity")
     *      How objective is "done correctly"? This measures whether the domain
     *      has codified what good output looks like — a prerequisite for both
     *      agent deployment and automated evaluation.
     *
     *    - Talent & Practitioner Ecosystem (Q5: "Practitioner Ecosystem")
     *      Are practitioners sharing real deployment experiences? This measures
     *      the talent signal: whether your domain has a community of builders
     *      you can learn from, or whether you're navigating alone.
     *
     * 2. PRACTITIONER SIGNAL DENSITY (PSD) — the benchmark data.
     *    PSD = number of independent practitioner sources per search query that
     *    pass our three-gate editorial methodology:
     *      Gate 1: Truly agentic? (multi-step autonomous work, not a chatbot)
     *      Gate 2: Independent evidence? (at least one non-vendor source)
     *      Gate 3: Specific outcome? (named company + practice + measurable result)
     *
     *    Higher PSD = more practitioners openly sharing real deployment
     *    experience in that domain. Computed from our continuous research
     *    program's classified search logs (see below for source counts).
     *
     *    The gradient across domains IS the insight: coding at 4.6 per query,
     *    product/strategy at 0.6. That 8x gap tells you where agents work today
     *    vs. where the infrastructure still needs to be built.
     *
     * SOURCE DATA
     * -----------
     * The "1,100+ classified sources" refers to the total raw links in our
     * continuous research search logs across 9 domain tracks. Each link is
     * classified by source type (practitioner direct, vendor press release,
     * general press, etc.) and tested against the three gates above. Only
     * links that pass all three gates contribute to the PSD score.
     *
     * Search log source: continuous-research/search-logs/
     * Domain findings:   continuous-research/findings/
     * Methodology:       continuous-research/README.md
     *
     * The benchmark numbers are NOT survey data or analyst estimates. They are
     * computed directly from our research funnel: total gate-passing sources
     * divided by total search queries per domain.
     */
    (function() {
        'use strict';

        // ==========================
        // Domains
        // ==========================
        var domains = [
            { key: 'coding',          label: 'Software / Engineering' },
            { key: 'finance',         label: 'Finance / Accounting' },
            { key: 'customerService', label: 'Customer Service' },
            { key: 'operations',      label: 'Operations / Supply Chain' },
            { key: 'hr',              label: 'HR / People Operations' },
            { key: 'complianceLegal', label: 'Compliance / Legal' },
            { key: 'salesMarketing',  label: 'Sales / Marketing' },
            { key: 'productStrategy', label: 'Product / Strategy' }
        ];

        // ==========================
        // Benchmark data — Practitioner Signal Density (PSD) per search query
        //
        // Source: continuous-research/search-logs/ (9 domain tracks)
        // Method: For each domain, we ran targeted search queries and classified
        //   every result by source type and against three gates (see JSDoc above).
        //   PSD = gate-passing sources / total queries for that domain.
        //
        // Per-domain raw counts (queries → raw links → gate-passing):
        //   Coding:           ~17 queries, 80 raw links,  37 pass → PSD 4.6
        //   Customer Service: ~16 queries, 160 raw links, 38 pass → PSD 2.4
        //   Operations:       ~8 queries,  77 raw links,  18 pass → PSD 2.3
        //   HR:               ~8 queries,  80 raw links,  14 pass → PSD 1.8
        //   Sales/Marketing:  ~8 queries,  75 raw links,  12 pass → PSD 1.5
        //   Finance:          ~12 queries, 120 raw links, 12 pass → PSD 1.0
        //   Compliance/Legal: ~20 queries, 190 raw links, 18 pass → PSD 0.9
        //   Product/Strategy: ~8 queries,  66 raw links,   5 pass → PSD 0.6
        //
        // These numbers reflect Q1 2026 state. Updated as new research rounds run.
        // ==========================
        var benchmarks = {
            coding:          { psd: 4.6, label: 'Software / Engineering' },
            customerService: { psd: 2.4, label: 'Customer Service' },
            operations:      { psd: 2.3, label: 'Operations / Supply Chain' },
            hr:              { psd: 1.8, label: 'HR / People Operations' },
            salesMarketing:  { psd: 1.5, label: 'Sales / Marketing' },
            finance:         { psd: 1.0, label: 'Finance / Accounting' },
            complianceLegal: { psd: 0.9, label: 'Compliance / Legal' },
            productStrategy: { psd: 0.6, label: 'Product / Strategy' }
        };

        // Sorted order (highest to lowest)
        var benchmarkOrder = [
            'coding', 'customerService', 'operations', 'hr',
            'salesMarketing', 'finance', 'complianceLegal', 'productStrategy'
        ];

        // ==========================
        // Questions — 5 structural dimensions, 4-point scale (A=3, B=2, C=1, D=0)
        //
        // Each question maps to one of the five dimensions that determine
        // agent readiness (see module JSDoc for full rationale):
        //
        //   Q1 "Verification Speed"      → Verification Infrastructure
        //   Q2 "Tool Access"             → Data Quality & Tool Access
        //   Q3 "Iteration Safety"        → Governance & Iteration Safety
        //   Q4 "Success Clarity"         → Process Readiness & Success Clarity
        //   Q5 "Practitioner Ecosystem"  → Talent & Practitioner Ecosystem
        //
        // The short names (left) are used in the radar chart and UI.
        // The full dimension names (right) are the analytical categories.
        // ==========================
        var questions = [
            {
                number: 1,
                ingredient: 'Verification Speed',
                text: 'When someone completes a task in your domain, how fast can you tell if it\u2019s correct?',
                answers: [
                    { score: 3, label: 'Seconds \u2014 automated checks tell us immediately' },
                    { score: 2, label: 'Minutes \u2014 a quick review or reconciliation' },
                    { score: 1, label: 'Hours to days \u2014 requires human review cycle' },
                    { score: 0, label: 'Weeks or unclear \u2014 correctness is subjective' }
                ]
            },
            {
                number: 2,
                ingredient: 'Tool Access',
                text: 'Could an AI operate the tools your team uses to do their work?',
                answers: [
                    { score: 3, label: 'Yes \u2014 our work is fully digital with APIs and structured data' },
                    { score: 2, label: 'Mostly \u2014 digital tools, but some require human judgment' },
                    { score: 1, label: 'Partially \u2014 mix of digital tools and manual processes' },
                    { score: 0, label: 'No \u2014 our work requires physical presence or unstructured communication' }
                ]
            },
            {
                number: 3,
                ingredient: 'Iteration Safety',
                text: 'How reversible are mistakes in your domain?',
                answers: [
                    { score: 3, label: 'Fully \u2014 we can undo, rollback, or revert any change' },
                    { score: 2, label: 'Mostly \u2014 mistakes are fixable with some effort' },
                    { score: 1, label: 'Partially \u2014 some mistakes are costly to reverse' },
                    { score: 0, label: 'Not at all \u2014 errors have permanent consequences' }
                ]
            },
            {
                number: 4,
                ingredient: 'Success Clarity',
                text: 'How objective is \u2018done correctly\u2019 in your domain?',
                answers: [
                    { score: 3, label: 'Binary \u2014 it passes or it fails. No ambiguity.' },
                    { score: 2, label: 'Measurable \u2014 clear metrics, though some interpretation needed' },
                    { score: 1, label: 'Somewhat subjective \u2014 reasonable people might disagree' },
                    { score: 0, label: 'Highly subjective \u2014 depends on context, judgment, relationships' }
                ]
            },
            {
                number: 5,
                ingredient: 'Practitioner Ecosystem',
                text: 'Are practitioners in your domain publicly sharing AI agent deployment experiences?',
                answers: [
                    { score: 3, label: 'Yes \u2014 dozens writing openly about what works' },
                    { score: 2, label: 'Some \u2014 a few early practitioners sharing results' },
                    { score: 1, label: 'Mostly vendors \u2014 announcements but few real deployments' },
                    { score: 0, label: 'Nobody \u2014 silence or only vendor marketing' }
                ]
            }
        ];

        // ==========================
        // Ingredient-to-solution mapping
        //
        // For each dimension, what solved it in coding. Used in the "key insight"
        // to prompt the user: "In software, this was solved by X. What's the
        // equivalent in your domain?" The coding examples are concrete and
        // familiar to our CTO audience — they're reference points, not
        // prescriptions. Each domain needs its own equivalent infrastructure.
        // ==========================
        var ingredientSolutions = {
            'Verification Speed': 'automated test suites',
            'Tool Access': 'CLI tools, APIs, and IDEs',
            'Iteration Safety': 'git version control',
            'Success Clarity': 'compilers and test frameworks that give binary pass/fail',
            'Practitioner Ecosystem': 'open source culture and public technical blogs'
        };

        // ==========================
        // Readiness profiles
        // ==========================
        var profiles = {
            agentReady: {
                name: 'Agent-Ready',
                range: '12\u201315',
                description: 'Your domain has the structural ingredients for agents. The verification loops exist. The tools are accessible. The structural ingredients are in place \u2014 the same ones that made coding the proving ground for agents. Deployment speed is now the variable.'
            },
            infrastructureGap: {
                name: 'Infrastructure Gap',
                range: '8\u201311',
                description: 'Your domain has some ingredients but not all. The gap between where you are and where coding is tells you what to build first. Your biggest gap: <strong>{gap}</strong>. In coding, that was built over decades of engineering practice. Your domain needs its equivalent.'
            },
            verificationDesert: {
                name: 'Verification Desert',
                range: '4\u20137',
                description: 'Your domain\u2019s structural infrastructure for agents is yours to build. In our Q1 2026 research across 9 domain tracks (1,100+ sources classified by type and tested against three editorial gates), vendor announcements outnumbered verified deployments in every domain except coding. The path forward: build your verification loop first.'
            },
            preAgent: {
                name: 'Pre-Agent',
                range: '0\u20133',
                description: 'Your domain needs its own test suite before agents can work here. Not the technology \u2014 the ability to verify output fast. You get to define what \u201Ccorrect\u201D means. Focus on: making it measurable, and creating fast feedback loops.'
            }
        };

        // ==========================
        // Crowd comparison data
        //
        // Populated when enough quiz responses accumulate (threshold: 10).
        // To activate: set lastUpdated to a date string (e.g., '2026-03-15'),
        // totalResponses to the count, and fill domains[key] with an array
        // of 5 score distributions (one per question), each as
        // [score0count, score1count, score2count, score3count].
        //
        // Example:
        //   domains: { finance: [[2,5,8,1], [0,3,10,3], [1,4,7,4], [3,6,5,2], [8,5,2,1]] }
        // ==========================
        var crowdData = {
            lastUpdated: null,  // Set to date string when data is available (e.g., '2026-03-15')
            totalResponses: 0,  // Set to response count; renderCrowd() requires >= 10
            // Per domain, per question: [score0count, score1count, score2count, score3count]
            domains: {}
        };

        // ==========================
        // State
        // ==========================
        var selectedDomain = null;
        var currentQuestion = 0;
        var answerScores = []; // stores score (0-3) for each question

        // ==========================
        // DOM
        // ==========================
        var introEl = document.getElementById('intro');
        var domainSectionEl = document.getElementById('domain-section');
        var questionsSectionEl = document.getElementById('questions-section');
        var resultsSectionEl = document.getElementById('results-section');
        var progressEl = document.getElementById('progress');
        var questionAreaEl = document.getElementById('question-area');
        var startButton = document.getElementById('start-button');
        var domainGridEl = document.getElementById('domain-grid');

        // ==========================
        // Tracking
        // ==========================
        function track(event, data) {
            if (typeof umami !== 'undefined') umami.track(event, data);
        }

        // ==========================
        // URL decode — check for shared link
        // ==========================
        function checkForResults() {
            var params = new URLSearchParams(window.location.search);
            var d = params.get('d');
            var r = params.get('r');

            if (d && r && r.length === 5) {
                // Validate domain
                var validDomain = domains.some(function(dom) { return dom.key === d; });
                if (!validDomain) return false;

                // Validate scores
                var scores = r.split('').map(function(c) { return parseInt(c, 10); });
                if (scores.some(function(s) { return isNaN(s) || s < 0 || s > 3; })) return false;

                selectedDomain = d;
                answerScores = scores;
                showResults();
                return true;
            }
            return false;
        }

        // ==========================
        // Init
        // ==========================
        function init() {
            if (checkForResults()) return;
            startButton.addEventListener('click', startQuiz);
            buildDomainGrid();
        }

        function startQuiz() {
            track('quiz-start');
            introEl.style.display = 'none';
            domainSectionEl.classList.add('visible');
            window.scrollTo(0, 0);
        }

        // ==========================
        // Domain Selection
        // ==========================
        function buildDomainGrid() {
            domainGridEl.innerHTML = '';
            domains.forEach(function(dom) {
                var card = document.createElement('div');
                card.className = 'domain-card';
                card.textContent = dom.label;
                card.dataset.key = dom.key;
                card.addEventListener('click', function() {
                    selectDomain(dom.key, card);
                });
                domainGridEl.appendChild(card);
            });
        }

        function selectDomain(key, cardEl) {
            selectedDomain = key;
            track('domain-selected', { domain: key });

            // Highlight selected
            var cards = domainGridEl.querySelectorAll('.domain-card');
            cards.forEach(function(c) { c.classList.remove('selected'); });
            cardEl.classList.add('selected');

            setTimeout(function() {
                domainSectionEl.classList.remove('visible');
                domainSectionEl.style.display = 'none';
                questionsSectionEl.classList.add('visible');
                buildProgress();
                showQuestion(0);
                window.scrollTo(0, 0);
            }, 300);
        }

        // ==========================
        // Progress Dots (5 for questions)
        // ==========================
        function buildProgress() {
            progressEl.innerHTML = '';
            for (var i = 0; i < questions.length; i++) {
                var dot = document.createElement('div');
                dot.className = 'progress-dot';
                progressEl.appendChild(dot);
            }
        }

        function updateProgress(index) {
            var dots = progressEl.querySelectorAll('.progress-dot');
            dots.forEach(function(dot, i) {
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
            var q = questions[index];

            var slide = document.createElement('div');
            slide.className = 'question-slide';
            slide.innerHTML =
                '<div class="question-number">Question ' + q.number + ' of ' + questions.length + '</div>' +
                '<div class="question-text">' + q.text + '</div>' +
                '<div class="answers">' +
                    q.answers.map(function(a, i) {
                        return '<div class="answer-card" data-index="' + i + '" data-score="' + a.score + '">' + a.label + '</div>';
                    }).join('') +
                '</div>';

            // Clean up old exiting slides
            questionAreaEl.querySelectorAll('.exiting').forEach(function(el) { el.remove(); });

            var currentActive = questionAreaEl.querySelector('.active');
            if (currentActive) {
                currentActive.classList.remove('active');
                currentActive.classList.add('exiting');
                setTimeout(function() { currentActive.remove(); }, 400);
            }

            questionAreaEl.appendChild(slide);

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    slide.classList.add('active');
                });
            });

            slide.querySelectorAll('.answer-card').forEach(function(card) {
                card.addEventListener('click', function() {
                    selectAnswer(parseInt(this.dataset.index), parseInt(this.dataset.score));
                });
            });
        }

        function selectAnswer(answerIndex, score) {
            answerScores[currentQuestion] = score;
            track('q' + (currentQuestion + 1) + '-answer', { score: score });

            var cards = questionAreaEl.querySelectorAll('.active .answer-card');
            cards.forEach(function(c) { c.classList.remove('selected'); });
            cards[answerIndex].classList.add('selected');

            setTimeout(function() {
                if (currentQuestion < questions.length - 1) {
                    showQuestion(currentQuestion + 1);
                } else {
                    finishQuiz();
                }
            }, 300);
        }

        // ==========================
        // Finish & encode URL
        // ==========================
        function finishQuiz() {
            questionsSectionEl.classList.remove('visible');

            var encoded = answerScores.join('');
            var url = new URL(window.location);
            url.searchParams.set('d', selectedDomain);
            url.searchParams.set('r', encoded);
            history.replaceState(null, '', url);

            var total = answerScores.reduce(function(a, b) { return a + b; }, 0);
            track('quiz-complete', {
                domain: selectedDomain,
                total: total,
                scores: encoded
            });

            showResults();
        }

        // ==========================
        // Results
        // ==========================
        function showResults() {
            introEl.style.display = 'none';
            domainSectionEl.style.display = 'none';
            questionsSectionEl.classList.remove('visible');
            resultsSectionEl.classList.add('visible');

            var total = answerScores.reduce(function(a, b) { return a + b; }, 0);
            var profile = getProfile(total);

            // Header
            document.getElementById('results-profile-name').textContent = profile.name;
            document.getElementById('results-score').textContent = total + ' / 15';

            // Domain subtitle
            var domainLabel = '';
            domains.forEach(function(d) {
                if (d.key === selectedDomain) domainLabel = d.label;
            });
            document.getElementById('results-subtitle').textContent = domainLabel;

            // Radar chart
            drawRadarChart();

            // Benchmark bars
            renderBenchmarks();

            // Profile description
            var description = profile.description;
            if (profile.key === 'infrastructureGap') {
                var gapInfo = getLowestIngredient();
                description = description.replace('{gap}', gapInfo.name);
            }
            document.getElementById('profile-copy').innerHTML =
                '<div class="profile-body"><p>' + description + '</p></div>';

            // Key insight
            renderInsight();

            // Crowd comparison
            renderCrowd();

            // CTA tracking
            document.getElementById('cta-dm').addEventListener('click', function() {
                track('cta-click-dm');
            });
            document.getElementById('cta-article').addEventListener('click', function() {
                track('cta-click-article');
            });

            // Share
            document.getElementById('share-button').addEventListener('click', copyShareLink);

            // Feedback meter
            initFeedback();

            window.scrollTo(0, 0);
        }

        function initFeedback() {
            var meter = document.getElementById('feedback-meter');
            var btnUp = document.getElementById('feedback-up');
            var btnDown = document.getElementById('feedback-down');
            var thanks = document.getElementById('feedback-thanks');

            function vote(value) {
                track('feedback', { quiz: 'readiness', value: value, domain: selectedDomain });
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
        }

        function getProfile(total) {
            if (total >= 12) return { key: 'agentReady', name: profiles.agentReady.name, description: profiles.agentReady.description };
            if (total >= 8) return { key: 'infrastructureGap', name: profiles.infrastructureGap.name, description: profiles.infrastructureGap.description };
            if (total >= 4) return { key: 'verificationDesert', name: profiles.verificationDesert.name, description: profiles.verificationDesert.description };
            return { key: 'preAgent', name: profiles.preAgent.name, description: profiles.preAgent.description };
        }

        function getLowestIngredient() {
            var minScore = 4;
            var minIndex = 0;
            for (var i = 0; i < answerScores.length; i++) {
                if (answerScores[i] < minScore) {
                    minScore = answerScores[i];
                    minIndex = i;
                }
            }
            return {
                name: questions[minIndex].ingredient,
                index: minIndex,
                score: minScore
            };
        }

        // ==========================
        // Key Insight
        // ==========================
        function renderInsight() {
            var el = document.getElementById('shareable-insight-text');
            var allMax = answerScores.every(function(s) { return s === 3; });

            if (allMax) {
                el.innerHTML = 'You matched the coding benchmark on every dimension. Your domain is structurally ready.';
                return;
            }

            var gap = getLowestIngredient();
            var solution = ingredientSolutions[gap.name];
            el.innerHTML = 'Your biggest gap vs. coding: <strong>' + gap.name + '</strong>. In software, this was solved by <strong>' + solution + '</strong>. What\u2019s the equivalent in your domain?';
        }

        // ==========================
        // Radar Chart (Canvas)
        // ==========================
        function drawRadarChart() {
            var canvas = document.getElementById('radar-canvas');
            var ctx = canvas.getContext('2d');

            // High-DPI support
            var dpr = window.devicePixelRatio || 1;
            var displaySize = 360;
            canvas.style.width = displaySize + 'px';
            canvas.style.height = displaySize + 'px';
            canvas.width = displaySize * dpr;
            canvas.height = displaySize * dpr;
            ctx.scale(dpr, dpr);

            var cx = displaySize / 2;
            var cy = displaySize / 2;
            var maxRadius = 120;
            var levels = 3; // 0, 1, 2, 3 — but 0 is center
            var axes = 5;
            var angleStep = (2 * Math.PI) / axes;
            var startAngle = -Math.PI / 2; // Start from top

            var axisLabels = [
                'Verification\nSpeed',
                'Tool\nAccess',
                'Iteration\nSafety',
                'Success\nClarity',
                'Practitioner\nEcosystem'
            ];

            ctx.clearRect(0, 0, displaySize, displaySize);

            // Draw grid levels
            for (var level = 1; level <= levels; level++) {
                var r = (level / levels) * maxRadius;
                ctx.beginPath();
                for (var i = 0; i <= axes; i++) {
                    var angle = startAngle + i * angleStep;
                    var x = cx + r * Math.cos(angle);
                    var y = cy + r * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw axis lines
            for (var i = 0; i < axes; i++) {
                var angle = startAngle + i * angleStep;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + maxRadius * Math.cos(angle), cy + maxRadius * Math.sin(angle));
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw coding benchmark (all 3s) — white dashed
            ctx.beginPath();
            for (var i = 0; i <= axes; i++) {
                var idx = i % axes;
                var angle = startAngle + idx * angleStep;
                var r = (3 / levels) * maxRadius;
                var x = cx + r * Math.cos(angle);
                var y = cy + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.setLineDash([6, 4]);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw user scores — orange filled
            ctx.beginPath();
            for (var i = 0; i <= axes; i++) {
                var idx = i % axes;
                var angle = startAngle + idx * angleStep;
                var score = answerScores[idx] || 0;
                var r = Math.max((score / levels) * maxRadius, 4);
                var x = cx + r * Math.cos(angle);
                var y = cy + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 107, 53, 0.25)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 107, 53, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw score dots
            for (var i = 0; i < axes; i++) {
                var angle = startAngle + i * angleStep;
                var score = answerScores[i] || 0;
                var r = Math.max((score / levels) * maxRadius, 4);
                var x = cx + r * Math.cos(angle);
                var y = cy + r * Math.sin(angle);
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fillStyle = '#ff6b35';
                ctx.fill();
            }

            // Draw axis labels
            ctx.fillStyle = '#b3b3b3';
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            var labelOffset = 28;
            for (var i = 0; i < axes; i++) {
                var angle = startAngle + i * angleStep;
                var lx = cx + (maxRadius + labelOffset) * Math.cos(angle);
                var ly = cy + (maxRadius + labelOffset) * Math.sin(angle);

                var lines = axisLabels[i].split('\n');
                var lineHeight = 14;
                var totalHeight = lines.length * lineHeight;
                var startY = ly - (totalHeight / 2) + lineHeight / 2;

                // Adjust position for labels at extremes
                if (angle === startAngle) {
                    // Top label — move up more
                    startY = ly - totalHeight + 4;
                }

                for (var j = 0; j < lines.length; j++) {
                    ctx.fillText(lines[j], lx, startY + j * lineHeight);
                }
            }
        }

        // ==========================
        // Benchmark Bars
        // ==========================
        function renderBenchmarks() {
            var section = document.getElementById('benchmark-section');
            var maxPsd = 4.6; // coding

            var html = '<div class="benchmark-title">Practitioner Signal Density</div>';
            html += '<div class="benchmark-subtitle">How much real deployment evidence exists per domain (per-query score from our Q1 2026 continuous research program across 9 domain tracks)</div>';

            benchmarkOrder.forEach(function(key) {
                var b = benchmarks[key];
                var pct = (b.psd / maxPsd) * 100;
                var isSelected = key === selectedDomain;

                html += '<div class="benchmark-row">';
                html += '<div class="benchmark-label">' + b.label + '</div>';
                html += '<div class="benchmark-bar-track">';
                html += '<div class="benchmark-bar-fill ' + (isSelected ? 'highlighted' : 'muted') + '" style="width: ' + pct + '%"></div>';
                html += '</div>';
                html += '<div class="benchmark-value">' + b.psd.toFixed(1) + '</div>';
                html += '<div class="benchmark-you">' + (isSelected ? '\u2190 you' : '') + '</div>';
                html += '</div>';
            });

            section.innerHTML = html;
        }

        // ==========================
        // Crowd Comparison
        //
        // Shows aggregate response data once enough responses accumulate.
        // Requires crowdData.totalResponses >= 10 AND data for the selected
        // domain. Until then, shows an empty state encouraging sharing.
        //
        // To populate: update crowdData.domains[key] with per-question
        // score distributions as [score0count, score1count, score2count, score3count].
        // ==========================
        function renderCrowd() {
            var section = document.getElementById('crowd-section');

            var domainCrowdData = crowdData.domains[selectedDomain];
            var hasCrowdData = domainCrowdData && crowdData.totalResponses >= 10;

            if (hasCrowdData) {
                var crowdHtml = '<div class="crowd-section">' +
                    '<h3>How others in your domain answered</h3>' +
                    '<div class="crowd-data">' +
                    '<p>' + crowdData.totalResponses + ' responses so far (last updated: ' + crowdData.lastUpdated + ')</p>';

                questions.forEach(function(q, i) {
                    var dist = domainCrowdData[i];
                    if (!dist) return;
                    var total = dist[0] + dist[1] + dist[2] + dist[3];
                    if (total === 0) return;
                    var avgScore = ((dist[1] + dist[2] * 2 + dist[3] * 3) / total).toFixed(1);
                    crowdHtml += '<div class="crowd-row">' +
                        '<span class="crowd-ingredient">' + q.ingredient + '</span>' +
                        '<span class="crowd-avg">avg ' + avgScore + '/3</span>' +
                        '<span class="crowd-yours">(you: ' + (answerScores[i] || 0) + ')</span>' +
                        '</div>';
                });

                crowdHtml += '</div></div>';
                section.innerHTML = crowdHtml;
            } else {
                section.innerHTML =
                    '<div class="crowd-section">' +
                        '<h3>How others in your domain answered</h3>' +
                        '<div class="crowd-empty">' +
                            'Not enough responses yet. Share your link and come back to see how others answered.' +
                        '</div>' +
                    '</div>';
            }
        }

        // ==========================
        // Share
        // ==========================
        function copyShareLink() {
            track('share-click');
            var url = window.location.href;
            navigator.clipboard.writeText(url).then(function() {
                document.getElementById('share-copied').style.display = 'block';
                setTimeout(function() {
                    document.getElementById('share-copied').style.display = 'none';
                }, 3000);
            });
        }

        // ==========================
        // Responsive radar redraw
        // ==========================
        var resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                if (resultsSectionEl.classList.contains('visible')) {
                    drawRadarChart();
                }
            }, 200);
        });

        // ==========================
        // Start
        // ==========================
        init();
    })();