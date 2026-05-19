function checkPassword() {
    const password = document.getElementById('password-input').value;
    // กำหนดรหัสผ่านตรงนี้ (เช่น 1234)
    if (password === 'goodwork') {
        document.getElementById('login-overlay').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
    } else {
        alert('รหัสผ่านไม่ถูกต้อง!');
    }
}

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
