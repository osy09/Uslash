// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인 및 보호
    if (!AuthManager.requireAuth()) {
        return;
    }
    
    // 사용자 정보 표시 업데이트
    AuthManager.updateUserDisplay();
    
    // 사용자별 즐겨찾기 키
    const userId = AuthManager.getUserId();
    const FAVORITES_KEY = `favorites_${userId}`;
    
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
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // 카드 클릭 이벤트 방지
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

    // 즐겨찾기 버튼 기능
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // 카드 클릭 이벤트 방지
            const card = this.closest('.card');
            const title = card.querySelector('h3').textContent;
            const subtitle = card.querySelector('.subtitle').textContent;
            const imageSrc = card.querySelector('.card-image').src;
            const description = card.querySelector('.card-description').textContent;
            
            const routineData = {
                id: Date.now(),
                celebrity: title,
                routineName: subtitle,
                image: imageSrc,
                description: description
            };
            
            toggleFavorite(routineData, this);
        });
    });

    // 카드 클릭 시 모달 열기
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function(event) {
            // 버튼 클릭 시 모달이 열리지 않도록 방지
            if (event.target.closest('.add-button') || event.target.closest('.favorite-button')) {
                return;
            }
            
            const title = this.querySelector('h3').textContent;
            const subtitle = this.querySelector('.subtitle').textContent;
            const imageSrc = this.querySelector('.card-image').src;
            const description = this.querySelector('.card-description').textContent;
            
            openModal(title, subtitle, imageSrc, description);
        });
    });

    // 모달 관련 이벤트 리스너
    setupModalEventListeners();
    
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
    
    // 페이지 로드 시 즐겨찾기 상태 복원
    loadFavoriteStates();
});

// 모달 관련 함수들
function setupModalEventListeners() {
    const modal = document.getElementById('routineModal');
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const addBtn = modal.querySelector('.add-btn');
    
    // 모달 닫기 이벤트
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // 추가 버튼 클릭 이벤트
    addBtn.addEventListener('click', function() {
        const celebrity = document.getElementById('modalCelebrity').textContent;
        const routineName = document.getElementById('modalRoutineName').textContent;
        
        addToRoutine(celebrity, routineName);
        closeModal();
        
        // 캘린더 이동 토스트 표시
        showToast('루틴이 캘린더에 추가되었습니다!', '나의 캘린더 보러 가기', function() {
            window.location.href = '../plan/plan.html';
        });
    });
}

function openModal(celebrity, routineName, imageSrc, description) {
    const modal = document.getElementById('routineModal');
    
    document.getElementById('modalCelebrity').textContent = celebrity;
    document.getElementById('modalRoutineName').textContent = routineName;
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('modalDescription').textContent = description;
    document.getElementById('modalQuestionText').textContent = `${routineName} 식단을 추가하시겠습니까?`;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
}

function closeModal() {
    const modal = document.getElementById('routineModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 스크롤 복원
}

// 즐겨찾기 관련 함수들
function toggleFavorite(routineData, buttonElement) {
    const userId = AuthManager.getUserId();
    const FAVORITES_KEY = `favorites_${userId}`;
    let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    
    const existingIndex = favorites.findIndex(fav => 
        fav.celebrity === routineData.celebrity && fav.routineName === routineData.routineName
    );
    
    if (existingIndex > -1) {
        // 즐겨찾기 제거
        favorites.splice(existingIndex, 1);
        buttonElement.classList.remove('active');
        showToast('즐겨찾기에서 제거되었습니다.');
    } else {
        // 즐겨찾기 추가
        favorites.push(routineData);
        buttonElement.classList.add('active');
        showToast('즐겨찾기에 추가되었습니다.');
    }
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function loadFavoriteStates() {
    const userId = AuthManager.getUserId();
    const FAVORITES_KEY = `favorites_${userId}`;
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const celebrity = card.querySelector('h3').textContent;
        const routineName = card.querySelector('.subtitle').textContent;
        const favoriteButton = card.querySelector('.favorite-button');
        
        const isFavorite = favorites.some(fav => 
            fav.celebrity === celebrity && fav.routineName === routineName
        );
        
        if (isFavorite) {
            favoriteButton.classList.add('active');
        }
    });
}

// 토스트 알림 함수
function showToast(message, actionText = null, actionCallback = null) {
    const toast = document.getElementById('toast');
    
    if (actionText && actionCallback) {
        toast.innerHTML = `
            ${message}
            <span style="color: #A963FF; cursor: pointer; margin-left: 8px; text-decoration: underline;" onclick="navigateToCalendar()">
                ${actionText}
            </span>
        `;
    } else {
        toast.textContent = message;
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function navigateToCalendar() {
    window.location.href = '../plan/plan.html';
}

// 루틴에 추가하는 함수
function addToRoutine(title, subtitle) {
    const userId = AuthManager.getUserId();
    const ROUTINE_KEY = `routine_${userId}`;
    
    // 로컬 스토리지에서 기존 루틴 가져오기
    let routines = JSON.parse(localStorage.getItem(ROUTINE_KEY) || '[]');
    
    const newRoutine = {
        id: Date.now(),
        title: title,
        subtitle: subtitle,
        addedDate: new Date().toISOString(),
        type: 'diet' // 또는 'exercise'
    };
    
    routines.push(newRoutine);
    localStorage.setItem(ROUTINE_KEY, JSON.stringify(routines));
    
    // 사용자에게 피드백
    showAddedNotification(title);
}

// 추가 알림 표시
function showAddedNotification(title) {
    showToast(`${title} 루틴이 추가되었습니다!`);
}

// 탭별 콘텐츠 업데이트
function updateContentByTab(tabText) {
    // 탭 변경 시 콘텐츠 업데이트 로직
    console.log('탭 변경:', tabText);
    
    if (tabText === '식단') {
        // 식단 관련 카드들 표시
        showDietCards();
    } else if (tabText === '운동') {
        // 운동 관련 카드들 표시
        showExerciseCards();
    }
}

function showDietCards() {
    // 식단 카드들만 표시하는 로직
    console.log('식단 카드 표시');
}

function showExerciseCards() {
    // 운동 카드들만 표시하는 로직
    console.log('운동 카드 표시');
}

// 카테고리별 필터링
function filterCardsByCategory(category) {
    console.log('카테고리 필터:', category);
    // 실제 필터링 로직 구현
}

// 네비게이션 처리
function handleNavigation(navText) {
    switch(navText) {
        case '탐색':
            // 현재 페이지
            break;
        case '루틴':
            window.location.href = '../plan/plan.html';
            break;
        case '마이 페이지':
            window.location.href = '../mypage/mypage.html';
            break;
    }
}

// 검색 모달 표시
function showSearchModal() {
    alert('검색 기능이 준비 중입니다.');
}
