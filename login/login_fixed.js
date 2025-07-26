document.addEventListener('DOMContentLoaded', function() {
    // 이미 로그인된 사용자는 메인 페이지로 리다이렉트
    if (AuthManager.isLoggedIn()) {
        window.location.href = 'find/find.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const userIdInput = document.getElementById('userId');
    const passwordInput = document.getElementById('password');

    // 로그인 폼 제출 처리
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userId = userIdInput.value.trim();
        const password = passwordInput.value.trim();
        
        // 입력 검증
        if (!userId || !password) {
            showError('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }
        
        // 저장된 사용자 정보 확인
        const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = savedUsers.find(u => (u.email === userId || u.id === userId) && u.password === password);
        
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
                window.location.href = 'find/find.html';
            }, 1000);
        } else {
            showError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    });

    // 에러 메시지 표시
    function showError(message) {
        // 기존 에러 메시지들 숨기기
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.style.display = 'none');
        
        // 첫 번째 에러 메시지 요소에 표시
        const firstErrorElement = errorElements[0];
        if (firstErrorElement) {
            firstErrorElement.textContent = message;
            firstErrorElement.style.color = '#ff4757';
            firstErrorElement.style.display = 'block';
        }
    }

    // 성공 메시지 표시
    function showSuccess(message) {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.style.display = 'none');
        
        const firstErrorElement = errorElements[0];
        if (firstErrorElement) {
            firstErrorElement.textContent = message;
            firstErrorElement.style.color = '#2ed573';
            firstErrorElement.style.display = 'block';
        }
    }

    // 입력 필드 포커스 시 에러 메시지 숨기기
    userIdInput.addEventListener('focus', hideError);
    passwordInput.addEventListener('focus', hideError);

    function hideError() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.style.display = 'none');
    }

    // 회원가입 페이지로 이동
    const signupLink = document.querySelector('a[href="signup/signup.html"]');
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'signup/signup.html';
        });
    }
});
