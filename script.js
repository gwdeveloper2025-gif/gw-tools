function checkPassword() {
    const password = document.getElementById('password-input').value;
    const rememberMe = document.getElementById('remember-me').checked;
    const correctPassword = 'goodwork';

    if (password === correctPassword) {
        // ถ้าติ๊ก Remember Me ถึงจะบันทึกลง localStorage
        if (rememberMe) {
            localStorage.setItem('gw_hub_auth', 'true');
        }
        showMainContent();
    } else {
        showAlert();
        document.getElementById('password-input').value = '';
    }
}

function showAlert() {
    document.getElementById('custom-alert').classList.remove('hidden');
}

function closeAlert() {
    document.getElementById('custom-alert').classList.add('hidden');
    document.getElementById('password-input').focus();
}

function showMainContent() {
    document.getElementById('login-overlay').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
}

function logout() {
    document.getElementById('logout-confirm').classList.remove('hidden');
}

function closeLogoutConfirm() {
    document.getElementById('logout-confirm').classList.add('hidden');
}

function confirmLogout() {
    localStorage.removeItem('gw_hub_auth');
    location.reload();
}

// ตรวจสอบ Memory เมื่อโหลดหน้าเว็บ
window.onload = function() {
    const isAuth = localStorage.getItem('gw_hub_auth');
    if (isAuth === 'true') {
        showMainContent();
    }
};

// ให้กด Enter ได้
document.getElementById('password-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

function filterTools(category) {
    // 1. Update button states
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(b => b.classList.remove('active'));
    
    const activeBtn = document.getElementById('btn-' + category);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // 2. Filter sections with logic that works better inside an iframe
    const sections = document.querySelectorAll('.category-section');
    if (category === 'all') {
        sections.forEach(s => {
            s.style.display = 'block';
        });
    } else {
        sections.forEach(s => {
            if (s.id === 'section-' + category) {
                s.style.display = 'block';
            } else {
                s.style.display = 'none';
            }
        });
    }
    
    // 3. Scroll to top of the content area
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
