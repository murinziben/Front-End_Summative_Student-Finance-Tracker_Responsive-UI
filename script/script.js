// State management (in-memory storage for prototype)
let transactions = [];
let settings = { eurRate: 1.10, rwfRate: 0.00078, budgetCap: 0 };
let currentSort = { field: 'date', order: 'desc' };

// Seed data - fallback if seed.json doesn't load
const seedData = {
    "transactions": [
        {
            "id": "txn_1",
            "description": "Lunch at cafeteria",
            "amount": 12.50,
            "category": "Food",
            "date": "2025-10-05",
            "createdAt": "2025-10-05T12:30:00.000Z",
            "updatedAt": "2025-10-05T12:30:00.000Z"
        },
        {
            "id": "txn_2",
            "description": "Chemistry textbook",
            "amount": 89.99,
            "category": "Books",
            "date": "2025-10-03",
            "createdAt": "2025-10-03T09:15:00.000Z",
            "updatedAt": "2025-10-03T09:15:00.000Z"
        },
        {
            "id": "txn_3",
            "description": "Bus pass",
            "amount": 45.00,
            "category": "Transport",
            "date": "2025-09-30",
            "createdAt": "2025-09-30T08:00:00.000Z",
            "updatedAt": "2025-09-30T08:00:00.000Z"
        },
        {
            "id": "txn_4",
            "description": "Coffee with friends",
            "amount": 8.75,
            "category": "Entertainment",
            "date": "2025-10-08",
            "createdAt": "2025-10-08T16:45:00.000Z",
            "updatedAt": "2025-10-08T16:45:00.000Z"
        },
        {
            "id": "txn_5",
            "description": "Pizza dinner",
            "amount": 15.50,
            "category": "Food",
            "date": "2025-10-07",
            "createdAt": "2025-10-07T19:20:00.000Z",
            "updatedAt": "2025-10-07T19:20:00.000Z"
        }
    ]
};

// Initialize with seed data
async function initializeSeedData() {
    try {
        // Try to load from external seed.json file
        const response = await fetch('seed.json');
        if (response.ok) {
            const data = await response.json();
            transactions = data.transactions || [];
            console.log('Loaded seed data from seed.json');
        } else {
            throw new Error('Failed to load seed.json');
        }
    } catch (error) {
        // Fallback to embedded seed data
        console.log('Using embedded seed data (seed.json not accessible)');
        transactions = seedData.transactions;
    }
    
    renderTransactions();
    updateDashboard();
}

// Navigation
const navButtons = document.querySelectorAll('.nav-btn');
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        navigateTo(page);
    });
});

function navigateTo(page) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(page).classList.add('active');
    navButtons.forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
}

// Regex validators
const validators = {
    description: /^\S(?:.*\S)?$/,
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    duplicateWord: /\b(\w+)\s+\1\b/i
};

// Form validation
const form = document.getElementById('transactionForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    let isValid = true;

    // Validate description
    if (!validators.description.test(description)) {
        showError('descError', 'Description cannot have leading/trailing spaces');
        isValid = false;
    } else if (validators.duplicateWord.test(description)) {
        showError('descError', 'Description contains duplicate words');
        isValid = false;
    } else {
        hideError('descError');
    }

    // Validate amount
    if (!validators.amount.test(amount)) {
        showError('amountError', 'Amount must be a valid number (e.g., 12.50)');
        isValid = false;
    } else {
        hideError('amountError');
    }

    // Validate date
    if (!validators.date.test(date)) {
        showError('dateError', 'Date must be in YYYY-MM-DD format');
        isValid = false;
    } else {
        hideError('dateError');
    }

    if (isValid) {
        addTransaction(description, parseFloat(amount), category, date);
    }
});

function showError(id, message) {
    const error = document.getElementById(id);
    error.textContent = message;
    error.classList.add('show');
}

function hideError(id) {
    const error = document.getElementById(id);
    error.classList.remove('show');
}

// Add transaction
function addTransaction(description, amount, category, date) {
    const id = `txn_${Date.now()}`;
    const now = new Date().toISOString();
    
    const transaction = {
        id,
        description,
        amount,
        category,
        date,
        createdAt: now,
        updatedAt: now
    };

    transactions.push(transaction);
    form.reset();
    showStatus('Transaction added successfully!', 'success');
    renderTransactions();
    updateDashboard();
    navigateTo('transactions');
}

