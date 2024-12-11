document.addEventListener('DOMContentLoaded', function() {
    // 选项卡切换
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有活动状态
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // 添加当前选项卡的活动状态
            tab.classList.add('active');
            const panel = document.getElementById(`${tab.dataset.tab}-panel`);
            panel.classList.add('active');
        });
    });

    // 基本设置表单提交
    const basicSettingsForm = document.getElementById('basicSettingsForm');
    basicSettingsForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
            submitBtn.disabled = true;

            // TODO: 调用保存API
            await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
            showMessage('设置保存成功', 'success');
        } catch (error) {
            showMessage('保存失败，请重试', 'error');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // 安全设置表单提交
    const securityForm = document.getElementById('securityForm');
    securityForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        try {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
            submitBtn.disabled = true;

            // TODO: 调用保存API
            await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
            showMessage('安全设置已更新', 'success');
        } catch (error) {
            showMessage('更新失败，请重试', 'error');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // 备份数据
    const backupBtn = document.querySelector('.backup-btn');
    backupBtn.addEventListener('click', async function() {
        try {
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 备份中...';

            // TODO: 调用备份API
            await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟备份过程
            showMessage('数据备份成功', 'success');
            loadBackupList(); // 刷新备份列表
        } catch (error) {
            showMessage('备份失败，请重试', 'error');
        } finally {
            this.disabled = false;
            this.innerHTML = '<i class="fas fa-download"></i> 立即备份';
        }
    });

    // 恢复备份
    const restoreBtn = document.querySelector('.restore-btn');
    restoreBtn.addEventListener('click', function() {
        // 显示文件选择对话框
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.zip,.sql';
        input.onchange = async function(e) {
            const file = e.target.files[0];
            if (file) {
                try {
                    restoreBtn.disabled = true;
                    restoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 恢复中...';

                    // TODO: 调用恢复API
                    await new Promise(resolve => setTimeout(resolve, 3000)); // 模拟恢复过程
                    showMessage('数据恢复成功', 'success');
                } catch (error) {
                    showMessage('恢复失败，请重试', 'error');
                } finally {
                    restoreBtn.disabled = false;
                    restoreBtn.innerHTML = '<i class="fas fa-upload"></i> 恢复备份';
                }
            }
        };
        input.click();
    });

    // 加载备份列表
    function loadBackupList() {
        const tbody = document.querySelector('.backup-table tbody');
        if (!tbody) return;

        // 模拟备份数据
        const backups = [
            { time: '2024-01-15 14:30:00', size: '2.5MB' },
            { time: '2024-01-14 10:20:00', size: '2.3MB' },
            { time: '2024-01-13 16:45:00', size: '2.4MB' }
        ];

        tbody.innerHTML = backups.map(backup => `
            <tr>
                <td>${backup.time}</td>
                <td>${backup.size}</td>
                <td>
                    <button class="download-btn" data-time="${backup.time}">
                        <i class="fas fa-download"></i>
                        下载
                    </button>
                    <button class="delete-btn" data-time="${backup.time}">
                        <i class="fas fa-trash"></i>
                        删除
                    </button>
                </td>
            </tr>
        `).join('');
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
    loadBackupList();
}); 