// 인증 관련 공통 함수들
class AuthManager {
    // 로그인 상태 확인
    static isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }
    
    // 사용자 정보 가져오기
    static getUserInfo() {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    }
    
    // 사용자 ID 가져오기
    static getUserId() {
        const userInfo = this.getUserInfo();
        return userInfo ? userInfo.id : null;
    }
    
    // 사용자 이메일 가져오기
    static getUserEmail() {
        const userInfo = this.getUserInfo();
        return userInfo ? userInfo.email : null;
    }
    
    // 로그인 처리
    static login(userInfo) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('loginTime', Date.now().toString());
    }
    
    // 로그아웃 처리
    static logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('loginTime');
        this.clearUserData();
        window.location.href = '../index.html';
    }
    
    // 사용자 데이터 클리어
    static clearUserData() {
        // 사용자별 데이터 클리어 (선택사항)
        const userDataKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('user_') || key.startsWith('routine_') || key.startsWith('favorites_')
        );
        userDataKeys.forEach(key => localStorage.removeItem(key));
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
        const userInfo = this.getUserInfo();
        if (userInfo) {
            // 사용자명 표시
            const userDisplays = document.querySelectorAll('.user-display, .username');
            userDisplays.forEach(display => {
                display.textContent = `${userInfo.id} 님` || userInfo.id;
            });
            
            // 이메일 표시
            const emailDisplays = document.querySelectorAll('.user-email');
            emailDisplays.forEach(display => {
                display.textContent = userInfo.email;
            });
        }
    }
    
    // 회원가입 처리
    static signup(userInfo) {
        // 간단한 사용자 정보 저장 (실제 프로젝트에서는 서버에서 처리)
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        // 중복 사용자 체크
        if (existingUsers.find(user => user.id === userInfo.id || user.email === userInfo.email)) {
            return { success: false, message: '이미 존재하는 아이디 또는 이메일입니다.' };
        }
        
        existingUsers.push(userInfo);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        
        return { success: true, message: '회원가입이 완료되었습니다.' };
    }
    
    // 로그인 검증
    static validateLogin(id, password) {
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = existingUsers.find(user => user.id === id && user.password === password);
        
        if (user) {
            return { success: true, user: { id: user.id, email: user.email } };
        } else {
            return { success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' };
        }
    }
    
    // 네비게이션 클릭 이벤트 처리
    static setupNavigation() {
        document.addEventListener('click', function(e) {
            const navItem = e.target.closest('.nav-item');
            if (!navItem) return;
            
            // 현재 active 클래스 제거
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // 클릭된 아이템에 active 클래스 추가
            navItem.classList.add('active');
        });
    }
    
    // 페이지 로드 시 초기화
    static init() {
        // 현재 페이지에 따라 네비게이션 상태 설정
        this.setActiveNavigation();
        // 사용자 정보 표시
        this.updateUserDisplay();
        // 네비게이션 이벤트 설정
        this.setupNavigation();
    }
    
    // 현재 페이지에 따른 네비게이션 활성화
    static setActiveNavigation() {
        const currentPath = window.location.pathname;
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => item.classList.remove('active'));
        
        if (currentPath.includes('find')) {
            const findNav = document.querySelector('.nav-item[onclick*="find"]');
            if (findNav) findNav.classList.add('active');
        } else if (currentPath.includes('plan')) {
            const planNav = document.querySelector('.nav-item[onclick*="plan"]');
            if (planNav) planNav.classList.add('active');
        } else if (currentPath.includes('mypage')) {
            const mypageNav = document.querySelector('.nav-item[onclick*="mypage"]');
            if (mypageNav) mypageNav.classList.add('active');
        }
    }
    
    // 테스트용 사용자 생성
    static createTestUser() {
        const testUser = {
            id: 'testuser',
            password: '1234',
            email: 'test@uslash.com',
            phone: '010-1234-5678'
        };
        
        const result = this.signup(testUser);
        if (result.success) {
            console.log('테스트 사용자가 생성되었습니다:', testUser);
            console.log('로그인 정보: ID: testuser, PW: 1234');
        }
        return result;
    }
}

// 전역 함수로 노출
window.AuthManager = AuthManager;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    AuthManager.init();
    
    // 개발 환경에서 테스트 사용자 자동 생성
    if (!localStorage.getItem('registeredUsers')) {
        AuthManager.createTestUser();
    }
});
