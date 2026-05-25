// GW Tools Hub - Core Logic v1.5.0
const DEFAULT_PASSWORD = 'goodwork';

const INITIAL_USERS = {
    'great': { role: 'CEO', allowed: ['common', 'bd', 'project', 'marketing'] },
    'admin': { role: 'Administrator', allowed: ['common', 'bd', 'project', 'marketing'] },
    'Nuss': { role: 'sale', allowed: ['common', 'bd'] },
    'Tang': { role: 'BD', allowed: ['common', 'bd'] },
    'Yo': { role: 'marketing', allowed: ['common', 'marketing'] },
    'Bill': { role: 'BD&marketing', allowed: ['common', 'bd', 'marketing'] }
};

const ADMINS = ['great', 'admin'];

// Initialize or get users from localStorage
function getUsers() {
    let users = localStorage.getItem('gw_hub_users');
    if (!users) {
        localStorage.setItem('gw_hub_users', JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
    }
    return JSON.parse(users);
}

// Initialize or get passwords from localStorage
function getPasswords() {
    let passwords = localStorage.getItem('gw_hub_passwords');
    if (!passwords) {
        passwords = {};
        const users = getUsers();
        Object.keys(users).forEach(user => {
            if (user === 'admin') {
                passwords[user] = 'admin';
            } else {
                passwords[user] = DEFAULT_PASSWORD;
            }
        });
        localStorage.setItem('gw_hub_passwords', JSON.stringify(passwords));
        return passwords;
    }
    return JSON.parse(passwords);
}

function checkPassword() {
    const username = document.getElementById('username-input').value.trim();
    const password = document.getElementById('password-input').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    const users = getUsers();
    const passwords = getPasswords();

    if (users[username] && passwords[username] === password) {
        if (rememberMe) {
            localStorage.setItem('gw_hub_auth', 'true');
            localStorage.setItem('gw_hub_user', username);
        }
        sessionStorage.setItem('gw_hub_current_user', username);
        showMainContent(username);
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

function showMainContent(username) {
    const users = getUsers();
    const user = users[username];
    if (!user) return logout();

    document.getElementById('login-overlay').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');

    // Admin UI check
    if (ADMINS.includes(username)) {
        document.getElementById('admin-mgmt-btn').classList.remove('hidden');
    } else {
        document.getElementById('admin-mgmt-btn').classList.add('hidden');
    }

    // Filter Navigation Buttons
    const navButtons = document.querySelectorAll('.nav-btn:not(.logout)');
    navButtons.forEach(btn => {
        const category = btn.id.replace('btn-', '');
        if (category === 'common' || (user.allowed && user.allowed.includes(category))) {
            btn.classList.remove('hidden');
        } else if (btn.id.startsWith('btn-')) {
            btn.classList.add('hidden');
        }
    });

    // Default to first allowed category
    filterTools(user.allowed[0]);
}

function logout() {
    document.getElementById('logout-confirm').classList.remove('hidden');
}

function closeLogoutConfirm() {
    document.getElementById('logout-confirm').classList.add('hidden');
}

function confirmLogout() {
    localStorage.removeItem('gw_hub_auth');
    localStorage.removeItem('gw_hub_user');
    sessionStorage.removeItem('gw_hub_current_user');
    location.reload();
}

// User Management Functions
function openUserMgmtModal() {
    renderUserList();
    document.getElementById('user-mgmt-modal').classList.remove('hidden');
}

function closeUserMgmtModal() {
    document.getElementById('user-mgmt-modal').classList.add('hidden');
}

function renderUserList() {
    const users = getUsers();
    const listContainer = document.getElementById('user-list');
    listContainer.innerHTML = '';
    
    Object.keys(users).forEach(username => {
        const u = users[username];
        const userDiv = document.createElement('div');
        userDiv.style.display = 'flex';
        userDiv.style.justifyContent = 'space-between';
        userDiv.style.alignItems = 'center';
        userDiv.style.padding = '8px';
        userDiv.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        
        userDiv.innerHTML = `
            <div>
                <strong style="color: var(--primary-color)">${username}</strong> 
                <span style="font-size: 0.8rem; color: var(--text-muted)">(${u.role})</span>
            </div>
            ${!ADMINS.includes(username) ? `<button onclick="deleteUser('${username}')" style="background: #ef4444; width: auto; padding: 4px 8px; font-size: 0.7rem; border-radius: 6px;">ลบ</button>` : '<span style="font-size: 0.7rem; color: var(--text-muted)">Admin</span>'}
        `;
        listContainer.appendChild(userDiv);
    });
}

function addNewUser() {
    const username = document.getElementById('new-username').value.trim();
    const role = document.getElementById('new-role').value.trim();
    const categories = Array.from(document.querySelectorAll('.cat-access:checked')).map(cb => cb.value);

    if (!username || !role) {
        alert('กรุณากรอกชื่อและตำแหน่ง');
        return;
    }

    const users = getUsers();
    if (users[username]) {
        alert('มีชื่อผู้ใช้นี้อยู่ในระบบแล้ว');
        return;
    }

    users[username] = { role: role, allowed: categories };
    localStorage.setItem('gw_hub_users', JSON.stringify(users));

    // Initialize password
    const passwords = getPasswords();
    passwords[username] = DEFAULT_PASSWORD;
    localStorage.setItem('gw_hub_passwords', JSON.stringify(passwords));

    // Clear form
    document.getElementById('new-username').value = '';
    document.getElementById('new-role').value = '';
    
    renderUserList();
    alert(`เพิ่มพนักงาน ${username} เรียบร้อยแล้ว! (รหัสผ่านเริ่มต้น: ${DEFAULT_PASSWORD})`);
}

function deleteUser(username) {
    if (ADMINS.includes(username)) return;
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบพนักงาน ${username}?`)) return;

    const users = getUsers();
    delete users[username];
    localStorage.setItem('gw_hub_users', JSON.stringify(users));

    const passwords = getPasswords();
    delete passwords[username];
    localStorage.setItem('gw_hub_passwords', JSON.stringify(passwords));

    renderUserList();
}

// Password Change Functions
function openChangePasswordModal() {
    const currentUser = sessionStorage.getItem('gw_hub_current_user') || localStorage.getItem('gw_hub_user');
    document.getElementById('pw-user-display').innerText = `User: ${currentUser}`;
    document.getElementById('password-modal').classList.remove('hidden');
}

function closeChangePasswordModal() {
    document.getElementById('password-modal').classList.add('hidden');
    document.getElementById('current-pw').value = '';
    document.getElementById('new-pw').value = '';
    document.getElementById('confirm-pw').value = '';
}

function submitChangePassword() {
    const currentUser = sessionStorage.getItem('gw_hub_current_user') || localStorage.getItem('gw_hub_user');
    const currentInput = document.getElementById('current-pw').value;
    const newInput = document.getElementById('new-pw').value;
    const confirmInput = document.getElementById('confirm-pw').value;

    const passwords = getPasswords();

    if (currentInput !== passwords[currentUser]) {
        alert('รหัสผ่านปัจจุบันไม่ถูกต้อง');
        return;
    }

    if (newInput === '') {
        alert('กรุณากรอกรหัสผ่านใหม่');
        return;
    }

    if (newInput !== confirmInput) {
        alert('รหัสผ่านใหม่ไม่ตรงกัน');
        return;
    }

    passwords[currentUser] = newInput;
    localStorage.setItem('gw_hub_passwords', JSON.stringify(passwords));
    alert('เปลี่ยนรหัสผ่านสำเร็จแล้ว!');
    closeChangePasswordModal();
}

function toggleThemeDropdown() {
    document.getElementById('theme-dropdown').classList.toggle('show');
}

function setTheme(theme) {
    const html = document.documentElement;
    const buttons = document.querySelectorAll('.theme-dropdown-content button');
    const themeIcon = document.getElementById('current-theme-icon');
    const themeText = document.getElementById('current-theme-text');
    buttons.forEach(btn => btn.classList.remove('active'));
    const themeData = {
        'light': { icon: '☀️', text: 'Light' },
        'dark': { icon: '🌙', text: 'Dark' },
        'auto': { icon: '💻', text: 'Auto' }
    };
    if (themeIcon) themeIcon.innerText = themeData[theme].icon;
    if (themeText) themeText.innerText = themeData[theme].text;
    const activeBtn = document.getElementById('theme-' + theme);
    if (activeBtn) activeBtn.classList.add('active');
    if (theme === 'auto') {
        localStorage.removeItem('gw_hub_theme');
        applyAutoTheme();
    } else {
        localStorage.setItem('gw_hub_theme', theme);
        html.setAttribute('data-theme', theme);
    }
    document.getElementById('theme-dropdown').classList.remove('show');
}

window.onclick = function(event) {
    if (!event.target.closest('.theme-dropdown')) {
        const dropdowns = document.getElementsByClassName("theme-dropdown");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function applyAutoTheme() {
    const savedTheme = localStorage.getItem('gw_hub_theme');
    if (!savedTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        const iconEl = document.getElementById('current-theme-icon');
        const textEl = document.getElementById('current-theme-text');
        if (iconEl) iconEl.innerText = '💻';
        if (textEl) textEl.innerText = 'Auto';
        document.querySelectorAll('.theme-dropdown-content button').forEach(b => b.classList.remove('active'));
        const autoBtn = document.getElementById('theme-auto');
        if (autoBtn) autoBtn.classList.add('active');
    } else {
        setTheme(savedTheme);
    }
}

window.onload = function() {
    applyAutoTheme();
    const isAuth = localStorage.getItem('gw_hub_auth');
    const savedUser = localStorage.getItem('gw_hub_user');
    const users = getUsers();
    if (isAuth === 'true' && savedUser && users[savedUser]) {
        showMainContent(savedUser);
    }
};

// Handle Enter keys
document.getElementById('username-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') document.getElementById('password-input').focus();
});

document.getElementById('password-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') checkPassword();
});

function filterTools(category) {
    const currentUser = sessionStorage.getItem('gw_hub_current_user') || localStorage.getItem('gw_hub_user');
    const users = getUsers();
    const user = users[currentUser];
    
    if (user && !user.allowed.includes(category)) {
        return filterTools(user.allowed[0]);
    }

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + category);
    if (activeBtn) activeBtn.classList.add('active');

    const sections = document.querySelectorAll('.category-section');
    sections.forEach(s => {
        s.style.display = (s.id === 'section-' + category) ? 'block' : 'none';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
