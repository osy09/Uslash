// 앱의 상호작용성을 위한 간단한 스크립트

document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인 - 마이페이지는 로그인 필수
    if (window.AuthManager && !window.AuthManager.requireAuth()) {
        return;
    }
    
    // 사용자 정보 표시 업데이트
    if (window.AuthManager) {
        window.AuthManager.updateUserDisplay();
    }
    
    // 편집 버튼 클릭 이벤트
    const editButton = document.querySelector('.edit-button');
    if (editButton) {
        editButton.addEventListener('click', function() {
            alert('내 정보 수정 기능이 클릭되었습니다.');
            // TODO: 실제 프로필 편집 페이지로 이동
        });
    }
    
    // 로그아웃 버튼 추가 (편집 버튼 옆에)
    if (window.AuthManager && window.AuthManager.isLoggedIn()) {
        const editButton = document.querySelector('.edit-button');
        if (editButton) {
            const logoutButton = document.createElement('button');
            logoutButton.textContent = '로그아웃';
            logoutButton.className = 'logout-button';
            logoutButton.style.cssText = `
                background: #ff4444;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 15px;
                font-size: 12px;
                margin-left: 10px;
                cursor: pointer;
            `;
            
            logoutButton.addEventListener('click', function() {
                if (confirm('로그아웃 하시겠습니까?')) {
                    window.AuthManager.logout();
                }
            });
            
            editButton.parentNode.appendChild(logoutButton);
        }
    }
    
    // 즐겨찾기 추가 버튼 클릭 이벤트
    const addFavoriteButton = document.querySelector('.add-item');
    if (addFavoriteButton) {
        addFavoriteButton.addEventListener('click', function() {
            const favoriteName = prompt('추가할 즐겨찾기 이름을 입력하세요:');
            if (favoriteName) {
                addFavoriteItem(favoriteName);
            }
        });
    }
    
    // 하단 네비게이션 바 클릭 이벤트
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // 기존 활성 항목에서 활성 클래스 제거
            navItems.forEach(function(navItem) {
                navItem.classList.remove('active');
            });
            
            // 클릭한 항목에 활성 클래스 추가
            this.classList.add('active');
            
            // 페이지 네비게이션 처리
            const navText = this.querySelector('span').textContent.trim();
            handleNavigation(navText);
        });
    });
    
    // 기존 즐겨찾기 항목들에 클릭 이벤트 추가
    const favoriteItems = document.querySelectorAll('.favorite-item');
    favoriteItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const itemName = this.querySelector('span').textContent;
            alert(`${itemName} 즐겨찾기가 선택되었습니다.`);
            // TODO: 해당 즐겨찾기로 이동하는 기능 구현
        });
    });
});

// 즐겨찾기 아이템 추가 함수
function addFavoriteItem(name) {
    const favoritesList = document.querySelector('.favorites-list');
    const newItem = document.createElement('div');
    newItem.className = 'favorite-item';
    newItem.innerHTML = `
        <div class="favorite-icon">
            <div class="star-icon"></div>
        </div>
        <span>${name}</span>
    `;
    
    // 클릭 이벤트 추가
    newItem.addEventListener('click', function() {
        alert(`${name} 즐겨찾기가 선택되었습니다.`);
    });
    
    // add-item 버튼 앞에 삽입
    const addButton = document.querySelector('.add-item');
    favoritesList.insertBefore(newItem, addButton);
    
    alert(`${name}이(가) 즐겨찾기에 추가되었습니다!`);
}

// 네비게이션 처리 함수
function handleNavigation(navName) {
    switch(navName) {
        case '탐색':
            window.location.href = '../find/find.html';
            break;
        case '루틴':
            window.location.href = '../plan/plan.html';
            break;
        case '마이 페이지':
            // 현재 페이지이므로 아무것도 하지 않음
            break;
        default:
            console.log(`${navName} 네비게이션 클릭`);
    }
}