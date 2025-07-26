document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인 및 보호
    if (!AuthManager.requireAuth()) {
        return;
    }
    
    // 사용자 정보 표시 업데이트
    AuthManager.updateUserDisplay();
    
    // 현재 선택된 날짜
    let selectedDate = {
        year: 2025,
        month: 7,
        day: 26
    };

    // Search button 클릭 이벤트
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            // 검색 기능 구현
            console.log('검색 버튼 클릭됨');
        });
    }

    // 캘린더 날짜 클릭 이벤트
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            // 현재 활성화된 날짜 제거
            calendarDays.forEach(d => d.classList.remove('current'));
            // 클릭된 날짜를 활성화
            this.classList.add('current');
        });
    });
    
    // 초기 로드 함수들
    initializeCalendar();
});

function initializeCalendar() {
    // 캘린더 초기화 로직
    console.log('캘린더 초기화됨');
}
    
    // 이벤트 리스너 설정
    function setupEventListeners() {
        // 캘린더 날짜 클릭
        const calendarCells = document.querySelectorAll('.calendar-cell');
        calendarCells.forEach(cell => {
            cell.addEventListener('click', function() {
                const dateNumber = this.querySelector('.date-number');
                if (dateNumber) {
                    selectedDate.day = parseInt(dateNumber.textContent);
                    updateDateSelector();
                    loadRoutinesForSelectedDate();
                    
                    // 다른 날짜 선택 해제
                    calendarCells.forEach(c => c.classList.remove('selected'));
                    this.classList.add('selected');
                }
            });
        });
        
        // 하단 네비게이션
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const navText = this.querySelector('span').textContent.trim();
                handleNavigation(navText);
            });
        });
        
        // 검색 버튼
        const searchButton = document.querySelector('.search-button');
        if (searchButton) {
            searchButton.addEventListener('click', function() {
                window.location.href = '../find/find.html';
            });
        }
        
        // 모달 관련 이벤트
        setupModalEvents();
    }
    
    // 모달 이벤트 설정
    function setupModalEvents() {
        // 루틴 옵션 모달
        const routineModal = document.getElementById('routineModal');
        const routineCloseBtn = routineModal.querySelector('.close');
        
        routineCloseBtn.addEventListener('click', () => {
            routineModal.style.display = 'none';
        });
        
        routineModal.addEventListener('click', function(event) {
            if (event.target === routineModal) {
                routineModal.style.display = 'none';
            }
        });
        
        // 커스텀 루틴 모달
        const customModal = document.getElementById('customRoutineModal');
        const customCloseBtn = customModal.querySelector('.close');
        
        customCloseBtn.addEventListener('click', () => {
            customModal.style.display = 'none';
        });
        
        customModal.addEventListener('click', function(event) {
            if (event.target === customModal) {
                customModal.style.display = 'none';
            }
        });
        
        // 커스텀 루틴 폼 제출
        const customForm = document.getElementById('customRoutineForm');
        customForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleCustomRoutineSubmit();
        });
    }
    
    // 사용자 루틴 로드
    function loadUserRoutines() {
        const userId = AuthManager.getUserId();
        const routineKey = `routine_${userId}`;
        const routines = JSON.parse(localStorage.getItem(routineKey) || '[]');
        
        displayRoutinesOnCalendar(routines);
    }
    
    // 캘린더에 루틴 표시
    function displayRoutinesOnCalendar(routines) {
        // 기존 이벤트 제거
        const existingEvents = document.querySelectorAll('.event-item.user-routine');
        existingEvents.forEach(event => event.remove());
        
        routines.forEach(routine => {
            if (routine.addedDate) {
                const routineDate = new Date(routine.addedDate);
                const day = routineDate.getDate();
                const month = routineDate.getMonth() + 1;
                const year = routineDate.getFullYear();
                
                if (year === selectedDate.year && month === selectedDate.month) {
                    addEventToCalendar(day, routine.title, routine.subtitle);
                }
            }
        });
    }
    
    // 캘린더에 이벤트 추가
    function addEventToCalendar(day, title, subtitle) {
        const cells = document.querySelectorAll('.calendar-cell');
        const targetCell = Array.from(cells).find(cell => {
            const dateNum = cell.querySelector('.date-number');
            return dateNum && parseInt(dateNum.textContent) === day;
        });
        
        if (targetCell) {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item user-routine';
            
            const eventDot = document.createElement('div');
            eventDot.className = 'event-dot';
            
            const eventText = document.createElement('div');
            eventText.className = 'event-text-small';
            eventText.textContent = subtitle || title;
            
            eventItem.appendChild(eventDot);
            eventItem.appendChild(eventText);
            
            // 기존 이벤트가 있으면 아래에 배치
            const existingEvents = targetCell.querySelectorAll('.event-item');
            if (existingEvents.length > 0) {
                const lastEvent = existingEvents[existingEvents.length - 1];
                const topOffset = parseInt(lastEvent.style.top || '227px') + 8;
                eventItem.style.top = `${topOffset}px`;
            }
            
            targetCell.appendChild(eventItem);
        }
    }
    
    // 선택된 날짜의 루틴 로드
    function loadRoutinesForSelectedDate() {
        const userId = AuthManager.getUserId();
        const routineKey = `routine_${userId}`;
        const routines = JSON.parse(localStorage.getItem(routineKey) || '[]');
        
        // 선택된 날짜의 루틴 필터링
        const selectedDateString = `${selectedDate.year}-${selectedDate.month.toString().padStart(2, '0')}-${selectedDate.day.toString().padStart(2, '0')}`;
        const dayRoutines = routines.filter(routine => {
            if (!routine.addedDate) return false;
            const routineDate = routine.addedDate.split('T')[0];
            return routineDate === selectedDateString;
        });
        
        displaySelectedDateRoutines(dayRoutines);
    }
    
    // 선택된 날짜의 루틴 표시
    function displaySelectedDateRoutines(routines) {
        const noRoutines = document.getElementById('noRoutines');
        const routineList = document.getElementById('routineList');
        const routineCards = document.getElementById('routineCards');
        
        if (routines.length === 0) {
            noRoutines.style.display = 'block';
            routineList.style.display = 'none';
        } else {
            noRoutines.style.display = 'none';
            routineList.style.display = 'block';
            
            // 날짜 제목 업데이트
            const dateTitle = routineList.querySelector('.routine-date-title');
            dateTitle.textContent = `${selectedDate.year}년 ${selectedDate.month}월 ${selectedDate.day}일 루틴`;
            
            // 루틴 카드들 생성
            routineCards.innerHTML = '';
            routines.forEach(routine => {
                const routineCard = createRoutineCard(routine);
                routineCards.appendChild(routineCard);
            });
        }
    }
    
    // 루틴 카드 생성
    function createRoutineCard(routine) {
        const card = document.createElement('div');
        card.className = 'routine-card-new';
        
        const typeMap = {
            'diet': '식단',
            'exercise': '운동',
            'lifestyle': '생활습관'
        };
        
        card.innerHTML = `
            <h4>${routine.title}</h4>
            <p>${routine.subtitle || '루틴 설명'}</p>
            <div class="routine-type">${typeMap[routine.type] || '기타'}</div>
        `;
        
        return card;
    }
    
    // 날짜 선택기 업데이트
    function updateDateSelector() {
        document.querySelector('.year-value').textContent = selectedDate.year;
        document.querySelector('.month-value').textContent = selectedDate.month;
        document.querySelector('.day-value').textContent = selectedDate.day;
    }
    
    // 네비게이션 처리
    function handleNavigation(navText) {
        switch(navText) {
            case '탐색':
                window.location.href = '../find/find.html';
                break;
            case '루틴':
                // 현재 페이지
                break;
            case '마이 페이지':
                window.location.href = '../mypage/mypage.html';
                break;
        }
    }
});

