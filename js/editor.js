document.addEventListener('DOMContentLoaded', function() {
    const editor = document.querySelector('.editor-content');
    const toolbar = document.querySelector('.editor-toolbar');
    const form = document.getElementById('postForm');

    // 工具栏按钮点击处理
    toolbar.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (!button) return;

        e.preventDefault();
        const command = button.dataset.command;

        switch(command) {
            case 'h1':
            case 'h2':
            case 'h3':
                document.execCommand('formatBlock', false, command);
                break;

            case 'createLink':
                const url = prompt('请输入链接地址：');
                if (url) document.execCommand(command, false, url);
                break;

            case 'insertImage':
                // 这里可以替换为图片上传功能
                const imageUrl = prompt('请输入图片地址：');
                if (imageUrl) document.execCommand(command, false, imageUrl);
                break;

            case 'code':
                // 插入代码块
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                code.textContent = selection.toString() || 'your code here';
                pre.appendChild(code);
                range.deleteContents();
                range.insertNode(pre);
                break;

            default:
                document.execCommand(command, false, null);
        }

        // 更新按钮状态
        updateToolbarState();
    });

    // 更新工具栏按钮状态
    function updateToolbarState() {
        const buttons = toolbar.querySelectorAll('button[data-command]');
        buttons.forEach(button => {
            const command = button.dataset.command;
            switch(command) {
                case 'h1':
                case 'h2':
                case 'h3':
                    button.classList.toggle('active', 
                        document.queryCommandValue('formatBlock').toLowerCase() === command);
                    break;
                default:
                    button.classList.toggle('active', document.queryCommandState(command));
            }
        });
    }

    // 监听编辑器内容变化
    editor.addEventListener('input', updateToolbarState);
    editor.addEventListener('click', updateToolbarState);

    // 自动保存功能
    let autoSaveTimer;
    editor.addEventListener('input', function() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(autoSave, 3000);
    });

    function autoSave() {
        const content = {
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            tags: document.getElementById('tags').value,
            content: editor.innerHTML
        };
        localStorage.setItem('draft', JSON.stringify(content));
        console.log('自动保存成功');
    }

    // 加载草稿
    function loadDraft() {
        const draft = localStorage.getItem('draft');
        if (draft) {
            const content = JSON.parse(draft);
            document.getElementById('title').value = content.title || '';
            document.getElementById('category').value = content.category || '';
            document.getElementById('tags').value = content.tags || '';
            editor.innerHTML = content.content || '';
        }
    }

    // 保存草稿按钮
    const draftBtn = document.querySelector('.draft-btn');
    draftBtn.addEventListener('click', function() {
        autoSave();
        showMessage('草稿已保存');
    });

    // 发布文章
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
            content: editor.innerHTML,
            status: 'published'
        };

        try {
            // TODO: 调用发布API
            console.log('发布文章:', formData);
            showMessage('文章发布成功', 'success');
            localStorage.removeItem('draft');
            // 发布成功后跳转到文章列表
            setTimeout(() => {
                window.location.href = './index.html';
            }, 1500);
        } catch (error) {
            showMessage('发布失败，请重试', 'error');
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
    loadDraft();
}); 