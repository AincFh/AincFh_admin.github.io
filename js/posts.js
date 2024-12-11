document.addEventListener('DOMContentLoaded', function() {
    // 模拟文章数据
    const posts = [
        {
            id: 1,
            title: "如何使用 Vue3 构建现代化应用",
            category: "技术",
            status: "published",
            publishTime: "2024-01-15 14:30",
            views: 1250
        },
        {
            id: 2,
            title: "JavaScript 异步编程最佳实践",
            category: "技术",
            status: "published",
            publishTime: "2024-01-14 10:20",
            views: 986
        },
        {
            id: 3,
            title: "2024年前端开发趋势展望",
            category: "技术",
            status: "draft",
            publishTime: "2024-01-13 16:45",
            views: 0
        }
    ];

    // 渲染文章列表
    function renderPosts(data) {
        const tbody = document.querySelector('.posts-table tbody');
        tbody.innerHTML = data.map(post => `
            <tr>
                <td>${post.title}</td>
                <td>${post.category}</td>
                <td>
                    <span class="status-tag ${post.status === 'published' ? 'status-published' : 'status-draft'}">
                        ${post.status === 'published' ? '已发布' : '草稿'}
                    </span>
                </td>
                <td>${post.publishTime}</td>
                <td>${post.views}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${post.id}">
                            <i class="fas fa-edit"></i>
                            编辑
                        </button>
                        <button class="action-btn delete-btn" data-id="${post.id}">
                            <i class="fas fa-trash"></i>
                            删除
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // 搜索功能
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', function() {
        const keyword = this.value.toLowerCase();
        const filteredPosts = posts.filter(post => 
            post.title.toLowerCase().includes(keyword)
        );
        renderPosts(filteredPosts);
    });

    // 分类筛选
    const categoryFilter = document.querySelector('.category-filter');
    categoryFilter.addEventListener('change', function() {
        const category = this.value;
        const filteredPosts = category ? 
            posts.filter(post => post.category === category) : 
            posts;
        renderPosts(filteredPosts);
    });

    // 状态筛选
    const statusFilter = document.querySelector('.status-filter');
    statusFilter.addEventListener('change', function() {
        const status = this.value;
        const filteredPosts = status ? 
            posts.filter(post => post.status === status) : 
            posts;
        renderPosts(filteredPosts);
    });

    // 删除文章
    document.addEventListener('click', function(e) {
        if (e.target.closest('.delete-btn')) {
            const id = e.target.closest('.delete-btn').dataset.id;
            
            showConfirm({
                title: '删除确认',
                message: '确定要删除这篇文章吗？删除后将无法恢复。',
                confirmText: '删除',
                onConfirm: async () => {
                    try {
                        // TODO: 调用删除API
                        console.log('删除文章:', id);
                        showMessage('文章已删除', 'success');
                        // 刷新列表
                        renderPosts();
                    } catch (error) {
                        showMessage('删除失败，请重试', 'error');
                    }
                }
            });
        }
    });

    // 编辑文章
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-btn')) {
            const id = e.target.closest('.edit-btn').dataset.id;
            window.location.href = `./edit.html?id=${id}`;
        }
    });

    // 初始化渲染
    renderPosts(posts);
}); 