// GW Tools Hub - Core Logic v1.7.0 (Secure Edition)
const VERSION = '1.7.0';
const DEFAULT_PASSWORD = 'goodwork';

// Security Utility: SHA-256 Hashing
async function hashPassword(password) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check for version update and clear cache if needed
const savedVersion = localStorage.getItem('gw_hub_version');
if (savedVersion !== VERSION) {
    localStorage.removeItem('gw_hub_users');
    localStorage.removeItem('gw_hub_tools');
    localStorage.removeItem('gw_hub_passwords');
    localStorage.setItem('gw_hub_version', VERSION);
    console.log('System updated to v' + VERSION + '. Local data reset for security.');
}

const INITIAL_USERS = {
    'great': { role: 'CEO', allowed: ['common', 'bd', 'project', 'marketing'] },
    'admin': { role: 'Administrator', allowed: ['common', 'bd', 'project', 'marketing'] },
    'Nuss': { role: 'sale', allowed: ['common', 'bd'] },
    'Tang': { role: 'BD', allowed: ['common', 'bd'] },
    'Yo': { role: 'marketing', allowed: ['common', 'marketing'] },
    'Bill': { role: 'BD&marketing', allowed: ['common', 'bd', 'marketing'] }
};

const INITIAL_TOOLS = [
    { id: 1, category: 'common', title: 'Chat GPT', url: 'https://chatgpt.com/', desc: 'ผู้ช่วยอัจฉริยะสำหรับหาข้อมูล เขียนบทความ และแก้ปัญหาด่วน', img: 'chatgpt.img.svg', dept: 'Common (ทุกแผนก)', btn: 'คุยกับ ChatGPT' },
    { id: 2, category: 'common', title: 'Google Drive', url: 'https://drive.google.com/', desc: 'คลังเก็บข้อมูลออนไลน์สำหรับจัดการไฟล์และแชร์ข้อมูล', img: 'google-drive.png', dept: 'Common (ทุกแผนก)', btn: 'เปิด Google Drive' },
    { id: 3, category: 'bd', title: 'Dabby.io', url: 'https://dabby.io/', desc: 'ระบบ AI Engine สำหรับจัดการ Chatbot และ Prompts', img: 'dabby.img.png', dept: 'แผนก BD', btn: 'เข้าสู่ระบบ Dabby' },
    { id: 4, category: 'bd', title: 'Line OA', url: 'https://manager.line.biz/', desc: 'ระบบจัดการบัญชี Line Official สำหรับสื่อสารกับลูกค้า', img: 'line.img.svg', dept: 'แผนก BD, Sales', btn: 'เปิด Line Manager' },
    { id: 5, category: 'bd', title: 'Jira Software', url: 'https://salegoodwork-2026.atlassian.net/jira/for-you', desc: 'ติดตามงานโปรเจกต์และจัดการ Task ต่างๆ ของทีม', img: 'jira.img.png', dept: 'แผนก BD', btn: 'เปิดหน้างาน Jira' },
    { id: 6, category: 'bd', title: 'Call On Cloud', url: 'https://www.calloncloud.io/', desc: 'ระบบ centralino VoIP และการสื่อสารในองค์กร', img: 'calloncloud.ico', dept: 'แผนก BD&Sale', btn: 'เข้าสู่ Call On Cloud' },
    { id: 7, category: 'bd', title: 'GitHub', url: 'https://github.com/', desc: 'ระบบจัดการซอร์สโค้ดและติดตามการแก้ไขของโปรเจกต์', img: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', dept: 'แผนก BD', btn: 'เข้าสู่ GitHub' },
    { id: 8, category: 'project', title: 'Trello', url: 'https://trello.com/', desc: 'บอร์ดจัดการงานภาพรวมและติดตามสถานะโครงการ', img: 'trello.img.png', dept: 'แผนก Project', btn: 'เปิดบอร์ด Trello' },
    { id: 9, category: 'marketing', title: 'Miro', url: 'https://miro.com/th/', desc: 'ไวท์บอร์ดออนไลน์สำหรับระดมสมองและวางแผน', img: 'miro.jpg', dept: 'แผนก Marketing', btn: 'เปิด Miro' },
    { id: 10, category: 'marketing', title: 'Kling', url: 'https://kling.ai/app/video/new', desc: 'แพลตฟอร์มสร้างวิดีโออัตโนมัติด้วย AI', img: 'kling.png', dept: 'แผนก Marketing', btn: 'เปิด Kling' },
    { id: 11, category: 'marketing', title: 'Jira Software', url: 'https://salegoodwork-2026.atlassian.net/jira/for-you', desc: 'ติดตามงานโปรเจกต์และจัดการ Task ต่างๆ ของทีม', img: 'jira.img.png', dept: 'แผนก Marketing', btn: 'เปิดหน้างาน Jira' }
];

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

// Initialize or get tools from localStorage
function getTools() {
    let tools = localStorage.getItem('gw_hub_tools');
    if (!tools) {
        localStorage.setItem('gw_hub_tools', JSON.stringify(INITIAL_TOOLS));
        return INITIAL_TOOLS;
    }
    return JSON.parse(tools);
}

// Initialize or get hashed passwords from localStorage
async function getPasswords() {
    let passwords = localStorage.getItem('gw_hub_passwords');
    if (!passwords) {
        passwords = {};
        const users = getUsers();
        const defaultHash = await hashPassword(DEFAULT_PASSWORD);
        const adminHash = await hashPassword('admin');

        for (const user of Object.keys(users)) {
            passwords[user] = (user === 'admin') ? adminHash : defaultHash;
        }
        localStorage.setItem('gw_hub_passwords', JSON.stringify(passwords));
        return passwords;
    }
    return JSON.parse(passwords);
}

async function checkPassword() {
    const username = document.getElementById('username-input').value.trim();
    const password = document.getElementById('password-input').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    const users = getUsers();
    const passwords = await getPasswords();
    const inputHash = await hashPassword(password);

    if (users[username] && passwords[username] === inputHash) {
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

    // Role-based Tool Management visibility (Managers, Heads, Leads, and CEO/Admins)
    const mgmtRoles = ['manager', 'head', 'lead', 'ceo', 'administrator'];
    const isMgmt = ADMINS.includes(username) || mgmtRoles.some(r => user.role.toLowerCase().includes(r));
    
    if (isMgmt) {
        document.getElementById('tool-mgmt-btn').classList.remove('hidden');
    } else {
        document.getElementById('tool-mgmt-btn').classList.add('hidden');
    }

    // Initialize Greeting & Clock
    updateGreeting(username);
    startClock();

    // Render Tools
    renderTools(username);

    // Filter Navigation Buttons
    const navButtons = document.querySelectorAll('.nav-btn:not(.logout):not(.theme-dropbtn)');
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

function handleSearch() {
    const query = document.getElementById('tool-search').value.toLowerCase();
    const currentCategory = document.querySelector('.nav-btn.active').id.replace('btn-', '');
    const grid = document.getElementById('grid-' + currentCategory);
    const cards = grid.querySelectorAll('.tool-card-wrapper');

    cards.forEach(card => {
        const title = card.querySelector('.tool-title').innerText.toLowerCase();
        const desc = card.querySelector('.tool-description').innerText.toLowerCase();
        const dept = card.querySelector('.tool-dept').innerText.toLowerCase();

        if (title.includes(query) || desc.includes(query) || dept.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function updateGreeting(username) {
    const users = getUsers();
    const user = users[username];
    const hour = new Date().getHours();
    let greeting = '';
    let subtext = '';

    if (hour < 12) {
        greeting = `สวัสดีตอนเช้าครับคุณ ${username}! ☀️`;
        subtext = 'หิวข้าวหรือยัง? อีกนิดเดียวก็จะเที่ยงแล้วนะ!';
    } else if (hour < 17) {
        greeting = `สวัสดีตอนบ่ายครับคุณ ${username}! ☕`;
        subtext = 'สู้ๆ กับงานในช่วงบ่ายนะครับ ทีม GoodWork เป็นกำลังใจให้!';
    } else {
        greeting = `สวัสดีตอนเย็นครับคุณ ${username}! 🌙`;
        subtext = 'ใกล้เวลาพักผ่อนแล้ว อย่าลืมดูแลสุขภาพด้วยนะครับ';
    }

    if (ADMINS.includes(username)) {
        subtext += ' วันนี้ระบบหลังบ้านปกติดีครับ ท่าน CEO';
    }

    document.getElementById('greeting-text').innerText = greeting;
    document.getElementById('greeting-subtext').innerText = subtext;
}

function startClock() {
    const clockElement = document.getElementById('live-clock');
    if (!clockElement) return;

    function updateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('th-TH', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false 
        });
        clockElement.innerText = timeStr;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

function renderTools(username) {
    try {
        const tools = getTools();
        const users = getUsers();
        const user = users[username];
        
        if (!user) return;

        const categories = ['common', 'bd', 'project', 'marketing'];
        categories.forEach(cat => {
            const grid = document.getElementById('grid-' + cat);
            if (!grid) return;
            grid.innerHTML = '';
            
            const catTools = tools.filter(t => t.category === cat);
            catTools.forEach(t => {
                const card = document.createElement('div');
                card.className = 'tool-card-wrapper';
                card.innerHTML = `
                    <a href="${t.url}" target="_blank" class="tool-card">
                        <div class="tool-image"><img src="${t.img}" alt="${t.title}" onerror="this.src='https://via.placeholder.com/64?text=Tool'"></div>
                        <div class="tool-content">
                            <div class="tool-dept">${t.dept}</div>
                            <div class="tool-title">${t.title}</div>
                            <div class="tool-description">${t.desc}</div>
                            <div class="btn-access">${t.btn}</div>
                        </div>
                    </a>
                `;
                grid.appendChild(card);
            });
        });
    } catch (err) {
        console.error('Error rendering tools:', err);
    }
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

async function addNewUser() {
    const username = document.getElementById('new-username').value.trim();
    const role = document.getElementById('new-role').value.trim();
    const categories = Array.from(document.querySelectorAll('.cat-access:checked')).map(cb => cb.value);

    if (!username || !role) {
        alert('กรุณากรอกชื่อและตำแหน่ง');
        return;
    }

    const users = getUsers();
    if (users[username]) {
        alert('มีชื่อผู้ใช้งานนี้อยู่ในระบบแล้ว');
        return;
    }

    users[username] = { role: role, allowed: categories };
    localStorage.setItem('gw_hub_users', JSON.stringify(users));

    // Initialize hashed password
    const passwords = await getPasswords();
    passwords[username] = await hashPassword(DEFAULT_PASSWORD);
    localStorage.setItem('gw_hub_passwords', JSON.stringify(passwords));

    // Clear form
    document.getElementById('new-username').value = '';
    
    renderUserList();
    alert(`เพิ่มผู้ใช้งาน ${username} เรียบร้อยแล้ว! (รหัสผ่านเริ่มต้น: ${DEFAULT_PASSWORD})`);
}

async function deleteUser(username) {
    if (ADMINS.includes(username)) return;
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งาน ${username}?`)) return;

    const users = getUsers();
    delete users[username];
    localStorage.setItem('gw_hub_users', JSON.stringify(users));

    const passwords = await getPasswords();
    delete passwords[username];
    localStorage.setItem('gw_hub_passwords', JSON.stringify(passwords));

    renderUserList();
}

// Tool Management Functions
function openToolMgmtModal() {
    renderToolListMgmt();
    document.getElementById('tool-mgmt-modal').classList.remove('hidden');
}

function closeToolMgmtModal() {
    document.getElementById('tool-mgmt-modal').classList.add('hidden');
    resetToolForm();
}

function renderToolListMgmt() {
    const tools = getTools();
    const listContainer = document.getElementById('tool-list-mgmt');
    listContainer.innerHTML = '';
    
    const currentUser = sessionStorage.getItem('gw_hub_current_user') || localStorage.getItem('gw_hub_user');
    const users = getUsers();
    const user = users[currentUser];
    const isGlobalAdmin = ADMINS.includes(currentUser);

    tools.forEach(t => {
        // RBAC Check for Edit/Delete
        // For simplicity, we assume department heads can edit tools in their "allowed" categories
        const canManage = isGlobalAdmin || (user.allowed && user.allowed.includes(t.category));

        if (!canManage) return;

        const toolDiv = document.createElement('div');
        toolDiv.style.display = 'flex';
        toolDiv.style.justifyContent = 'space-between';
        toolDiv.style.alignItems = 'center';
        toolDiv.style.padding = '10px';
        toolDiv.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        
        toolDiv.innerHTML = `
            <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 0.9rem;">${t.title}</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">${t.category}</div>
            </div>
            <div style="display: flex; gap: 5px;">
                <button onclick="editTool(${t.id})" style="background: #3b82f6; width: auto; padding: 4px 10px; font-size: 0.7rem; border-radius: 6px;">แก้ไข</button>
                <button onclick="deleteTool(${t.id})" style="background: #ef4444; width: auto; padding: 4px 10px; font-size: 0.7rem; border-radius: 6px;">ลบ</button>
            </div>
        `;
        listContainer.appendChild(toolDiv);
    });
}

let currentBase64Image = '';

function editTool(id) {
    const tools = getTools();
    const tool = tools.find(t => t.id === id);
    if (!tool) return;

    document.getElementById('edit-tool-id').value = tool.id;
    document.getElementById('tool-name').value = tool.title;
    document.getElementById('tool-url').value = tool.url;
    document.getElementById('tool-desc').value = tool.desc;
    
    // Set preview
    currentBase64Image = tool.img;
    const preview = document.getElementById('image-preview');
    const placeholder = document.getElementById('preview-placeholder');
    if (tool.img) {
        preview.src = tool.img;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    } else {
        preview.style.display = 'none';
        placeholder.style.display = 'block';
    }

    document.getElementById('tool-dept-text').value = tool.dept;
    document.getElementById('tool-btn-text').value = tool.btn;
    document.getElementById('tool-category').value = tool.category;

    document.getElementById('tool-form-title').innerText = 'แก้ไขเครื่องมือ';
    document.getElementById('btn-save-tool').innerText = 'บันทึกการแก้ไข';
    document.getElementById('btn-cancel-edit').classList.remove('hidden');
}

function resetToolForm() {
    document.getElementById('edit-tool-id').value = '';
    document.getElementById('tool-name').value = '';
    document.getElementById('tool-url').value = '';
    document.getElementById('tool-desc').value = '';
    document.getElementById('tool-image-file').value = '';
    
    currentBase64Image = '';
    document.getElementById('image-preview').src = '';
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('preview-placeholder').style.display = 'block';

    document.getElementById('tool-dept-text').value = '';
    document.getElementById('tool-btn-text').value = '';
    document.getElementById('tool-category').value = 'common';

    document.getElementById('tool-form-title').innerText = 'เพิ่มเครื่องมือใหม่';
    document.getElementById('btn-save-tool').innerText = 'บันทึก';
    document.getElementById('btn-cancel-edit').classList.add('hidden');
}

function saveTool() {
    const id = document.getElementById('edit-tool-id').value;
    const title = document.getElementById('tool-name').value.trim();
    const url = document.getElementById('tool-url').value.trim();
    const desc = document.getElementById('tool-desc').value.trim();
    const img = currentBase64Image;
    const dept = document.getElementById('tool-dept-text').value.trim();
    const btnText = document.getElementById('tool-btn-text').value.trim();
    const category = document.getElementById('tool-category').value;

    if (!title || !url || !category) {
        alert('กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, ลิงก์, หมวดหมู่)');
        return;
    }

    const tools = getTools();
    
    if (id) {
        // Edit
        const index = tools.findIndex(t => t.id == id);
        if (index !== -1) {
            tools[index] = { ...tools[index], title, url, desc, img, dept, btn: btnText, category };
        }
    } else {
        // Add
        const newId = tools.length > 0 ? Math.max(...tools.map(t => t.id)) + 1 : 1;
        tools.push({ id: newId, title, url, desc, img, dept, btn: btnText, category });
    }

    localStorage.setItem('gw_hub_tools', JSON.stringify(tools));
    resetToolForm();
    renderToolListMgmt();
    
    const currentUser = sessionStorage.getItem('gw_hub_current_user') || localStorage.getItem('gw_hub_user');
    renderTools(currentUser);
    alert('บันทึกข้อมูลเรียบร้อยแล้ว');
}

// File input listener for image conversion
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('tool-image-file');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                currentBase64Image = event.target.result;
                const preview = document.getElementById('image-preview');
                const placeholder = document.getElementById('preview-placeholder');
                preview.src = currentBase64Image;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        });
    }
});

function deleteTool(id) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเครื่องมือนี้?')) return;
    
    let tools = getTools();
    tools = tools.filter(t => t.id != id);
    localStorage.setItem('gw_hub_tools', JSON.stringify(tools));
    
    renderToolListMgmt();
    const currentUser = sessionStorage.getItem('gw_hub_current_user') || localStorage.getItem('gw_hub_user');
    renderTools(currentUser);
}

// Password Change Functions
async function openChangePasswordModal() {
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

async function submitChangePassword() {
    const currentUser = sessionStorage.getItem('gw_hub_current_user') || localStorage.getItem('gw_hub_user');
    const currentInput = document.getElementById('current-pw').value;
    const newInput = document.getElementById('new-pw').value;
    const confirmInput = document.getElementById('confirm-pw').value;

    const passwords = await getPasswords();
    const currentInputHash = await hashPassword(currentInput);

    if (currentInputHash !== passwords[currentUser]) {
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

    passwords[currentUser] = await hashPassword(newInput);
    localStorage.setItem('gw_hub_passwords', JSON.stringify(passwords));
    alert('เปลี่ยนรหัสผ่านสำเร็จแล้ว!');
    closeChangePasswordModal();
}

function toggleThemeDropdown() {
    document.getElementById('theme-dropdown').classList.toggle('show');
}

function setTheme(theme) {
    localStorage.setItem('gw_hub_theme', theme);
    applyTheme(theme);
    document.getElementById('theme-dropdown').classList.remove('show');
    
    const themeButtons = document.querySelectorAll('.theme-dropdown-content button');
    themeButtons.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.getElementById('theme-' + theme);
    if (activeBtn) activeBtn.classList.add('active');
}

function applyTheme(theme) {
    const root = document.documentElement;
    const icon = document.getElementById('current-theme-icon');
    const text = document.getElementById('current-theme-text');

    if (theme === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', isDark ? 'dark' : 'light');
        if (icon) icon.innerText = '💻';
        if (text) text.innerText = 'Auto';
    } else {
        root.setAttribute('data-theme', theme);
        if (theme === 'light') {
            if (icon) icon.innerText = '☀️';
            if (text) text.innerText = 'Light';
        } else {
            if (icon) icon.innerText = '🌙';
            if (text) text.innerText = 'Dark';
        }
    }
}

// Listen for system theme changes if in auto mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (localStorage.getItem('gw_hub_theme') === 'auto') {
        applyTheme('auto');
    }
});

window.onload = async function() {
    const savedTheme = localStorage.getItem('gw_hub_theme') || 'auto';
    setTheme(savedTheme);

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
    
    if (user && user.allowed && !user.allowed.includes(category)) {
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

window.onclick = function(event) {
    if (!event.target.matches('.theme-dropbtn')) {
        const dropdowns = document.getElementsByClassName("theme-dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.parentElement.classList.contains('show')) {
                openDropdown.parentElement.classList.remove('show');
            }
        }
    }
}
