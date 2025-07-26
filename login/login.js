document.addEventListener('DOMContentLoaded', function() {
    // 이미 로그인된 사용자는 메인 페이지로 리다이렉트
    if (AuthManager.isLoggedIn()) {
        window.location.href = '../find/find.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // 로그인 폼 제출 처리
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        // 입력 검증
        if (!email || !password) {
            showError('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }
        
        // 이메일 형식 검증
        if (!isValidEmail(email)) {
            showError('올바른 이메일 형식을 입력해주세요.');
            return;
        }
        
        // 저장된 사용자 정보 확인
        const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = savedUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // 로그인 성공
            AuthManager.login({
                id: user.id,
                email: user.email,
                name: user.name
            });
            
            // 성공 메시지 표시 후 리다이렉트
            showSuccess('로그인 성공! 메인 페이지로 이동합니다.');
            setTimeout(() => {
                window.location.href = '../find/find.html';
            }, 1000);
        } else {
            showError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
    });

    // 에러 메시지 표시
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.color = '#ff4757';
        errorMessage.style.display = 'block';
    }

    // 성공 메시지 표시
    function showSuccess(message) {
        errorMessage.textContent = message;
        errorMessage.style.color = '#2ed573';
        errorMessage.style.display = 'block';
    }

    // 이메일 형식 검증
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 입력 필드 포커스 시 에러 메시지 숨기기
    emailInput.addEventListener('focus', hideError);
    passwordInput.addEventListener('focus', hideError);

    function hideError() {
        errorMessage.style.display = 'none';
    }

    // 회원가입 페이지로 이동
    const signupLink = document.querySelector('a[href="../signup/signup.html"]');
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../signup/signup.html';
        });
    }
});
