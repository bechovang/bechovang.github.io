/**
 * Custom Syntax Highlighter for GitFlow Blog
 * Supports: Bash/Shell, YAML, Markdown, Tree structures
 */

(function() {
    'use strict';

    // Language detection patterns
    const patterns = {
        bash: {
            comments: /^#.*$/gm,
            commands: /\b(git|npm|npx|node|python|pip|brew|apt-get|sudo|mkdir|cd|ls|cp|mv|rm|echo|cat|grep|find|tar|curl|wget|ssh|docker|kubectl|mvn|gradle|make|cmake|gcc|g\+\+|javac|java|ruby|gem|bundle|composer|php|python3|pip3|go|rust|cargo)\b/g,
            strings: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
            flags: /(--[\w-]+)/g,
            variables: /(\$[\w]+|<[\w-]+>|\{[\w-]+\}|\$\{[\w-]+\})/g,
            numbers: /\b\d+(\.\d+)?\b/g,
            operators: /([|>&;(){}\[\]<>])/g
        },
        yaml: {
            keys: /^([\s]*)([\w-]+):/gm,
            anchors: /(&[\w-]+|\*[\w-]+)/g,
            strings: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g,
            comments: /#.*$/gm,
            numbers: /\b\d+(\.\d+)?\b/g,
            special: /(true|false|null|yes|no|on|off)/gi
        },
        markdown: {
            headings: /^(#{1,6}\s.*)$/gm,
            lists: /^[\s]*[-*+]\s|^\d+\.\s/gm,
            checkboxes: /\[[ x]\]/gi,
            code: /`[^`]+`/g,
            bold: /\*\*[^*]+\*\*/g,
            italic: /\*[^*]+\*/g
        },
        tree: {
            branches: /[├│└─]/g,
            arrows: /[→←]/g
        }
    };

    // Detect language from content
    function detectLanguage(content) {
        if (/^(stages:|[\w-]+:\s*$|-\s+\w+:)/m.test(content) && /^\s{2,}\w+:/m.test(content)) {
            return 'yaml';
        }
        if (/^#{1,6}\s|^[\s]*[-*+]\s|^\d+\.\s/m.test(content)) {
            return 'markdown';
        }
        if (/[├│└─]/.test(content) && (/──/.test(content) || (/├/.test(content) && /└/.test(content)))) {
            return 'tree';
        }
        if (/^#\s|^\$|&gt;/.test(content) || /\b(git|npm|brew|apt-get|sudo|cd|mkdir)\b/.test(content)) {
            return 'bash';
        }
        return 'bash'; // Default
    }

    // Get language display name
    function getLanguageName(lang) {
        const names = {
            bash: 'Bash',
            yaml: 'YAML',
            markdown: 'Markdown',
            tree: 'Tree'
        };
        return names[lang] || 'Code';
    }

    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Apply syntax highlighting
    function highlightSyntax(content, language) {
        let html = escapeHtml(content);
        const lang = patterns[language];

        if (!lang) return html;

        // Apply patterns in order to avoid conflicts
        const replacements = [];

        // Tree structure highlighting
        if (language === 'tree') {
            html = html.replace(lang.branches, '<span class="code-tree-branch">$&</span>');
            html = html.replace(lang.arrows, '<span class="code-operator">$&</span>');
        }

        // Bash/Shell highlighting
        if (language === 'bash') {
            // Highlight comments first
            html = html.replace(/^([ \t]*)(#.*)$/gm, '$1<span class="code-comment">$2</span>');

            // Highlight strings
            html = html.replace(/(["'])((?:\\.|[^\\])*?)\1/g, '<span class="code-string">$1$2$1</span>');

            // Highlight variables
            html = html.replace(/(<[\w-]+>)/g, '<span class="code-variable">$1</span>');

            // Highlight flags
            html = html.replace(/(--[\w-]+)/g, '<span class="code-git-flag">$1</span>');

            // Highlight commands
            html = html.replace(/\b(git|npm|npx|node|python|pip|brew|apt-get|sudo|mkdir|cd|ls|cp|mv|rm|echo|cat|grep|find|tar|curl|wget|docker|kubectl|mvn|gradle|make|cmake|gcc)\b/g, '<span class="code-git-command">$1</span>');

            // Highlight git subcommands
            html = html.replace(/(git\s+)([\w-]+)/g, '$1<span class="code-function">$2</span>');

            // Highlight numbers
            html = html.replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>');
        }

        // YAML highlighting
        if (language === 'yaml') {
            // Highlight comments (but not inside URLs)
            html = html.replace(/(#)([^\]]*$)/gm, '<span class="code-comment">$1$2</span>');

            // Highlight keys
            html = html.replace(/^([\s]*)([\w-]+)(:)/gm, '$1<span class="code-yaml-key">$2</span>$3');

            // Highlight anchors
            html = html.replace(/(&[\w-]+|\*[\w-]+)/g, '<span class="code-yaml-anchor">$1</span>');

            // Highlight special values
            html = html.replace(/\b(true|false|null|yes|no|on|off)\b/gi, '<span class="code-keyword">$1</span>');

            // Highlight strings
            html = html.replace(/(["'])((?:\\.|[^\\])*?)\1/g, '<span class="code-string">$1$2$1</span>');

            // Highlight numbers
            html = html.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="code-number">$1</span>');
        }

        // Markdown highlighting (inside code blocks)
        if (language === 'markdown') {
            // Highlight headings
            html = html.replace(/^(#{1,6})(\s.*)$/gm, '<span class="code-md-heading">$1$2</span>');

            // Highlight list markers
            html = html.replace(/^(\s*)([-*+]|\d+\.)(\s)/gm, '$1<span class="code-md-list">$2</span>$3');

            // Highlight checkboxes
            html = html.replace(/\[([ x])\]/gi, '<span class="code-md-checkbox">[$1]</span>');

            // Highlight inline code
            html = html.replace(/`([^`]+)`/g, '<span class="code-md-code">`$1`</span>');

            // Highlight comments
            html = html.replace(/(^|\s)(#.*)$/gm, '$1<span class="code-comment">$2</span>');
        }

        return html;
    }

    // Process all code blocks on page load
    function processCodeBlocks() {
        const codeContainers = document.querySelectorAll('.code-block-container');

        codeContainers.forEach(container => {
            const pre = container.querySelector('pre');
            const code = pre.querySelector('code');

            if (!code) return;

            const content = code.textContent || code.innerText;
            const language = detectLanguage(content);

            // Add language label
            const langLabel = document.createElement('span');
            langLabel.className = 'code-lang';
            langLabel.textContent = getLanguageName(language);
            pre.appendChild(langLabel);

            // Apply syntax highlighting
            const highlightedHTML = highlightSyntax(content, language);

            // Preserve whitespace
            const newCode = document.createElement('code');
            newCode.innerHTML = highlightedHTML;

            // Replace existing code
            pre.replaceChild(newCode, code);
        });
    }

    // Run on DOM content loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processCodeBlocks);
    } else {
        processCodeBlocks();
    }

    // Also run after any dynamic content changes
    window.processCodeBlocks = processCodeBlocks;

})();
