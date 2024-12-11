document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactSupportForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            contact: document.getElementById('contact').value,
            issue: document.getElementById('issue').value,
            description: document.getElementById('description').value
        };

        try {
            const submitBtn = document.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
            submitBtn.disabled = true;

            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 显示成功弹窗
            showModal('提交成功', '我们已收到您的问题，技术支持人员会尽快与您联系。', () => {
                // 弹窗关闭后跳转回登录页
                window.location.href = './login.html';
            });

        } catch (error) {
            showModal('提交失败', '请稍后重试');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // 添加弹窗显示函数
    function showModal(title, message, callback) {
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
            setTimeout(() => {
                modal.remove();
                if (callback) callback();  // 如果有回调函数则执行
            }, 300);
        });
    }

    // 获取 select 元素
    const selectElement = document.getElementById('issue');

    // 监听 select 的点击事件
    selectElement.addEventListener('mousedown', function() {
        if (this.getAttribute('aria-expanded') === 'true') {
            this.setAttribute('aria-expanded', 'false');
        } else {
            this.setAttribute('aria-expanded', 'true');
        }
    });

    // 监听选择完成事件
    selectElement.addEventListener('change', function() {
        // 选择后让选择框失去焦点，从而关闭下拉列表
        this.blur();
    });

    // 点击其他地方时关闭下拉框
    document.addEventListener('click', function(e) {
        if (!selectElement.contains(e.target)) {
            selectElement.setAttribute('aria-expanded', 'false');
        }
    });
}); 