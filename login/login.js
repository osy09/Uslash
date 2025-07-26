
// Get form elements
const loginForm = document.getElementById('loginForm');
const userIdInput = document.getElementById('userId');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const userIdError = document.getElementById('userIdError');
const passwordError = document.getElementById('passwordError');

// Link elements
const findIdLink = document.getElementById('findId');
const findPasswordLink = document.getElementById('findPassword');
const signUpLink = document.getElementById('signUp');

// Validation functions
function validateUserId(userId) {
    if (!userId.trim()) {
        return '아이디를 입력해주세요.';
    }
    return '';
}

function validatePassword(password) {
    if (!password.trim()) {
        return '비밀번호를 입력해주세요.';
    }
    return '';
}

// Show error message
function showError(element, message) {
    element.textContent = message;
    element.style.display = message ? 'block' : 'none';
}

// Clear error message
function clearError(element) {
    element.textContent = '';
    element.style.display = 'none';
}

// Real-time validation
userIdInput.addEventListener('blur', function() {
    const error = validateUserId(this.value);
    showError(userIdError, error);
});

passwordInput.addEventListener('blur', function() {
    const error = validatePassword(this.value);
    showError(passwordError, error);
});

// Clear errors on input
userIdInput.addEventListener('input', function() {
    if (userIdError.style.display === 'block') {
        clearError(userIdError);
    }
});

passwordInput.addEventListener('input', function() {
    if (passwordError.style.display === 'block') {
        clearError(passwordError);
    }
});

// Form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const userId = userIdInput.value;
    const password = passwordInput.value;

    // Clear previous errors
    clearError(userIdError);
    clearError(passwordError);

    // Validate inputs
    const userIdErrorMsg = validateUserId(userId);
    const passwordErrorMsg = validatePassword(password);

    let hasErrors = false;

    if (userIdErrorMsg) {
        showError(userIdError, userIdErrorMsg);
        hasErrors = true;
    }

    if (passwordErrorMsg) {
        showError(passwordError, passwordErrorMsg);
        hasErrors = true;
    }

    if (hasErrors) {
        return;
    }

    // Disable button during login process
    loginButton.disabled = true;
    loginButton.textContent = '로그인 중...';

    // Simulate login process
    setTimeout(() => {
        // 로그인 성공 시 메인 페이지로 이동
        alert(`로그인 성공!\n아이디: ${userId}`);
        
        // 실제 프로젝트에서는 서버 인증 후 토큰 저장 등을 수행
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', userId);
        
        // 메인 페이지 또는 대시보드로 이동
        window.location.href = '../find/find.html';
        
        // Re-enable button
        loginButton.disabled = false;
        loginButton.textContent = '로그인 하기';
    }, 1000);
});

// Link click handlers
findIdLink.addEventListener('click', function(e) {
    e.preventDefault();
    alert('아이디 찾기 페이지로 이동합니다.');
    // TODO: 실제 아이디 찾기 페이지 구현
});

findPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    alert('비밀번호 찾기 페이지로 이동합니다.');
    // TODO: 실제 비밀번호 찾기 페이지 구현
});

signUpLink.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = '../signup/signup.html';
});

// Mobile keyboard handling
function adjustViewportForKeyboard() {
    const inputs = [userIdInput, passwordInput];
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
}

// Initialize mobile optimizations
adjustViewportForKeyboard();

// Prevent zoom on input focus for iOS
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.fontSize = '16px';
        });
        input.addEventListener('blur', function() {
            this.style.fontSize = '';
        });
    });
}