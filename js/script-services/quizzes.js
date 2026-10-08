/* ============================================================
   صندوق اتحاد - مسابقات
   نسخه: 2.0
   ============================================================ */

function openQuizzes() {
    var overlay = document.createElement('div');
    overlay.id = 'quizOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:99999;padding:15px';

    var modal = document.createElement('div');
    modal.style.cssText = 'background:linear-gradient(160deg,#1e1e35,#151528);border:1px solid rgba(255,215,0,.3);border-radius:22px;padding:24px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;text-align:center;font-family:tahoma;color:#fff';

    modal.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
        '<h2 style="color:#ffd700;font-size:1.1rem;margin:0">🏆 مسابقات</h2>' +
        '<button onclick="document.getElementById(\'quizOverlay\').remove()" style="background:none;border:none;color:#ff6b6b;font-size:1.3rem;cursor:pointer">✕</button>' +
        '</div>' +
        '<div id="quizContent"><div style="color:rgba(255,255,255,.5);padding:20px">در حال بارگذاری...</div></div>';

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    loadQuizList();
}

function loadQuizList() {
    var quizSource = (window.__scriptServicesCache && window.__scriptServicesCache.loaded)
        ? Promise.resolve({quizzes: window.__scriptServicesCache.quizzes || []})
        : fetch(ADMIN_URL + '?action=getQuizzes').then(function(r){ return r.json(); });
    quizSource.then(function(d){
        var quizzes = (d.quizzes || []).filter(function(q){ return q.active; });
        var today = new Date().toISOString().split('T')[0];

        var html = '';
        if (quizzes.length === 0) {
            html = '<div style="color:rgba(255,255,255,.5);padding:30px">🏆 فعلاً مسابقه‌ای فعال نیست</div>';
        } else {
            quizzes.forEach(function(q){
                var isExpired = q.endDate && q.endDate < today;
                var isNotStarted = q.startDate && q.startDate > today;

                if (isExpired) {
                    html += '<div style="background:rgba(255,255,255,.03);border-radius:14px;padding:16px;margin-bottom:10px;opacity:.5"><b style="color:#ffd700">' + q.title + '</b><br><small style="color:#ff6b6b">⏰ پایان یافته</small></div>';
                } else if (isNotStarted) {
                    html += '<div style="background:rgba(255,255,255,.03);border-radius:14px;padding:16px;margin-bottom:10px;opacity:.5"><b style="color:#ffd700">' + q.title + '</b><br><small style="color:#f59e0b">⏳ شروع از ' + q.startDate + '</small></div>';
                } else {
                    html += '<div onclick="startQuiz(\'' + q.id + '\')" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,215,0,.2);border-radius:14px;padding:16px;margin-bottom:10px;cursor:pointer">' +
                        '<b style="color:#ffd700">' + q.title + '</b><br>' +
                        '<small style="color:rgba(255,255,255,.6)">' + q.questions.length + ' سوال | ⭐ ' + q.questions.length + ' امتیاز</small><br>' +
                        '<small style="color:#22c55e">✅ فعال - کلیک کن برای شرکت</small></div>';
                }
            });
        }

        document.getElementById('quizContent').innerHTML = html;
    }).catch(function(){
        document.getElementById('quizContent').innerHTML = '<div style="color:#ff6b6b;padding:20px">❌ خطا در دریافت مسابقات</div>';
    });
}

function startQuiz(quizId) {
    fetch(ADMIN_URL + '?action=getQuizzes').then(function(r){ return r.json(); }).then(function(d){
        var quiz = null;
        (d.quizzes || []).forEach(function(q){ if(q.id === quizId) quiz = q; });
        if (!quiz) { alert('مسابقه پیدا نشد'); return; }
        var participated = localStorage.getItem('quiz_done_' + quizId + '_' + currentUser.memberId);
        if (participated) { alert('⚠️ شما قبلاً در این مسابقه شرکت کرده‌اید'); return; }

        window.currentQuiz = quiz;
        window.currentQuestionIdx = 0;
        window.userAnswers = [];
        window.quizScore = 0;
        showQuestion();
    });
}

