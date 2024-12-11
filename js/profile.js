document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profileForm');
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarPreview = document.getElementById('avatarPreview');
    const lastLoginElement = document.getElementById('lastLogin');
    const loginIPElement = document.getElementById('loginIP');

    // 获取最后登录时间和IP
    function getLastLoginInfo() {
        const lastLogin = localStorage.getItem('lastLoginTime') || new Date().toISOString();
        const loginIP = localStorage.getItem('lastLoginIP') || '获取中...';
        
        // 格式化时间
        const formattedTime = new Date(lastLogin).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        lastLoginElement.value = formattedTime;
        loginIPElement.value = loginIP;

        // 获取IP地址（使用ipify API）
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                loginIPElement.value = data.ip;
                localStorage.setItem('lastLoginIP', data.ip);
            })
            .catch(() => {
                loginIPElement.value = '无法获取IP';
            });
    }

    // 更新登录时间
    function updateLoginTime() {
        const now = new Date();
        localStorage.setItem('lastLoginTime', now.toISOString());
        
        // 格式化时间
        const formattedTime = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        lastLoginElement.value = formattedTime;
    }

    // 头像上传预览
    avatarUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB限制
                showMessage('图片大小不能超过2MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                avatarPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 加载个人信息
    async function loadProfile() {
        try {
            // TODO: 调用获取个人信息API
            // 模拟API返回数据
            const data = {
                nickname: '管理员',
                email: 'admin@example.com',
                bio: '这是一个示例简介',
                avatar: '../../images/avatar.png',
                phone: '13800138000'
            };

            // 填充表单
            document.getElementById('nickname').value = data.nickname;
            document.getElementById('email').value = data.email;
            document.getElementById('bio').value = data.bio;
            document.getElementById('phone').value = data.phone;
            avatarPreview.src = data.avatar;

            // 获取登录信息
            getLastLoginInfo();

        } catch (error) {
            showMessage('加载个人信息失败', 'error');
        }
    }

    // 保存个人信息
    profileForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
            submitBtn.disabled = true;

            // TODO: 调用保存API
            await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用

            showMessage('保存成功', 'success');

            // 更新顶部导航栏的用户信息
            const adminName = document.querySelector('.admin-name');
            if (adminName) {
                adminName.textContent = formData.get('nickname');
            }

            // 更新登录时间
            updateLoginTime();

        } catch (error) {
            showMessage('保存失败，请重试', 'error');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // 修改密码按钮点击事件
    const changePasswordBtn = document.querySelector('.change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            // TODO: 实现修改密码的逻辑
            showMessage('密码修改功能即将上线', 'info');
        });
    }

    // 消息提示
    function showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-toast ${type}`;
        messageDiv.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(messageDiv);
        setTimeout(() => messageDiv.classList.add('show'), 100);

        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    // 每分钟更新一次登录时间
    setInterval(updateLoginTime, 60000);

    // 初始化
    loadProfile();
}); 