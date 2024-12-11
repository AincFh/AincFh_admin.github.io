document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('adminLoginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const captchaInput = document.getElementById('captcha');
    const captchaImage = document.getElementById('captchaImage');
    const refreshCaptchaBtn = document.getElementById('refreshCaptcha');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const rememberMeCheckbox = document.querySelector('input[name="remember"]');

    let captchaText = ''; // 存储正确的验证码

    // 生成验证码
    function generateCaptcha() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 140;
        canvas.height = 52;

        // 生成验证码文本
        captchaText = generateCaptchaText();

        // 绘制背景 - 修复背景颜色问题
        ctx.fillStyle = '#f5f5f7'; // 使用具体的颜色值而不是CSS变量
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 添加干扰线
        for (let i = 0; i < 8; i++) {
            ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.2)`;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.bezierCurveTo(
                Math.random() * canvas.width, Math.random() * canvas.height,
                Math.random() * canvas.width, Math.random() * canvas.height,
                Math.random() * canvas.width, Math.random() * canvas.height
            );
            ctx.stroke();
        }

        // 添加干扰点
        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.2)`;
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
            ctx.fill();
        }

        // 绘制文本
        const chars = captchaText.split('');
        chars.forEach((char, i) => {
            const x = (i + 1) * (canvas.width / (chars.length + 1));
            const y = canvas.height / 2;
            ctx.font = `${Math.random() * 8 + 28}px Arial`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            
            // 随机旋转和位置偏移
            const rotate = Math.random() * 0.4 - 0.2;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotate);
            
            // 随机颜色和描边
            const hue = Math.random() * 360;
            ctx.fillStyle = `hsl(${hue}, 70%, 30%)`;
            ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
            ctx.lineWidth = 1;
            
            // 添加文字阴影
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            ctx.strokeText(char, 0, 0);
            ctx.fillText(char, 0, 0);
            ctx.restore();
        });

        // 更新验证码图片
        captchaImage.innerHTML = '';
        captchaImage.appendChild(canvas);
    }

    // 生成验证码文本
    function generateCaptchaText() {
        const types = [
            // 复杂数学运算
            () => {
                const operators = ['+', '-', '×'];
                const num1 = Math.floor(Math.random() * 20);
                const num2 = Math.floor(Math.random() * 20);
                const num3 = Math.floor(Math.random() * 10);
                const op1 = operators[Math.floor(Math.random() * operators.length)];
                const op2 = operators[Math.floor(Math.random() * operators.length)];
                return `${num1}${op1}${num2}${op2}${num3}=?`;
            },
            // 随机字母数字组合（增加长度和复杂度）
            () => {
                const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
                return Array.from({length: 6}, () => 
                    chars[Math.floor(Math.random() * chars.length)]
                ).join('');
            },
            // 单词混淆
            () => {
                const words = [
                    'SECURITY', 'VALIDATE', 'PROTECT', 
                    'VERIFY', 'CONFIRM', 'ACCESS',
                    'SYSTEM', 'CONTROL', 'SHIELD'
                ];
                const word = words[Math.floor(Math.random() * words.length)];
                // 随机打乱字母顺序
                return word.split('').sort(() => Math.random() - 0.5).join('');
            },
            // 图案识别（使用特殊字符组成的图案）
            () => {
                const patterns = [
                    '▲△□○',
                    '★☆◆◇',
                    '♠♥♦♣',
                    '⬡⬢⬣��'
                ];
                return patterns[Math.floor(Math.random() * patterns.length)];
            }
        ];

        // 随机选择一种验证码类型
        const generator = types[Math.floor(Math.random() * types.length)];
        return generator();
    }

    // 验证码验证
    function validateCaptcha(input) {
        if (!captchaText || !input) return false;

        // 根据验证码类型进行不同的验证
        if (captchaText.includes('=?')) {
            // 复杂数学运算验证
            const [expression] = captchaText.split('=');
            const nums = expression.split(/[+\-×]/).map(Number);
            const ops = expression.match(/[+\-×]/g);
            
            let result = nums[0];
            for (let i = 0; i < ops.length; i++) {
                switch (ops[i]) {
                    case '+': result += nums[i + 1]; break;
                    case '-': result -= nums[i + 1]; break;
                    case '×': result *= nums[i + 1]; break;
                }
            }
            return parseInt(input) === result;
        } else if (/^[▲△□○★☆◆◇♠♥♦♣⬡⬢⬣⬤]+$/.test(captchaText)) {
            // 图案识别验证
            return input === captchaText;
        } else if (captchaText.length > 5) {
            // ��母数字组合验证（区分大小写）
            return input === captchaText;
        } else {
            // 单词混淆验证
            const sortedInput = input.toUpperCase().split('').sort().join('');
            const sortedCaptcha = captchaText.split('').sort().join('');
            return sortedInput === sortedCaptcha;
        }
    }

    // 刷新验证码
    refreshCaptchaBtn.addEventListener('click', generateCaptcha);

    // 密码显示/隐藏
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        this.className = `fas ${type === 'password' ? 'fa-eye-slash' : 'fa-eye'} toggle-password`;
    });

    // 登录表单提交
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const captchaInput = document.getElementById('captcha');
        if (!validateCaptcha(captchaInput.value)) {
            showMessage('验证码错误', 'error');
            generateCaptcha();
            captchaInput.value = '';
            captchaInput.focus();
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        try {
            const loginBtn = this.querySelector('button[type="submit"]');
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';
            loginBtn.disabled = true;

            // TODO: 调用登录API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 保存登录信息
            const loginInfo = {
                email,
                lastLoginTime: new Date().toISOString(),
                lastLoginIP: await getClientIP()
            };

            if (rememberMeCheckbox.checked) {
                localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
                localStorage.setItem('adminLoggedIn', 'true');
            } else {
                sessionStorage.setItem('loginInfo', JSON.stringify(loginInfo));
                sessionStorage.setItem('adminLoggedIn', 'true');
            }

            showMessage('登录成功', 'success');
            setTimeout(() => {
                window.location.href = './index.html';
            }, 1000);

        } catch (error) {
            showMessage(error.message || '登录失败，请重试', 'error');
            loginBtn.innerHTML = '登录';
            loginBtn.disabled = false;
            generateCaptcha();
        }
    });

    // 获取客户端IP
    async function getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return 'unknown';
        }
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

    // 初始化
    generateCaptcha();
});