function showQuestion() {
    var quiz = window.currentQuiz;
    var idx = window.currentQuestionIdx;
    var q = quiz.questions[idx];
    var total = quiz.questions.length;
    var progress = ((idx) / total) * 100;

    var html = '<div style="height:6px;background:rgba(255,255,255,.1);border-radius:99px;margin-bottom:18px;overflow:hidden">' +
        '<div style="height:100%;width:' + progress + '%;background:linear-gradient(90deg,#ffd700,#ff9d00);border-radius:99px;transition:width .3s"></div></div>';
    html += '<div style="color:rgba(255,255,255,.5);font-size:.8rem;margin-bottom:8px">سوال ' + (idx+1) + ' از ' + total + '</div>';
    html += '<div style="font-size:1rem;font-weight:700;margin-bottom:18px;line-height:1.8;color:#fff">' + q.text + '</div>';

    var optLabels = ['الف', 'ب', 'ج', 'د'];
    q.options.forEach(function(opt, oi){
        if (opt && opt.trim()) {
            html += '<button onclick="selectAnswer(' + oi + ')" style="display:block;width:100%;padding:14px;margin-bottom:10px;background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.1);border-radius:12px;color:#fff;cursor:pointer;text-align:right;font-size:.9rem;font-family:tahoma">' +
                '<b style="color:#ffd700;margin-left:8px">' + optLabels[oi] + ')</b> ' + opt + '</button>';
        }
    });

    document.getElementById('quizContent').innerHTML = html;
}

function selectAnswer(optIdx) {
    var quiz = window.currentQuiz;
    var idx = window.currentQuestionIdx;
    var q = quiz.questions[idx];
    window.userAnswers.push(optIdx);
    if (optIdx === q.correctIndex) window.quizScore += (q.points || 1);
    window.currentQuestionIdx++;
    if (window.currentQuestionIdx < quiz.questions.length) showQuestion();
    else finishQuiz();
}

function finishQuiz() {
    var quiz = window.currentQuiz;
    var score = window.quizScore;
    var total = quiz.questions.length;

    fetch(ADMIN_URL + '?action=submitQuizAnswer&quizId=' + encodeURIComponent(quiz.id) +
          '&user=' + encodeURIComponent(currentUser.memberId) +
          '&name=' + encodeURIComponent('حساب ' + currentUser.username + ' (عضو ' + currentUser.memberId + ')') +
          '&answers=' + encodeURIComponent(JSON.stringify(window.userAnswers)) +
          '&score=' + score +
          '&maxScore=' + total).then(function(r){ return r.json(); }).then(function(d){
        localStorage.setItem('quiz_done_' + quiz.id + '_' + currentUser.memberId, 'true');
        awardCompetitionPoints(quiz.id, score);

        var percent = Math.round((score / total) * 100);
        var emoji = percent >= 80 ? '🏆' : percent >= 60 ? '🎉' : percent >= 40 ? '👍' : '💪';

        var html = '<div style="padding:20px;text-align:center">' +
            '<div style="font-size:4rem;margin-bottom:10px">' + emoji + '</div>' +
            '<h2 style="color:#ffd700;margin-bottom:10px">مسابقه تمام شد!</h2>' +
            '<div style="font-size:2.5rem;font-weight:900;color:#22c55e;margin-bottom:8px">' + score + ' از ' + total + '</div>' +
            '<div style="color:rgba(255,255,255,.6);margin-bottom:16px">⭐ ' + score + ' امتیاز به حساب شما اضافه شد</div>' +
            '<div style="background:rgba(255,255,255,.05);border-radius:12px;padding:12px;margin-bottom:16px">' +
            '<div style="color:rgba(255,255,255,.5);font-size:.8rem">درصد موفقیت</div>' +
            '<div style="font-size:1.5rem;font-weight:900;color:#ffd700">' + percent + '%</div></div>' +
            '<button onclick="document.getElementById(\'quizOverlay\').remove()" style="width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#ffd700,#ff9d00);color:#1a1a2e;font-weight:900;cursor:pointer;font-size:1rem;font-family:tahoma">✅ بستن</button></div>';

        document.getElementById('quizContent').innerHTML = html;
    }).catch(function(){
        alert('❌ خطا در ثبت پاسخ');
    });
}
