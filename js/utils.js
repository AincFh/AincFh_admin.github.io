function showConfirm(options) {
    const { title, message, confirmText = '确定', cancelText = '取消', onConfirm, onCancel } = options;

    // 创建弹窗元素
    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    modal.innerHTML = `
        <div class="confirm-content">
            <h3>${title}</h3>
            <p>${message}</p>
            <div class="confirm-actions">
                <button class="cancel-btn">${cancelText}</button>
                <button class="confirm-btn">${confirmText}</button>
            </div>
        </div>
    `;

    // 添加到页面
    document.body.appendChild(modal);
    
    // 显示动画
    setTimeout(() => modal.classList.add('show'), 10);

    // 绑定按钮事件
    const confirmBtn = modal.querySelector('.confirm-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');

    confirmBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            if (onConfirm) onConfirm();
        }, 300);
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            if (onCancel) onCancel();
        }, 300);
    });
}