// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인 (선택적 - find 페이지는 비로그인도 접근 가능)
    if (window.AuthManager) {
        window.AuthManager.updateUserDisplay();
    }
    
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
    
    // Add button functionality for cards
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.card');
            const title = card.querySelector('h3').textContent;
            addToRoutine(title);
        });
    });
});

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

// Search modal function
function showSearchModal() {
    const searchTerm = prompt('검색할 키워드를 입력하세요:');
    if (searchTerm) {
        console.log(`검색어: ${searchTerm}`);
        // TODO: 실제 검색 기능 구현
        alert(`"${searchTerm}"로 검색합니다.`);
    }
}

// Add to routine function
function addToRoutine(title) {
    console.log(`${title}을(를) 루틴에 추가합니다.`);
    alert(`${title}이(가) 루틴에 추가되었습니다!`);
    
    // TODO: 실제 루틴 저장 로직 구현
    // localStorage나 서버에 저장
}