// Render transactions
function renderTransactions(filteredTransactions = null) {
    const tbody = document.getElementById('transactionsTable');
    const data = filteredTransactions || transactions;

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <p>No transactions found</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.map(t => `
        <tr>
            <td>${t.date}</td>
            <td>${highlightMatches(t.description)}</td>
            <td>$${t.amount.toFixed(2)}</td>
            <td>${t.category}</td>
            <td class="actions">
                <button class="btn-secondary" onclick="editTransaction('${t.id}')">Edit</button>
                <button class="btn-danger" onclick="deleteTransaction('${t.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Search functionality
let currentRegex = null;
const searchInput = document.getElementById('searchInput');
const caseInsensitive = document.getElementById('caseInsensitive');

searchInput.addEventListener('input', performSearch);
caseInsensitive.addEventListener('change', performSearch);

function performSearch() {
    const pattern = searchInput.value;
    
    if (!pattern) {
        currentRegex = null;
        renderTransactions();
        return;
    }

    try {
        const flags = caseInsensitive.checked ? 'gi' : 'g';
        currentRegex = new RegExp(pattern, flags);
        
        const filtered = transactions.filter(t => 
            currentRegex.test(t.description) || 
            currentRegex.test(t.category) ||
            currentRegex.test(t.amount.toString())
        );

        renderTransactions(filtered);
        searchInput.style.borderColor = '';
    } catch (error) {
        searchInput.style.borderColor = 'var(--danger)';
        currentRegex = null;
    }
}

function highlightMatches(text) {
    if (!currentRegex) return text;
    return text.replace(currentRegex, match => `<mark>${match}</mark>`);
}

// Sort table
function sortTable(field) {
    if (currentSort.field === field) {
        currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort = { field, order: 'asc' };
    }

    transactions.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        if (field === 'amount') {
            valA = parseFloat(valA);
            valB = parseFloat(valB);
        }

        if (currentSort.order === 'asc') {
            return valA > valB ? 1 : -1;
        } else {
            return valA < valB ? 1 : -1;
        }
    });

    renderTransactions();
}

// Delete transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        renderTransactions();
        updateDashboard();
        showStatus('Transaction deleted', 'success');
    }
}

// Edit transaction (simplified for prototype)
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        if (confirm('Are you sure you want to edit this transaction?')) {
            // Fill form fields with transaction data
            document.getElementById('description').value = transaction.description;
            document.getElementById('amount').value = transaction.amount;
            document.getElementById('category').value = transaction.category;
            document.getElementById('date').value = transaction.date;

            // Navigate to edit form
            navigateTo('add');

            // Remove the old transaction entry silently (no delete message)
            transactions = transactions.filter(t => t.id !== id);

            // Update UI
            renderTransactions();
            updateDashboard();

            showStatus('Transaction ready to edit', 'info');
        }
    }
}


// Update dashboard
function updateDashboard() {
    const total = transactions.length;
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Top category
    const categories = {};
    transactions.forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    const topCategory = Object.keys(categories).reduce((a, b) => 
        categories[a] > categories[b] ? a : b, '-');

    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7Days = transactions
        .filter(t => new Date(t.date) >= sevenDaysAgo)
        .reduce((sum, t) => sum + t.amount, 0);

    document.getElementById('totalTransactions').textContent = total;
    document.getElementById('totalSpent').textContent = `$${totalSpent.toFixed(2)}`;
    document.getElementById('topCategory').textContent = topCategory;
    document.getElementById('last7Days').textContent = `$${last7Days.toFixed(2)}`;

    updateBudgetStatus(totalSpent);
}

// Budget cap monitoring
const budgetCapInput = document.getElementById('budgetCap');
budgetCapInput.addEventListener('input', () => {
    settings.budgetCap = parseFloat(budgetCapInput.value) || 0;
    updateBudgetStatus();
});

function updateBudgetStatus(totalSpent) {
    const budgetStatus = document.getElementById('budgetStatus');
    const cap = settings.budgetCap;

    if (!cap || cap === 0) {
        budgetStatus.textContent = '';
        budgetStatus.setAttribute('aria-live', 'off');
        return;
    }

    totalSpent = totalSpent || transactions.reduce((sum, t) => sum + t.amount, 0);
    const remaining = cap - totalSpent;
    const percentage = (totalSpent / cap * 100).toFixed(1);

    if (remaining >= 0) {
        budgetStatus.textContent = `✓ You have $${remaining.toFixed(2)} remaining (${percentage}% used)`;
        budgetStatus.style.color = 'var(--success)';
        budgetStatus.setAttribute('aria-live', 'polite');
    } else {
        budgetStatus.textContent = `⚠️ You are $${Math.abs(remaining).toFixed(2)} over budget! (${percentage}% used)`;
        budgetStatus.style.color = 'var(--danger)';
        budgetStatus.setAttribute('aria-live', 'assertive');
    }
}

// Import/Export
function exportData() {
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-tracker-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showStatus('Data exported successfully!', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format');
            }

            // Validate each transaction
            const isValid = data.every(t => 
                t.id && t.description && 
                typeof t.amount === 'number' && 
                t.category && t.date
            );

            if (!isValid) {
                throw new Error('Invalid transaction structure');
            }

            transactions = data;
            renderTransactions();
            updateDashboard();
            showStatus('Data imported successfully!', 'success');
        } catch (error) {
            showStatus('Import failed: Invalid JSON format', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// Settings
function saveSettings() {
    settings.eurRate = parseFloat(document.getElementById('eurRate').value) || 1.10;
    settings.rwfRate = parseFloat(document.getElementById('rwfRate').value) || 0.00078;
    showStatus('Settings saved successfully!', 'success');
}

function clearAllData() {
    if (confirm('Are you sure you want to delete ALL transactions? This cannot be undone!')) {
        transactions = [];
        renderTransactions();
        updateDashboard();
        showStatus('All data cleared', 'success');
    }
}

// Status messages
function showStatus(message, type) {
    const status = document.getElementById('statusMessage');
    status.textContent = message;
    status.className = `status-message show ${type}`;
    setTimeout(() => {
        status.className = 'status-message';
    }, 3000);
}

// Initialize on page load
initializeSeedData();

// Set today's date as default
document.getElementById('date').value = new Date().toISOString().split('T')[0];

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Alt+D for Dashboard
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        navigateTo('dashboard');
    }
    // Alt+T for Transactions
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        navigateTo('transactions');
    }
    // Alt+A for Add
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        navigateTo('add');
    }
});
