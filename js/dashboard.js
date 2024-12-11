document.addEventListener('DOMContentLoaded', function() {
    // 退出登录按钮点击事件
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            showConfirm({
                title: '退出确认',
                message: '确定要退出登录吗？',
                onConfirm: () => {
                    // 执行退出登录
                    localStorage.removeItem('adminLoggedIn');
                    sessionStorage.removeItem('adminLoggedIn');
                    window.location.href = '/blog-admin/pages/login.html';
                }
            });
        });
    }
}); 