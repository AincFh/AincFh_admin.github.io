document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('forgotPasswordForm');
    const emailInput = document.getElementById('email');
    const codeInput = document.getElementById('code');
    const sendCodeBtn = document.querySelector('.send-code');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');

    let countdown = 60;
    let timer = null;

    // 密码显示/隐藏功能
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            // 切换眼睛图标
            this.className = `fas ${type === 'password' ? 'fa-eye-slash' : 'fa-eye'} toggle-password`;
        });
    });

    // 初始化禁用发送验证码按钮
    sendCodeBtn.disabled = true;

    // 监听邮箱输入
    emailInput.addEventListener('input', function() {
        sendCodeBtn.disabled = !isValidEmail(this.value);
    });

    // 发送验证码
    sendCodeBtn.addEventListener('click', async function() {
        if (!emailInput.value) {
            showModal('提示', '请输入邮箱地址');
            emailInput.focus();
            return;
        }

        if (!isValidEmail(emailInput.value)) {
            showModal('提示', '请输入有效的邮箱地址');
            emailInput.focus();
            return;
        }

        try {
            sendCodeBtn.disabled = true;
            const originalText = sendCodeBtn.textContent;
            sendCodeBtn.textContent = '发送中...';

            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            startCountdown();
            showModal('发送成功', `验证码已发送至邮箱：${emailInput.value}`);

        } catch (error) {
            showModal('发送失败', '请稍后重试');
            sendCodeBtn.disabled = false;
            sendCodeBtn.textContent = originalText;
        }
    });

    // 倒计时功能
    function startCountdown() {
        sendCodeBtn.disabled = true;
        sendCodeBtn.textContent = `${countdown}秒后重新发送`;
        
        timer = setInterval(() => {
            countdown--;
            sendCodeBtn.textContent = `${countdown}秒后重新发送`;
            
            if (countdown <= 0) {
                clearInterval(timer);
                timer = null;
                sendCodeBtn.disabled = !isValidEmail(emailInput.value);
                sendCodeBtn.textContent = '发送验证码';
                countdown = 60;
            }
        }, 1000);
    }

    // 邮箱格式验证
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // 添加弹窗显示函数
    function showModal(title, message) {
        // 创建弹窗元素
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h3 class="modal-title">${title}</h3>
                <p class="modal-message">${message}</p>
                <button class="modal-btn">确定</button>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(modal);
        
        // 显示弹窗
        setTimeout(() => modal.classList.add('show'), 10);

        // 绑定关闭事件
        const closeBtn = modal.querySelector('.modal-btn');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
    }
});