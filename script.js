// GW Tools Hub - Core Logic v2.0.0 (Open Access)
const VERSION = '2.0.0';

// Check for version update and clear cache if needed
const savedVersion = localStorage.getItem('gw_hub_version');
if (savedVersion !== VERSION) {
    localStorage.removeItem('gw_hub_tools');
    localStorage.setItem('gw_hub_version', VERSION);
    console.log('System updated to v' + VERSION);
}

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

// Initialize or get tools from localStorage
function getTools() {
    let tools = localStorage.getItem('gw_hub_tools');
    if (!tools) {
        localStorage.setItem('gw_hub_tools', JSON.stringify(INITIAL_TOOLS));
        return INITIAL_TOOLS;
    }
    return JSON.parse(tools);
}

function showMainContent() {
    startClock();
    renderTools();
    filterTools('common');
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

function renderTools() {
    try {
        const tools = getTools();
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
    showMainContent();
};

function filterTools(category) {
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
    
    tools.forEach(t => {
        const toolDiv = document.createElement('div');
        toolDiv.style.display = 'flex';
        toolDiv.style.justifyContent = 'space-between';
        toolDiv.style.alignItems = 'center';
        toolDiv.style.padding = '8px';
        toolDiv.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        
        toolDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${t.img}" style="width: 24px; height: 24px; border-radius: 4px;" onerror="this.src='https://via.placeholder.com/24'">
                <div>
                    <strong style="color: var(--primary-color); font-size: 0.9rem;">${t.title}</strong> 
                    <div style="font-size: 0.7rem; color: var(--text-muted)">${t.category}</div>
                </div>
            </div>
            <div style="display: flex; gap: 5px;">
                <button onclick="editTool(${t.id})" style="background: var(--primary-color); width: auto; padding: 4px 8px; font-size: 0.7rem; border-radius: 6px;">แก้ไข</button>
                <button onclick="deleteTool(${t.id})" style="background: #ef4444; width: auto; padding: 4px 8px; font-size: 0.7rem; border-radius: 6px;">ลบ</button>
            </div>
        `;
        listContainer.appendChild(toolDiv);
    });
}

function deleteTool(id) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเครื่องมือนี้?')) return;
    let tools = getTools();
    tools = tools.filter(t => t.id !== id);
    localStorage.setItem('gw_hub_tools', JSON.stringify(tools));
    renderToolListMgmt();
    renderTools();
}

function editTool(id) {
    const tools = getTools();
    const tool = tools.find(t => t.id === id);
    if (!tool) return;

    document.getElementById('tool-form-title').innerText = 'แก้ไขเครื่องมือ';
    document.getElementById('edit-tool-id').value = tool.id;
    document.getElementById('tool-name').value = tool.title;
    document.getElementById('tool-url').value = tool.url;
    document.getElementById('tool-desc').value = tool.desc;
    document.getElementById('tool-dept-text').value = tool.dept;
    document.getElementById('tool-btn-text').value = tool.btn;
    document.getElementById('tool-category').value = tool.category;
    
    // Set preview
    const preview = document.getElementById('image-preview');
    const placeholder = document.getElementById('preview-placeholder');
    preview.src = tool.img;
    preview.style.display = 'block';
    placeholder.style.display = 'none';

    document.getElementById('btn-cancel-edit').classList.remove('hidden');
    document.getElementById('btn-save-tool').innerText = 'อัปเดตเครื่องมือ';
}

function resetToolForm() {
    document.getElementById('tool-form-title').innerText = 'เพิ่มเครื่องมือใหม่';
    document.getElementById('edit-tool-id').value = '';
    document.getElementById('tool-name').value = '';
    document.getElementById('tool-url').value = '';
    document.getElementById('tool-desc').value = '';
    document.getElementById('tool-dept-text').value = '';
    document.getElementById('tool-btn-text').value = '';
    document.getElementById('tool-category').value = 'common';
    document.getElementById('tool-image-file').value = '';
    
    const preview = document.getElementById('image-preview');
    const placeholder = document.getElementById('preview-placeholder');
    preview.src = '';
    preview.style.display = 'none';
    placeholder.style.display = 'block';

    document.getElementById('btn-cancel-edit').classList.add('hidden');
    document.getElementById('btn-save-tool').innerText = 'บันทึกเครื่องมือ';
}

function saveTool() {
    const id = document.getElementById('edit-tool-id').value;
    const title = document.getElementById('tool-name').value;
    const url = document.getElementById('tool-url').value;
    const desc = document.getElementById('tool-desc').value;
    const dept = document.getElementById('tool-dept-text').value;
    const btnText = document.getElementById('tool-btn-text').value;
    const category = document.getElementById('tool-category').value;
    const imgPreview = document.getElementById('image-preview').src;

    if (!title || !url) {
        alert('กรุณากรอกชื่อและลิงก์เครื่องมือ');
        return;
    }

    let tools = getTools();

    if (id) {
        // Edit
        const index = tools.findIndex(t => t.id == id);
        if (index !== -1) {
            tools[index] = { ...tools[index], title, url, desc, dept, btn: btnText, category, img: imgPreview };
        }
    } else {
        // Add
        const newId = tools.length > 0 ? Math.max(...tools.map(t => t.id)) + 1 : 1;
        tools.push({ id: newId, title, url, desc, dept, btn: btnText, category, img: imgPreview || 'https://via.placeholder.com/64' });
    }

    localStorage.setItem('gw_hub_tools', JSON.stringify(tools));
    renderToolListMgmt();
    renderTools();
    resetToolForm();
    alert('บันทึกเครื่องมือเรียบร้อยแล้ว!');
}

// Image Upload Handler
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('tool-image-file');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const preview = document.getElementById('image-preview');
                    const placeholder = document.getElementById('preview-placeholder');
                    preview.src = event.target.result;
                    preview.style.display = 'block';
                    placeholder.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
