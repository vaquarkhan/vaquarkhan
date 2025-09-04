// Code Generation and Editor System
class CodeGenerator {
    constructor() {
        this.generatedCode = {};
        this.currentLanguage = 'react-typescript';
        this.editor = null;
    }

    async generateFrameworkCode(storyId, language) {
        const story = this.getStoryById(storyId);
        const architecture = window.architectureManager?.currentArchitecture;
        
        if (!story) return null;

        const prompt = this.buildCodePrompt(story, architecture, language);
        
        try {
            const code = await this.callCodeAI(prompt, language);
            this.generatedCode[storyId] = {
                language,
                files: code.files,
                structure: code.structure,
                timestamp: new Date().toISOString()
            };
            
            this.saveGeneratedCode();
            return this.generatedCode[storyId];
        } catch (error) {
            console.error('Code generation failed:', error);
            return null;
        }
    }

    buildCodePrompt(story, architecture, language) {
        return `
Generate ${language} implementation for: ${story.title}

Story: ${story.description}
Acceptance Criteria: ${story.acceptanceCriteria.join(', ')}

${architecture ? `Architecture Context: ${architecture.content}` : ''}

Generate complete, production-ready code including:
1. Main component/service files
2. Types/interfaces
3. Tests
4. Configuration
5. Documentation
        `;
    }

