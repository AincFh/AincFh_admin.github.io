document.addEventListener('DOMContentLoaded', function() {
    // 模拟评论数据
    const comments = [
        {
            id: 1,
            author: "张三",
            avatar: "../../images/avatar.png",
            content: "这篇文章写得很好，对我帮助很大！",
            article: "Vue3 最佳实践指南",
            articleId: 1,
            time: "2024-01-15 14:30",
            status: "pending"
        },
        {
            id: 2,
            author: "李四",
            avatar: "../../images/avatar.png",
            content: "文章内容有些地方还需要补充...",
            article: "JavaScript 异步编程",
            articleId: 2,
            time: "2024-01-14 16:20",
            status: "approved"
        }
    ];

    // 渲染评论列表
    function renderComments(data = comments) {
        const commentsList = document.querySelector('.comments-list');
        commentsList.innerHTML = data.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <div class="comment-info">
                        <img src="${comment.avatar}" alt="Avatar" class="comment-avatar">
                        <div class="comment-meta">
                            <span class="comment-author">${comment.author}</span>
                            <span class="comment-time">${comment.time}</span>
                        </div>
                    </div>
                    <span class="status-tag status-${comment.status}">
                        ${getStatusText(comment.status)}
                    </span>
                </div>
                <div class="comment-content">${comment.content}</div>
                <a href="#" class="comment-article">
                    <i class="fas fa-link"></i>
                    ${comment.article}
                </a>
                <div class="comment-actions">
                    ${getActionButtons(comment.status, comment.id)}
                </div>
            </div>
        `).join('');
    }

    // 获取状态文本
    function getStatusText(status) {
        const statusMap = {
            pending: '待审核',
            approved: '已通过',
            rejected: '已拒绝'
        };
        return statusMap[status] || status;
    }

    // 获取操作按钮
    function getActionButtons(status, id) {
        if (status === 'pending') {
            return `
                <button class="action-btn approve-btn" data-id="${id}">
                    <i class="fas fa-check"></i>
                    通过
                </button>
                <button class="action-btn reject-btn" data-id="${id}">
                    <i class="fas fa-times"></i>
                    拒绝
                </button>
                <button class="action-btn reply-btn" data-id="${id}">
                    <i class="fas fa-reply"></i>
                    回复
                </button>
            `;
        }
        return `
            <button class="action-btn reply-btn" data-id="${id}">
                <i class="fas fa-reply"></i>
                回复
            </button>
        `;
    }

    // 搜索功能
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', function() {
        const keyword = this.value.toLowerCase();
        const filteredComments = comments.filter(comment => 
            comment.content.toLowerCase().includes(keyword) ||
            comment.author.toLowerCase().includes(keyword)
        );
        renderComments(filteredComments);
    });

    // 状态筛选
    const statusFilter = document.querySelector('.status-filter');
    statusFilter.addEventListener('change', function() {
        const status = this.value;
        const filteredComments = status ? 
            comments.filter(comment => comment.status === status) : 
            comments;
        renderComments(filteredComments);
    });

    // 回复评论
    const replyModal = document.getElementById('replyModal');
    const replyForm = document.getElementById('replyForm');
    let currentCommentId = null;

    document.addEventListener('click', function(e) {
        const replyBtn = e.target.closest('.reply-btn');
        if (replyBtn) {
            currentCommentId = replyBtn.dataset.id;
            replyModal.classList.add('show');
        }
    });

    // 关闭模态框
    document.querySelector('.close-modal').addEventListener('click', () => {
        replyModal.classList.remove('show');
        replyForm.reset();
    });

    document.querySelector('.cancel-btn').addEventListener('click', () => {
        replyModal.classList.remove('show');
        replyForm.reset();
    });

    // 提交回复
    replyForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const content = document.getElementById('replyContent').value;

        try {
            // TODO: 调用回复API
            console.log('回复评论:', { commentId: currentCommentId, content });
            showMessage('回复成功', 'success');
            replyModal.classList.remove('show');
            replyForm.reset();
        } catch (error) {
            showMessage('回复失败，请重试', 'error');
        }
    });

    // 审核评论
    document.addEventListener('click', async function(e) {
        const approveBtn = e.target.closest('.approve-btn');
        const rejectBtn = e.target.closest('.reject-btn');

        if (approveBtn || rejectBtn) {
            const id = (approveBtn || rejectBtn).dataset.id;
            const action = approveBtn ? 'approve' : 'reject';

            try {
                // TODO: 调用审核API
                console.log('审核评论:', { id, action });
                showMessage('操作成功', 'success');
                // 更新评论状态
                const comment = comments.find(c => c.id === parseInt(id));
                if (comment) {
                    comment.status = action === 'approve' ? 'approved' : 'rejected';
                    renderComments();
                }
            } catch (error) {
                showMessage('操作失败，请重试', 'error');
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
    renderComments();
}); 