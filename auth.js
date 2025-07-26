// 인증 관련 공통 함수들
class AuthManager {
    // 로그인 상태 확인
    static isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }
    
    // 사용자 ID 가져오기
    static getUserId() {
        return localStorage.getItem('userId');
    }
    
    // 로그인 처리
    static login(userId) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', userId);
    }
    
    // 로그아웃 처리
    static logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        window.location.href = '../login/login.html';
    }
    
    // 로그인 필요한 페이지 보호
    static requireAuth() {
        if (!this.isLoggedIn()) {
            alert('로그인이 필요한 서비스입니다.');
            window.location.href = '../login/login.html';
            return false;
        }
        return true;
    }
    
    // 사용자 정보 표시 업데이트
    static updateUserDisplay() {
        const userId = this.getUserId();
        if (userId) {
            const userDisplays = document.querySelectorAll('.user-display');
            userDisplays.forEach(display => {
                display.textContent = userId;
            });
        }
    }
}

// 전역 함수로 노출
window.AuthManager = AuthManager;
