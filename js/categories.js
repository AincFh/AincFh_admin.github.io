document.addEventListener('DOMContentLoaded', function() {
    // 模拟分类数据
    const categories = [
        {
            id: 1,
            name: "技术",
            postCount: 25,
            createTime: "2024-01-10 10:30"
        },
        {
            id: 2,
            name: "生活",
            postCount: 15,
            createTime: "2024-01-11 14:20"
        },
        {
            id: 3,
            name: "随笔",
            postCount: 8,
            createTime: "2024-01-12 16:45"
        }
    ];

    // 渲染分类列表
    function renderCategories() {
        const tbody = document.querySelector('.categories-table tbody');
        tbody.innerHTML = categories.map(category => `
            <tr>
                <td>${category.name}</td>
                <td>${category.postCount}</td>
                <td>${category.createTime}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${category.id}">
                            <i class="fas fa-edit"></i>
                            编辑
                        </button>
                        <button class="action-btn delete-btn" data-id="${category.id}">
                            <i class="fas fa-trash"></i>
                            删除
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // 显示/隐藏模态框
    const modal = document.getElementById('categoryModal');
    const addBtn = document.querySelector('.add-category-btn');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');

    function showModal(title = '添加分类') {
        modal.classList.add('show');
        modal.querySelector('.modal-header h3').textContent = title;
    }

    function hideModal() {
        modal.classList.remove('show');
        document.getElementById('categoryForm').reset();
    }

    addBtn.addEventListener('click', () => showModal());
    closeBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);

    // 表单提交处理
    const form = document.getElementById('categoryForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('categoryName').value,
            description: document.getElementById('categoryDesc').value
        };

        try {
            // TODO: 调用添加分类API
            console.log('添加分类:', formData);
            showMessage('分类添加成功', 'success');
            hideModal();
            // 刷新列表
            renderCategories();
        } catch (error) {
            showMessage('操作失败，请重试', 'error');
        }
    });

    // 编辑分类
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-btn')) {
            const id = e.target.closest('.edit-btn').dataset.id;
            const category = categories.find(c => c.id === parseInt(id));
            if (category) {
                document.getElementById('categoryName').value = category.name;
                showModal('编辑分类');
            }
        }
    });

    // 删除分类
    document.addEventListener('click', function(e) {
        if (e.target.closest('.delete-btn')) {
            const id = e.target.closest('.delete-btn').dataset.id;
            if (confirm('确定要删除这个分类吗？相关文章将变为未分类状态。')) {
                // TODO: 调用删除API
                console.log('删除分类:', id);
                showMessage('分类删除成功', 'success');
                // 刷新列表
                renderCategories();
            }
        }
    });

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
    renderCategories();
}); 