/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

/**
 * Sanitize log content to prevent log injection
 */
export function sanitizeLog(content: string): string {
    return content.replace(/[\r\n\t]/g, ' ').replace(/[<>]/g, '');
}