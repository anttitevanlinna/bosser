// Bosser LinkedIn Assistant - Logger
// Sends logs directly to Claude Code chat via local HTTP endpoint

class BosserLogger {
    constructor() {
        this.logEndpoint = 'http://localhost:3001/bosser-logs'; // Local Claude Code endpoint
        this.sessionId = this.generateSessionId();
        this.enabled = true;
        this.buffer = [];
        this.flushInterval = 2000; // Send logs every 2 seconds
        
        this.setupPeriodicFlush();
        this.log('info', 'Logger initialized', { sessionId: this.sessionId });
    }
    
    generateSessionId() {
        return 'bosser-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
    }
    
    log(level, message, data = {}) {
        if (!this.enabled) return;
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            level: level.toUpperCase(),
            message,
            data,
            url: window.location?.href || 'background',
            userAgent: navigator.userAgent.substring(0, 100)
        };
        
        // Console log for immediate debugging
        const style = this.getConsoleStyle(level);
        console.log(`%c[BOSSER ${level.toUpperCase()}]%c ${message}`, style, 'color: inherit', data);
        
        // Add to buffer for sending to Claude Code
        this.buffer.push(logEntry);
        
        // Send critical errors immediately
        if (level === 'error' || level === 'critical') {
            this.flush();
        }
    }
    
    getConsoleStyle(level) {
        const styles = {
            info: 'color: #2196F3; font-weight: bold',
            success: 'color: #4CAF50; font-weight: bold', 
            warning: 'color: #FF9800; font-weight: bold',
            error: 'color: #F44336; font-weight: bold',
            critical: 'color: #FF0000; font-weight: bold; background: yellow'
        };
        return styles[level] || styles.info;
    }
    
    info(message, data = {}) {
        this.log('info', message, data);
    }
    
    success(message, data = {}) {
        this.log('success', message, data);
    }
    
    warning(message, data = {}) {
        this.log('warning', message, data);
    }
    
    error(message, error = null, data = {}) {
        const errorData = {
            ...data,
            error: error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : null
        };
        this.log('error', message, errorData);
    }
    
    critical(message, error = null, data = {}) {
        const errorData = {
            ...data,
            error: error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : null
        };
        this.log('critical', message, errorData);
    }
    
    setupPeriodicFlush() {
        setInterval(() => {
            if (this.buffer.length > 0) {
                this.flush();
            }
        }, this.flushInterval);
    }
    
    async flush() {
        if (this.buffer.length === 0) return;
        
        const logsToSend = [...this.buffer];
        this.buffer = [];
        
        try {
            // Try to send to Claude Code local endpoint
            const response = await fetch(this.logEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    source: 'bosser-linkedin-extension',
                    logs: logsToSend
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            // If Claude Code endpoint not available, try alternative methods
            await this.fallbackLog(logsToSend, error);
        }
    }
    
    async fallbackLog(logs, originalError) {
        try {
            // Fallback 1: Try to write to downloads folder
            const logData = {
                timestamp: new Date().toISOString(),
                originalError: originalError.message,
                logs: logs
            };
            
            const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            if (chrome && chrome.downloads) {
                await chrome.downloads.download({
                    url: url,
                    filename: `bosser-logs-${Date.now()}.json`,
                    saveAs: false
                });
            }
            
        } catch (fallbackError) {
            // Ultimate fallback: Just console log with special marker
            console.group('🚨 BOSSER EXTENSION LOGS FOR CLAUDE CODE 🚨');
            logs.forEach(log => {
                console.log(`[${log.timestamp}] ${log.level}: ${log.message}`, log.data);
            });
            console.log('Original logging error:', originalError);
            console.log('Fallback logging error:', fallbackError);
            console.groupEnd();
        }
    }
    
    // Method to manually send logs to Claude Code chat
    async sendToClaudeChat(message = "Extension Activity Log") {
        if (this.buffer.length > 0) {
            await this.flush();
        }
        
        // Create a formatted log summary for Claude Code
        const summary = this.createLogSummary();
        
        // Try to copy to clipboard for easy pasting
        try {
            await navigator.clipboard.writeText(`${message}\n\n${summary}`);
            console.log('📋 Log summary copied to clipboard - paste in Claude Code!');
        } catch (error) {
            console.log('📝 Log summary (copy manually):\n', summary);
        }
    }
    
    createLogSummary() {
        const recent = this.getRecentActivity();
        return `BOSSER EXTENSION LOG SUMMARY
Session: ${this.sessionId}
Time: ${new Date().toISOString()}

Recent Activity:
${recent.map(log => `[${log.level}] ${log.message}`).join('\n')}

Current Status: Extension ${this.enabled ? 'active' : 'inactive'}
Buffer Size: ${this.buffer.length} pending logs
`;
    }
    
    getRecentActivity() {
        // Get recent logs from storage or current buffer
        return this.buffer.slice(-10); // Last 10 logs
    }
}

// Create global logger instance
window.BosserLogger = new BosserLogger();