// 전역 함수들 (HTML에서 호출)
function showRoutineOptions() {
    document.getElementById('routineModal').style.display = 'block';
}

function hideRoutinePrompt() {
    document.getElementById('noRoutines').style.display = 'none';
}

function goToExplore() {
    window.location.href = '../find/find.html';
}

function addCustomRoutine() {
    document.getElementById('routineModal').style.display = 'none';
    document.getElementById('customRoutineModal').style.display = 'block';
}

function addFromFavorites() {
    const userId = AuthManager.getUserId();
    const favoritesKey = `favorites_${userId}`;
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    
    if (favorites.length === 0) {
        alert('즐겨찾기한 루틴이 없습니다.\n탐색 페이지에서 루틴을 즐겨찾기해 보세요!');
        return;
    }
    
    // 간단한 선택 UI (실제로는 더 정교한 UI가 필요)
    const favoritesList = favorites.map((fav, index) => 
        `${index + 1}. ${fav.celebrity} - ${fav.routineName}`
    ).join('\n');
    
    const choice = prompt(`즐겨찾기 목록:\n${favoritesList}\n\n추가할 루틴 번호를 입력하세요:`);
    
    if (choice && !isNaN(choice)) {
        const index = parseInt(choice) - 1;
        if (index >= 0 && index < favorites.length) {
            const selectedFavorite = favorites[index];
            addRoutineToCalendar(selectedFavorite.celebrity, selectedFavorite.routineName, 'diet');
            document.getElementById('routineModal').style.display = 'none';
        }
    }
}

function closeCustomRoutineModal() {
    document.getElementById('customRoutineModal').style.display = 'none';
}

function handleCustomRoutineSubmit() {
    const title = document.getElementById('routineTitle').value;
    const description = document.getElementById('routineDescription').value;
    const type = document.getElementById('routineType').value;
    
    if (!title.trim()) {
        alert('루틴 제목을 입력해주세요.');
        return;
    }
    
    addRoutineToCalendar(title, description, type);
    closeCustomRoutineModal();
    
    // 폼 초기화
    document.getElementById('customRoutineForm').reset();
}

function addRoutineToCalendar(title, subtitle, type) {
    const userId = AuthManager.getUserId();
    const routineKey = `routine_${userId}`;
    
    let routines = JSON.parse(localStorage.getItem(routineKey) || '[]');
    
    const newRoutine = {
        id: Date.now(),
        title: title,
        subtitle: subtitle,
        type: type,
        addedDate: new Date().toISOString()
    };
    
    routines.push(newRoutine);
    localStorage.setItem(routineKey, JSON.stringify(routines));
    
    // 화면 업데이트
    loadUserRoutines();
    loadRoutinesForSelectedDate();
    
    alert('루틴이 추가되었습니다!');
}
