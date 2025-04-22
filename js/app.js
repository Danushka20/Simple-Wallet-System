document.addEventListener('DOMContentLoaded', function() {
    
    const userIdInput = document.getElementById('userId');
    const depositAmountInput = document.getElementById('depositAmount');
    const withdrawAmountInput = document.getElementById('withdrawAmount');
    const balanceDisplay = document.getElementById('balanceDisplay');
    const balanceProgress = document.getElementById('balanceProgress');
    const transactionsList = document.getElementById('transactionsList');
    const checkBalanceBtn = document.getElementById('checkBalance');
    const depositBtn = document.getElementById('deposit');
    const withdrawBtn = document.getElementById('withdraw');
    const refreshTransactionsBtn = document.getElementById('refreshTransactions');
    const responseToast = document.getElementById('responseToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toast = new bootstrap.Toast(responseToast);
    
 
    const API_URL = {
        deposit: 'api/deposit.php',
        withdraw: 'api/withdraw.php',
        balance: 'api/balance.php',
        transactions: 'api/transactions.php'
    };
    
    
    checkBalanceBtn.addEventListener('click', checkBalance);
    depositBtn.addEventListener('click', deposit);
    withdrawBtn.addEventListener('click', withdraw);
    refreshTransactionsBtn.addEventListener('click', fetchTransactions);
    
   
    function validateUserId() {
        const userId = userIdInput.value.trim();
        if (!userId) {
            showToast('Error', 'Please enter a User ID', 'danger');
            return false;
        }
        return userId;
    }
    
 
    async function checkBalance() {
        const userId = validateUserId();
        if (!userId) return;
        
        try {
            const response = await fetch(`${API_URL.balance}?user_id=${userId}`);
            const data = await response.json();
            
            if (response.ok) {
                updateBalanceDisplay(data.balance);
                showToast('Success', `Balance: $${data.balance.toFixed(2)}`, 'success');
                fetchTransactions();
            } else {
                showToast('Error', data.error || 'Failed to check balance', 'danger');
            }
        } catch (error) {
            showToast('Error', 'Failed to check balance', 'danger');
            console.error(error);
        }
    }
    
   
    async function deposit() {
        const userId = validateUserId();
        if (!userId) return;
        
        const amount = parseFloat(depositAmountInput.value);
        if (isNaN(amount) || amount <= 0) {
            showToast('Error', 'Please enter a valid amount', 'danger');
            return;
        }
        
        try {
            const response = await fetch(API_URL.deposit, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId, amount: amount })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                depositAmountInput.value = '';
                updateBalanceDisplay(data.balance);
                showToast('Success', data.message, 'success');
                fetchTransactions();
            } else {
                showToast('Error', data.error || 'Failed to deposit', 'danger');
            }
        } catch (error) {
            showToast('Error', 'Failed to deposit', 'danger');
            console.error(error);
        }
    }
    
 
    async function withdraw() {
        const userId = validateUserId();
        if (!userId) return;
        
        const amount = parseFloat(withdrawAmountInput.value);
        if (isNaN(amount) || amount <= 0) {
            showToast('Error', 'Please enter a valid amount', 'danger');
            return;
        }
        
        try {
            const response = await fetch(API_URL.withdraw, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId, amount: amount })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                withdrawAmountInput.value = '';
                updateBalanceDisplay(data.balance);
                showToast('Success', data.message, 'success');
                fetchTransactions();
            } else {
                showToast('Error', data.error || 'Failed to withdraw', 'danger');
            }
        } catch (error) {
            showToast('Error', 'Failed to withdraw', 'danger');
            console.error(error);
        }
    }
    
   
    async function fetchTransactions() {
        const userId = validateUserId();
        if (!userId) return;
        
        try {
            const response = await fetch(`${API_URL.transactions}?user_id=${userId}`);
            const data = await response.json();
            
            if (response.ok) {
                displayTransactions(data.transactions);
            } else {
                showToast('Error', data.error || 'Failed to fetch transactions', 'danger');
            }
        } catch (error) {
            showToast('Error', 'Failed to fetch transactions', 'danger');
            console.error(error);
        }
    }
    
  
    function updateBalanceDisplay(balance) {
        balanceDisplay.textContent = `$${balance.toFixed(2)}`;
        
       
        const progressPercentage = Math.min(balance / 1000 * 100, 100);
        balanceProgress.style.width = `${progressPercentage}%`;
    }
    
    
    function displayTransactions(transactions) {
        if (transactions.length === 0) {
            transactionsList.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-muted">No transactions found</td>
                </tr>
            `;
            return;
        }
        
        transactionsList.innerHTML = transactions.map(transaction => {
            const date = new Date(transaction.timestamp * 1000);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            const typeClass = transaction.type === 'deposit' ? 'transaction-deposit' : 'transaction-withdraw';
            const icon = transaction.type === 'deposit' ? 'bi-arrow-down-circle-fill' : 'bi-arrow-up-circle-fill';
            
            return `
                <tr>
                    <td><i class="bi ${icon} ${typeClass}"></i> ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
                    <td class="${typeClass}">$${transaction.amount.toFixed(2)}</td>
                    <td>${formattedDate}</td>
                </tr>
            `;
        }).join('');
    }
   
    function showToast(title, message, type = 'primary') {
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        
        responseToast.classList.remove('bg-success', 'bg-danger', 'bg-primary', 'bg-warning');
        
      
        switch (type) {
            case 'success':
                responseToast.classList.add('bg-success');
                responseToast.classList.add('text-white');
                break;
            case 'danger':
                responseToast.classList.add('bg-danger');
                responseToast.classList.add('text-white');
                break;
            case 'warning':
                responseToast.classList.add('bg-warning');
                break;
            default:
                responseToast.classList.add('bg-primary');
                responseToast.classList.add('text-white');
        }
        
        toast.show();
    }
});