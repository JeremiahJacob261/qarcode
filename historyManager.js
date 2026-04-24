/**
 * History Manager - Handles localStorage for scans and generated codes
 */

class HistoryManager {
  constructor() {
    this.STORAGE_KEY = 'qarcode_history';
    this.MAX_ITEMS = 50;
  }

  /**
   * Add a new item to history
   */
  addToHistory(item) {
    const history = this.getHistory();
    
    const newItem = {
      id: item.id || Date.now(),
      type: item.type, // 'qr' or 'barcode'
      action: item.action, // 'scan' or 'generate'
      value: item.value,
      timestamp: item.timestamp || new Date().toISOString(),
      image: item.image || null, // Base64 PNG if available
      format: item.format || null,
      confidence: typeof item.confidence === 'number' ? item.confidence : null
    };

    history.unshift(newItem);
    
    // Keep only MAX_ITEMS
    if (history.length > this.MAX_ITEMS) {
      history.pop();
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    return newItem;
  }

  /**
   * Get all history items
   */
  getHistory() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading history:', error);
      return [];
    }
  }

  /**
   * Get history by type (qr, barcode)
   */
  getHistoryByType(type) {
    const history = this.getHistory();
    return history.filter(item => item.type === type);
  }

  /**
   * Get history by action (scan, generate)
   */
  getHistoryByAction(action) {
    const history = this.getHistory();
    return history.filter(item => item.action === action);
  }

  /**
   * Delete a specific item
   */
  deleteItem(id) {
    let history = this.getHistory();
    history = history.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  /**
   * Clear all history
   */
  clearHistory() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Get formatted timestamp
   */
  formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  }

  /**
   * Get icon for code type
   */
  getIconForType(type) {
    return type === 'qr' ? '⊞' : '∥';
  }
}

const historyManager = new HistoryManager();
