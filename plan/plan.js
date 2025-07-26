document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인 및 보호
    if (!AuthManager.requireAuth()) {
        return;
    }
    
    // 사용자 정보 표시 업데이트
    AuthManager.updateUserDisplay();
    
    // 사용자별 루틴 데이터 로드
    loadUserRoutines();
    
    // 현재 날짜 (2025-07-26)
    const currentDate = {
        year: 2025,
        month: 7,
        day: 26
    };
    
    // 하단 네비게이션 이벤트 리스너
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 탭 전환 시 필요한 로직을 여기에 추가
            const tabName = this.querySelector('span').textContent;
            console.log(`${tabName} 탭이 선택되었습니다.`);
        });
    });
    
    // 날짜 클릭 이벤트
    const cells = document.querySelectorAll('.calendar-cell');
    cells.forEach(cell => {
        cell.addEventListener('click', function() {
            const dateNumber = this.querySelector('.date-number');
            if (dateNumber) {
                const day = dateNumber.textContent;
                console.log(`선택된 날짜: ${currentDate.year}년 ${currentDate.month}월 ${day}일`);
                
                // 날짜 선택기 업데이트
                document.querySelector('.day-value').textContent = day;
                
                // 선택된 날짜의 루틴 로드
                loadRoutinesForDate(currentDate.year, currentDate.month, day);
            }
        });
    });
    
    // 검색 버튼 클릭 이벤트
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            console.log('검색 버튼이 클릭되었습니다.');
            // find 페이지로 이동
            window.location.href = '../find/find.html';
        });
    }
    
    // 날짜 선택기 이벤트
    document.querySelector('.date-selector').addEventListener('click', function() {
        console.log('날짜 선택기가 클릭되었습니다.');
    });
    
    // 휴지통 아이콘 클릭 이벤트
    const trashIcon = document.querySelector('.trash-icon');
    if (trashIcon) {
        trashIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm('루틴을 삭제하시겠습니까?')) {
                // TODO: 루틴 삭제 로직 구현
                console.log('루틴이 삭제되었습니다.');
            }
        });
    }
});

// 사용자별 루틴 데이터 로드
function loadUserRoutines() {
    const userId = AuthManager.getUserId();
    if (!userId) return;
    
    const routineKey = `routine_${userId}`;
    const routines = JSON.parse(localStorage.getItem(routineKey) || '[]');
    
    console.log(`${userId}님의 루틴:`, routines);
    
    // TODO: 루틴 데이터를 캘린더에 표시하는 로직 구현
    displayRoutinesOnCalendar(routines);
}

// 선택된 날짜의 루틴 로드
function loadRoutinesForDate(year, month, day) {
    const userId = AuthManager.getUserId();
    if (!userId) return;
    
    const routineKey = `routine_${userId}`;
    const routines = JSON.parse(localStorage.getItem(routineKey) || '[]');
    
    // 특정 날짜의 루틴 필터링 (현재는 모든 루틴을 표시)
    const dateRoutines = routines.filter(routine => {
        // TODO: 날짜별 루틴 필터링 로직 구현
        return true;
    });
    
    console.log(`${year}-${month}-${day} 루틴:`, dateRoutines);
    displayDayRoutines(dateRoutines);
}

// 캘린더에 루틴 표시
function displayRoutinesOnCalendar(routines) {
    // TODO: 캘린더 셀에 루틴 표시점 추가
    console.log('캘린더에 루틴 표시:', routines.length, '개');
}

// 선택된 날짜의 루틴 표시
function displayDayRoutines(routines) {
    // TODO: 하단 루틴 카드 영역 업데이트
    console.log('일별 루틴 표시:', routines);
}