// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인 및 보호
    if (!AuthManager.requireAuth()) {
        return;
    }
    
    // 사용자 정보 표시 업데이트
    AuthManager.updateUserDisplay();
    
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 탭 변경 시 콘텐츠 업데이트
            const tabText = this.textContent.trim();
            updateContentByTab(tabText);
        });
    });
    
    // Add button functionality for all cards
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const title = card.querySelector('h3').textContent;
            const subtitle = card.querySelector('.subtitle').textContent;
            
            // 카드 추가 애니메이션
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // 루틴에 추가
            addToRoutine(title, subtitle);
        });
    });
    
    // Category filter functionality
    const filterPills = document.querySelectorAll('.filter-pill');
    
    filterPills.forEach(pill => {
        pill.addEventListener('click', function() {
            filterPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            
            // 필터 변경 시 카드 필터링
            const filterText = this.textContent.trim();
            filterCardsByCategory(filterText);
        });
    });
    
    // Nav item functionality
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 네비게이션 클릭 시 페이지 이동
            const navText = this.querySelector('.nav-text').textContent.trim();
            handleNavigation(navText);
        });
    });
    
    // Search button functionality
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            showSearchModal();
        });
    }
    
    // 중복 코드 제거 - 위에서 이미 처리됨
});

// 루틴에 추가하는 함수
function addToRoutine(title, subtitle) {
    // 로컬 스토리지에서 기존 루틴 가져오기
    let routines = JSON.parse(localStorage.getItem('userRoutines') || '[]');
    
    const newRoutine = {
        id: Date.now(),
        title: title,
        subtitle: subtitle,
        addedDate: new Date().toISOString(),
        type: 'diet' // 또는 'exercise'
    };
    
    routines.push(newRoutine);
    localStorage.setItem('userRoutines', JSON.stringify(routines));
    
    // 사용자에게 피드백
    showAddedNotification(title);
}

// 추가 완료 알림 함수
function showAddedNotification(title) {
    // 임시 알림 요소 생성
    const notification = document.createElement('div');
    notification.textContent = `${title}이(가) 루틴에 추가되었습니다!`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #A963FF;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 9999;
        animation: slideDown 0.3s ease;
    `;
    
    // CSS 애니메이션 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// 검색 모달 함수
function showSearchModal() {
    const searchTerm = prompt('식단이나 운동을 검색하세요:');
    if (searchTerm) {
        console.log(`검색어: ${searchTerm}`);
        // TODO: 실제 검색 기능 구현
        alert(`"${searchTerm}"에 대한 검색 결과를 표시합니다.`);
    }
}

// Tab content update function
function updateContentByTab(tabName) {
    console.log(`${tabName} 탭이 선택되었습니다.`);
    // TODO: 실제 콘텐츠 변경 로직 구현
    if (tabName === '운동') {
        console.log('운동 콘텐츠로 변경');
    } else if (tabName === '식단') {
        console.log('식단 콘텐츠로 변경');
    }
}

// Card filtering function
function filterCardsByCategory(category) {
    console.log(`${category} 카테고리로 필터링`);
    const cards = document.querySelectorAll('.card');
    
    // TODO: 실제 필터링 로직 구현
    cards.forEach(card => {
        // 현재는 모든 카드를 보여주지만, 실제로는 카테고리에 따라 필터링
        card.style.display = 'flex';
    });
}

// Navigation handler
function handleNavigation(navName) {
    switch(navName) {
        case '루틴':
            window.location.href = '../plan/plan.html';
            break;
        case '마이 페이지':
            window.location.href = '../mypage/mypage.html';
            break;
        case '탐색':
            // 현재 페이지이므로 아무것도 하지 않음
            break;
        default:
            console.log(`${navName} 네비게이션 클릭`);
    }
}

// 스크롤 이벤트 처리 (무한 스크롤 등을 위한 준비)
function handleScroll() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const scrollTop = mainContent.scrollTop;
        const scrollHeight = mainContent.scrollHeight;
        const clientHeight = mainContent.clientHeight;
        
        // 스크롤이 거의 끝에 도달했을 때
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            console.log('스크롤 끝에 도달 - 더 많은 콘텐츠 로드 가능');
            // TODO: 무한 스크롤 구현
        }
    }
}

// 스크롤 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.addEventListener('scroll', handleScroll);
    }
});

// Add to routine function with user-specific storage
function addToRoutine(title, subtitle) {
    const userId = AuthManager.getUserId();
    if (!userId) return;
    
    console.log(`${title}을(를) 루틴에 추가합니다.`);
    
    // 사용자별 루틴 데이터 저장
    const routineKey = `routine_${userId}`;
    const existingRoutines = JSON.parse(localStorage.getItem(routineKey) || '[]');
    
    const newRoutine = {
        id: Date.now(),
        title: title,
        subtitle: subtitle,
        addedDate: new Date().toISOString()
    };
    
    existingRoutines.push(newRoutine);
    localStorage.setItem(routineKey, JSON.stringify(existingRoutines));
    
    alert(`${title}이(가) 루틴에 추가되었습니다!`);
}

// Search button click handler
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', showSearchModal);
    }
});

// Logout function (can be called from developer tools or added to UI)
function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        AuthManager.logout();
    }
}

// Make logout available globally for testing
window.logout = logout;

// Search modal function
function showSearchModal() {
    const searchTerm = prompt('검색할 키워드를 입력하세요:');
    if (searchTerm) {
        console.log(`검색어: ${searchTerm}`);
        // TODO: 실제 검색 기능 구현
        alert(`"${searchTerm}"로 검색합니다.`);
    }
}