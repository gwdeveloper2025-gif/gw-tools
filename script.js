// GW Tools Hub - Core Logic v2.2.1 (Local Assets Update)
const VERSION = '2.2.1';

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
    { id: 12, category: 'common', title: 'Gemini', url: 'https://gemini.google.com/', desc: 'AI ผู้ช่วยอัจฉริยะจาก Google สำหรับการทำงานและสร้างสรรค์', img: 'gemini.png', dept: 'Common (ทุกแผนก)', btn: 'คุยกับ Gemini' },
    { id: 3, category: 'bd', title: 'Dabby.io', url: 'https://dabby.io/', desc: 'ระบบ AI Engine สำหรับจัดการ Chatbot และ Prompts', img: 'dabby.img.png', dept: 'แผนก BD', btn: 'เข้าสู่ระบบ Dabby' },
    { id: 4, category: 'bd', title: 'Line OA', url: 'https://manager.line.biz/', desc: 'ระบบจัดการบัญชี Line Official สำหรับสื่อสารกับลูกค้า', img: 'line.img.svg', dept: 'แผนก BD, Sales', btn: 'เปิด Line Manager' },
    { id: 5, category: 'bd', title: 'Jira Software', url: 'https://salegoodwork-2026.atlassian.net/jira/for-you', desc: 'ติดตามงานโปรเจกต์และจัดการ Task ต่างๆ ของทีม', img: 'jira.img.png', dept: 'แผนก BD', btn: 'เปิดหน้างาน Jira' },
    { id: 6, category: 'bd', title: 'Call On Cloud', url: 'https://www.calloncloud.io/', desc: 'ระบบ centralino VoIP และการสื่อสารในองค์กร', img: 'calloncloud.ico', dept: 'แผนก BD&Sale', btn: 'เข้าสู่ Call On Cloud' },
    { id: 7, category: 'bd', title: 'GitHub', url: 'https://github.com/', desc: 'ระบบจัดการซอร์สโค้ดและติดตามการแก้ไขของโปรเจกต์', img: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', dept: 'แผนก BD', btn: 'เข้าสู่ GitHub' },
    { id: 8, category: 'project', title: 'Trello', url: 'https://trello.com/', desc: 'บอร์ดจัดการงานภาพรวมและติดตามสถานะโครงการ', img: 'trello.img.png', dept: 'แผนก Project', btn: 'เปิดบอร์ด Trello' },
    { id: 13, category: 'project', title: 'Google Sheets', url: 'https://docs.google.com/spreadsheets/', desc: 'จัดการข้อมูล ตารางคำนวณ และรายงานผลแบบเรียลไทม์', img: 'googlesheet.png', dept: 'แผนก Project', btn: 'เปิด Google Sheets' },
    { id: 23, category: 'project', title: 'Project Timeline', url: 'https://docs.google.com/spreadsheets/d/1iimLA8gGO5v3hP0sSSt6C65sB6Qj8aVw/edit?gid=124155317#gid=124155317', desc: 'Goodwork Kitchen QS - ตารางเวลาการดำเนินงานโปรเจกต์', img: 'googlesheet.png', dept: 'แผนก Project', btn: 'PROJECT TIMELINE' },
    { id: 24, category: 'project', title: 'Stock สินค้ามือสอง', url: 'https://docs.google.com/spreadsheets/d/148hrYp1SN8WQcgciccrqHJdzDmTXPA7OO-RI03wMRa0/edit?usp=sharing', desc: 'Goodwork Kitchen QS - ระบบจัดการสต็อกสินค้ามือสอง', img: 'googlesheet.png', dept: 'แผนก Project', btn: 'STOCK สินค้ามือสอง' },
    { id: 9, category: 'marketing', title: 'Miro', url: 'https://miro.com/th/', desc: 'ไวท์บอร์ดออนไลน์สำหรับระดมสมองและวางแผน', img: 'miro.jpg', dept: 'แผนก Marketing', btn: 'เปิด Miro' },
    { id: 10, category: 'marketing', title: 'Kling', url: 'https://kling.ai/app/video/new', desc: 'แพลตฟอร์มสร้างวิดีโออัตโนมัติด้วย AI', img: 'kling.png', dept: 'แผนก Marketing', btn: 'เปิด Kling' },
    { id: 11, category: 'marketing', title: 'Jira Software', url: 'https://salegoodwork-2026.atlassian.net/jira/for-you', desc: 'ติดตามงานโปรเจกต์และจัดการ Task ต่างๆ ของทีม', img: 'jira.img.png', dept: 'แผนก Marketing', btn: 'เปิดหน้างาน Jira' },
    { id: 14, category: 'marketing', title: 'YouTube', url: 'https://www.youtube.com/', desc: 'จัดการช่องและวิดีโอคอนเทนต์ของแบรนด์', img: 'Youtube.png', dept: 'แผนก Marketing', btn: 'เปิด YouTube' },
    { id: 15, category: 'marketing', title: 'Google Ads', url: 'https://ads.google.com/', desc: 'ระบบจัดการโฆษณาและแคมเปญบน Google Search และเครือข่าย', img: 'googleads.webp', dept: 'แผนก Marketing', btn: 'จัดการ Google Ads' },
    { id: 16, category: 'marketing', title: 'CapCut', url: 'https://www.capcut.com/', desc: 'เครื่องมือตัดต่อวิดีโอสำหรับ Social Media ที่ใช้งานง่ายและทรงพลัง', img: 'capcut.webp', dept: 'แผนก Marketing', btn: 'เริ่มตัดต่อ CapCut' },
    { id: 17, category: 'marketing', title: 'Canva', url: 'https://www.canva.com/', desc: 'แพลตฟอร์มออกแบบกราฟิกและสื่อนำเสนอแบบมืออาชีพ', img: 'canva.png', dept: 'แผนก Marketing', btn: 'เปิด Canva' },
    { id: 18, category: 'marketing', title: 'Meta Business Suite', url: 'https://business.facebook.com/', desc: 'ศูนย์กลางจัดการ Facebook และ Instagram สำหรับธุรกิจ', img: 'Meta.jfif', dept: 'แผนก Marketing', btn: 'เปิด Meta Business' },
    { id: 19, category: 'marketing', title: 'Facebook', url: 'https://www.facebook.com/', desc: 'จัดการหน้าเพจและปฏิสัมพันธ์กับลูกค้าบน Facebook', img: 'facebook.png', dept: 'แผนก Marketing', btn: 'เปิด Facebook' },
    { id: 20, category: 'marketing', title: 'Instagram', url: 'https://www.instagram.com/', desc: 'จัดการคอนเทนต์ภาพและวิดีโอสั้นบน Instagram', img: 'instagram.svg', dept: 'แผนก Marketing', btn: 'เปิด Instagram' },
    { id: 21, category: 'marketing', title: 'TikTok', url: 'https://www.tiktok.com/', desc: 'จัดการคอนเทนต์และแคมเปญวิดีโอสั้นบน TikTok', img: 'tiktok.png', dept: 'แผนก Marketing', btn: 'เปิด TikTok' },
    { id: 22, category: 'marketing', title: 'LinkedIn', url: 'https://www.linkedin.com/', desc: 'สร้างเครือข่ายธุรกิจและจัดการคอนเทนต์ระดับมืออาชีพ', img: 'linkin.jpg', dept: 'แผนก Marketing', btn: 'เปิด LinkedIn' },
    { id: 25, category: 'admin', title: 'E-GP', url: 'https://www.gprocurement.go.th/new_index.html', desc: 'ระบบจัดซื้อจัดจ้างภาครัฐด้วยอิเล็กทรอนิกส์', img: 'E-GP.jpg', dept: 'แผนก Admin, Sales', btn: 'เข้าสู่ระบบ E-GP' },
    { id: 26, category: 'admin', title: 'FLOWACCOUNT', url: 'https://advance.flowaccount.com/N362143/business/quotations', desc: 'ระบบบัญชีออนไลน์และจัดการใบเสนอราคา', img: 'FlowAccount.png', dept: 'แผนก Admin, Sales', btn: 'เปิด FlowAccount' },
    { id: 27, category: 'admin', title: 'E-TAX INV CENTRALLY', url: 'https://interapp3.rd.go.th/signed_inter/src_inter/main.php?act=1', desc: 'ระบบการขอจัดทำใบกำกับภาษี โดยการประทับรับรองเวลา', img: 'E-tax inv centrally.png', dept: 'แผนก Admin, Sales', btn: 'เปิด E-Tax Inv' },
    { id: 28, category: 'admin', title: 'GFMIS', url: 'https://vendors.gfmis.go.th/login', desc: 'ระบบเรียกดูข้อมูลการจ่ายชำระเงิน หน่วยงานรัฐบาล', img: 'GFMIS.png', dept: 'แผนก Admin, Sales', btn: 'เข้าสู่ GFMIS' },
    { id: 29, category: 'admin', title: 'THAI SME-GP', url: 'https://thaismegp.sme.go.th/loginv2?redirectUrl=%2Faccount%2Fsme%2Fadd-sme', desc: 'ระบบขึ้นทะเบียนผู้ประกอบการ SME เพื่อการจัดซื้อจัดจ้างภาครัฐ', img: 'thaisme-gp.png', dept: 'แผนก Admin, Sales', btn: 'เปิด SME-GP' },
    { id: 30, category: 'admin', title: 'SSO e-Service', url: 'https://www.sso.go.th/eservices/esv/index.jsp', desc: 'ระบบบริการอิเล็กทรอนิกส์ สำนักงานประกันสังคม', img: 'sso e-service.png', dept: 'แผนก Admin, Sales', btn: 'เปิด SSO Service' },
    { id: 31, category: 'admin', title: 'HUMAN SOFT', url: 'https://hrgoodwork.humansoft.co.th/salary/calculate/normal', desc: 'ระบบจัดการทรัพยากรบุคคลและคำนวณเงินเดือน', img: 'human soft.png', dept: 'แผนก Admin, Sales', btn: 'เปิด Human Soft' }
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
    if (!grid) return;
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
        const categories = ['common', 'admin', 'bd', 'project', 'marketing'];
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
        toolDiv.className = 'mgmt-tool-item';
        
        toolDiv.innerHTML = `
            <div class="mgmt-tool-info">
                <img src="${t.img}" class="mgmt-tool-img" onerror="this.src='https://via.placeholder.com/45'">
                <div class="mgmt-tool-details">
                    <strong>${t.title}</strong>
                    <span>${t.category}</span>
                </div>
            </div>
            <div class="mgmt-tool-actions">
                <button class="mgmt-btn mgmt-btn-edit" onclick="editTool(${t.id})">แก้ไข</button>
                <button class="mgmt-btn mgmt-btn-delete" onclick="deleteTool(${t.id})">ลบ</button>
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
