// กำหนดรหัสผ่านหลัก
const CORRECT_PASSWORD = 'goodwork';

function checkPassword() {
    const password = document.getElementById('password-input').value;
    const rememberMe = document.getElementById('remember-me').checked;

    if (password === CORRECT_PASSWORD) {
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
    
    // ตั้งค่าเริ่มต้นให้แสดงหมวด Common
    filterTools('common');
    
    const allButtons = document.querySelectorAll('.nav-btn:not(.logout)');
    allButtons.forEach(btn => {
        btn.classList.remove('hidden');
    });
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

// จัดการ Theme (Light / Dark / Auto)
function setTheme(theme) {
    const html = document.documentElement;
    const buttons = document.querySelectorAll('.theme-btn');
    
    // ลบ class active ออกจากทุกปุ่ม
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (theme === 'auto') {
        localStorage.removeItem('gw_hub_theme');
        document.getElementById('theme-auto').classList.add('active');
        applyAutoTheme();
    } else {
        localStorage.setItem('gw_hub_theme', theme);
        html.setAttribute('data-theme', theme);
        document.getElementById('theme-' + theme).classList.add('active');
    }
}

function applyAutoTheme() {
    const savedTheme = localStorage.getItem('gw_hub_theme');
    if (!savedTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        setTheme(savedTheme);
    }
}

// ตรวจสอบการเปลี่ยนของระบบ (System Theme Change)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('gw_hub_theme')) {
        applyAutoTheme();
    }
});

// ตรวจสอบ Memory เมื่อโหลดหน้าเว็บ
window.onload = function() {
    applyAutoTheme();
    
    const isAuth = localStorage.getItem('gw_hub_auth');
    if (isAuth === 'true') {
        showMainContent();
    }
};
                                       
// ให้กด Enter ได้ที่ช่อง Password
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

    // 2. Filter sections
    const sections = document.querySelectorAll('.category-section');
    sections.forEach(s => {
        if (s.id === 'section-' + category) {
            s.style.display = 'block';
        } else {
            s.style.display = 'none';
        }
    });
    
    // 3. Scroll to top of the content area
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