    showCodeGeneratorModal(storyId) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay code-generator-modal';
        modal.innerHTML = `
            <div class="modal-content code-content">
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                <h2>💻 Code Generator</h2>
                
                <div class="code-generator-header">
                    <div class="language-selector">
                        <label>Programming Language:</label>
                        <select id="code-language-select">
                            <option value="react-typescript">React + TypeScript</option>
                            <option value="vue-typescript">Vue + TypeScript</option>
                            <option value="angular-typescript">Angular + TypeScript</option>
                            <option value="python-fastapi">Python + FastAPI</option>
                            <option value="java-spring">Java + Spring Boot</option>
                            <option value="csharp-dotnet">C# + .NET</option>
                            <option value="nodejs-express">Node.js + Express</option>
                            <option value="go-gin">Go + Gin</option>
                            <option value="rust-actix">Rust + Actix</option>
                        </select>
                    </div>
                    
                    <button id="generate-code-btn" class="action-button">Generate Code</button>
                </div>

                <div id="code-result" class="code-result" style="display: none;">
                    <div class="code-editor-container">
                        <div class="file-explorer">
                            <h4>📁 Project Structure</h4>
                            <div id="file-tree"></div>
                        </div>
                        
                        <div class="code-editor-panel">
                            <div class="editor-header">
                                <span id="current-file">Select a file</span>
                                <div class="editor-actions">
                                    <button id="save-code" class="btn-small">💾 Save</button>
                                    <button id="copy-code" class="btn-small">📋 Copy</button>
                                    <button id="download-code" class="btn-small">⬇️ Download</button>
                                </div>
                            </div>
                            <div id="code-editor"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupCodeGeneratorEvents(storyId, modal);
    }

    setupCodeGeneratorEvents(storyId, modal) {
        const generateBtn = modal.querySelector('#generate-code-btn');
        const languageSelect = modal.querySelector('#code-language-select');

        generateBtn.addEventListener('click', async () => {
            const language = languageSelect.value;
            
            generateBtn.textContent = 'Generating...';
            generateBtn.disabled = true;

            const codeResult = await this.generateFrameworkCode(storyId, language);
            
            if (codeResult) {
                this.displayCodeResult(modal, codeResult);
                modal.querySelector('#code-result').style.display = 'flex';
                
                // Mark framework story as complete
                const stories = JSON.parse(localStorage.getItem('projectStories') || '[]');
                const fwStory = stories.find(s => s.id === storyId);
                if (fwStory) {
                    fwStory.status = 'done';
                    localStorage.setItem('projectStories', JSON.stringify(stories));
                    window.projectStories?.checkAndUnblockStories();
                }
            }

            generateBtn.textContent = 'Generate Code';
            generateBtn.disabled = false;
        });

        // Editor actions
        modal.querySelector('#save-code').addEventListener('click', () => this.saveCurrentFile());
        modal.querySelector('#copy-code').addEventListener('click', () => this.copyCurrentFile());
        modal.querySelector('#download-code').addEventListener('click', () => this.downloadAllFiles());
    }

    displayCodeResult(modal, codeResult) {
        // File tree
        const fileTree = modal.querySelector('#file-tree');
        fileTree.innerHTML = this.generateFileTree(codeResult.structure);

        // Initialize code editor
        this.initializeCodeEditor(modal, codeResult.files);

        // File tree click events
        fileTree.addEventListener('click', (e) => {
            if (e.target.classList.contains('file-item')) {
                const filePath = e.target.dataset.path;
                this.loadFileInEditor(filePath, codeResult.files);
                modal.querySelector('#current-file').textContent = filePath;
            }
        });
    }

    generateFileTree(structure) {
        return `
            <div class="file-tree">
                ${Object.keys(structure).map(path => `
                    <div class="file-item" data-path="${path}">
                        <span class="file-icon">${this.getFileIcon(path)}</span>
                        <span class="file-name">${path}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getFileIcon(path) {
        const ext = path.split('.').pop();
        const icons = {
            'ts': '🟦', 'tsx': '⚛️', 'js': '🟨', 'jsx': '⚛️',
            'py': '🐍', 'java': '☕', 'cs': '🔷', 'go': '🐹',
            'rs': '🦀', 'json': '📄', 'md': '📝', 'css': '🎨'
        };
        return icons[ext] || '📄';
    }

    initializeCodeEditor(modal, files) {
        const editorDiv = modal.querySelector('#code-editor');
        
        editorDiv.innerHTML = `<div id="monaco-editor" style="height: 100%; width: 100%;"></div>`;

        // Initialize Monaco Editor with VS Code theme
        if (window.require) {
            require(['vs/editor/editor.main'], () => {
                this.editor = window.monaco.editor.create(editorDiv.querySelector('#monaco-editor'), {
                    value: '',
                    language: 'typescript',
                    theme: 'vscode-dark',
                    automaticLayout: true,
                    fontSize: 14,
                    fontFamily: 'Consolas, "Courier New", monospace',
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    folding: true,
                    bracketMatching: 'always',
                    autoIndent: 'full',
                    formatOnPaste: true,
                    formatOnType: true,
                    suggestOnTriggerCharacters: true,
                    acceptSuggestionOnEnter: 'on',
                    tabCompletion: 'on',
                    contextmenu: true,
                    mouseWheelZoom: true
                });
                
                // Load first file after editor is ready
                const firstFile = Object.keys(files)[0];
                if (firstFile) {
                    this.loadFileInEditor(firstFile, files);
                    modal.querySelector('#current-file').textContent = firstFile;
                }
            });
        } else {
            // Fallback - create Monaco manually
            setTimeout(() => {
                if (window.monaco) {
                    this.editor = window.monaco.editor.create(editorDiv.querySelector('#monaco-editor'), {
                        value: '',
                        language: 'typescript',
                        theme: 'vscode-dark',
                        automaticLayout: true,
                        fontSize: 14,
                        fontFamily: 'Consolas, "Courier New", monospace',
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        lineNumbers: 'on',
                        folding: true
                    });
                    
                    const firstFile = Object.keys(files)[0];
                    if (firstFile) {
                        this.loadFileInEditor(firstFile, files);
                        modal.querySelector('#current-file').textContent = firstFile;
                    }
                }
            }, 1000);
        }
    }

    loadFileInEditor(filePath, files) {
        if (this.editor && files[filePath]) {
            if (window.monaco && this.editor.setValue) {
                // Monaco Editor
                this.editor.setValue(files[filePath]);
                const ext = filePath.split('.').pop();
                const language = this.getMonacoLanguage(ext);
                window.monaco.editor.setModelLanguage(this.editor.getModel(), language);
            } else {
                // Textarea fallback
                this.editor.value = files[filePath];
            }
            this.currentFile = filePath;
        }
    }

    saveCurrentFile() {
        if (this.editor && this.currentFile) {
            let content;
            if (window.monaco && this.editor.getValue) {
                content = this.editor.getValue();
            } else {
                content = this.editor.value;
            }
            
            const storyId = this.getCurrentStoryId();
            if (this.generatedCode[storyId]) {
                this.generatedCode[storyId].files[this.currentFile] = content;
                this.saveGeneratedCode();
            }
            alert('File saved!');
        }
    }

    copyCurrentFile() {
        if (this.editor) {
            let content;
            if (window.monaco && this.editor.getValue) {
                content = this.editor.getValue();
            } else {
                content = this.editor.value;
            }
            navigator.clipboard.writeText(content);
            alert('Code copied to clipboard!');
        }
    }

    downloadAllFiles() {
        const storyId = this.getCurrentStoryId();
        const codeData = this.generatedCode[storyId];
        
        if (codeData) {
            const zip = this.createZipFile(codeData.files);
            this.downloadFile(zip, `${storyId}-code.zip`);
        }
    }

    createZipFile(files) {
        // Simple file bundling (in real implementation, use JSZip)
        let content = '';
        Object.keys(files).forEach(path => {
            content += `\n\n=== ${path} ===\n${files[path]}`;
        });
        return content;
    }

    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    async callCodeAI(prompt, language) {
        const storyId = this.getCurrentStoryId();
        const story = this.getStoryById(storyId);
        const storyTitle = story?.title || 'Component';
        
        if (storyTitle.includes('Login')) {
            return this.generateLoginCode(language);
        } else if (storyTitle.includes('Dashboard')) {
            return this.generateDashboardCode(language);
        } else if (storyTitle.includes('Profile')) {
            return this.generateProfileCode(language);
        }
        
        return this.generateDefaultCode(storyTitle, language);
    }
    
    generateLoginCode(language) {
        if (language === 'react-typescript') {
            return {
                files: {
                    'src/Login.tsx': `import React, { useState } from 'react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'demo@test.com' && password === 'password') {
      alert('Login successful!');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};`
                },
                structure: { 'src/Login.tsx': 'component' }
            };
        }
        return { files: { 'auth.py': 'def login(email, password):\n    return email == "demo@test.com" and password == "password"' }, structure: {} };
    }
    
    generateDashboardCode(language) {
        if (language === 'react-typescript') {
            return {
                files: {
                    'src/Dashboard.tsx': `import React from 'react';

export const Dashboard = () => {
  const handleLogout = () => {
    alert('Logged out!');
  };

  return (
    <div>
      <h1>Welcome, User!</h1>
      <nav>
        <a href="/profile">Profile</a>
        <a href="/settings">Settings</a>
      </nav>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};`
                },
                structure: { 'src/Dashboard.tsx': 'component' }
            };
        }
        return { files: { 'dashboard.py': 'def dashboard():\n    return "Welcome to dashboard"' }, structure: {} };
    }
    
    generateProfileCode(language) {
        if (language === 'react-typescript') {
            return {
                files: {
                    'src/Profile.tsx': `import React, { useState } from 'react';

export const Profile = () => {
  const [name, setName] = useState('Demo User');
  const [email, setEmail] = useState('demo@test.com');
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    alert('Profile saved!');
  };

  return (
    <div>
      <h2>Profile</h2>
      {editing ? (
        <div>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};`
                },
                structure: { 'src/Profile.tsx': 'component' }
            };
        }
        return { files: { 'profile.py': 'def profile():\n    return "User profile"' }, structure: {} };
    }
    
    generateDefaultCode(title, language) {
        return {
            files: {
                'src/Component.tsx': `import React from 'react';\n\nexport const Component = () => {\n  return <div><h2>${title}</h2></div>;\n};`
            },
            structure: { 'src/Component.tsx': 'component' }
        };
    }

    getStoryById(storyId) {
        const stories = JSON.parse(localStorage.getItem('projectStories') || '[]');
        return stories.find(s => s.id === storyId);
    }

    getCurrentStoryId() {
        const modal = document.querySelector('.code-generator-modal');
        return modal?.dataset?.storyId || Object.keys(this.generatedCode)[0];
    }
    
    getMonacoLanguage(ext) {
        const langMap = {
            'ts': 'typescript', 'tsx': 'typescript', 'js': 'javascript', 'jsx': 'javascript',
            'py': 'python', 'java': 'java', 'cs': 'csharp', 'go': 'go',
            'rs': 'rust', 'json': 'json', 'css': 'css', 'html': 'html'
        };
        return langMap[ext] || 'plaintext';
    }

    saveGeneratedCode() {
        localStorage.setItem('generatedCode', JSON.stringify(this.generatedCode));
    }

    loadGeneratedCode() {
        const saved = localStorage.getItem('generatedCode');
        if (saved) {
            this.generatedCode = JSON.parse(saved);
        }
    }
}

// Initialize Code Generator
window.codeGenerator = new CodeGenerator();
window.codeGenerator.loadGeneratedCode();