document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인 - 루틴 페이지는 로그인 필수
    if (window.AuthManager && !window.AuthManager.requireAuth()) {
        return;
    }
    
    // 사용자 정보 표시 업데이트
    if (window.AuthManager) {
        window.AuthManager.updateUserDisplay();
    }
    
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
            
            // 페이지 네비게이션 처리
            const navText = this.textContent.trim();
            handleNavigation(navText);
        });
    });
    
    // 날짜 클릭 시 active 클래스 추가
    const cells = document.querySelectorAll('.calendar-cell');
    cells.forEach(cell => {
        cell.addEventListener('click', function() {
            cells.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // 날짜 정보 가져오기 (있는 경우만)
            const dateNumber = this.querySelector('.date-number');
            if (dateNumber) {
                const day = dateNumber.textContent;
                console.log(`선택된 날짜: ${currentDate.year}년 ${currentDate.month}월 ${day}일`);
                
                // 날짜 선택기 업데이트
                const dayValue = document.querySelector('.day-value');
                if (dayValue) {
                    dayValue.textContent = day;
                }
                
                // 선택된 날짜의 루틴 로드
                loadRoutineForDate(currentDate.year, currentDate.month, day);
            }
        });
    });
    
    // 검색 버튼 클릭 이벤트
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            showSearchModal();
        });
    }
    
    // 작은 검색 버튼 클릭 이벤트
    const searchSmall = document.querySelector('.search-small');
    if (searchSmall) {
        searchSmall.addEventListener('click', function() {
            showDateSearchModal();
        });
    }
    
    // 월 변경 버튼들 (있다면)
    const prevButton = document.querySelector('.prev-month');
    const nextButton = document.querySelector('.next-month');
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            changeMonth(-1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            changeMonth(1);
        });
    }
});

// 네비게이션 처리 함수
function handleNavigation(navName) {
    if (navName.includes('탐색')) {
        window.location.href = '../find/find.html';
    } else if (navName.includes('루틴')) {
        // 현재 페이지이므로 아무것도 하지 않음
    } else if (navName.includes('마이')) {
        window.location.href = '../mypage/mypage.html';
    }
}

// 검색 모달 함수
function showSearchModal() {
    const searchTerm = prompt('루틴을 검색하세요:');
    if (searchTerm) {
        console.log(`루틴 검색어: ${searchTerm}`);
        alert(`"${searchTerm}" 루틴을 검색합니다.`);
        // TODO: 실제 루틴 검색 기능 구현
    }
}

// 날짜 검색 모달 함수
function showDateSearchModal() {
    const dateInput = prompt('날짜를 입력하세요 (예: 2025-07-30):');
    if (dateInput) {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (datePattern.test(dateInput)) {
            console.log(`검색할 날짜: ${dateInput}`);
            alert(`${dateInput} 날짜로 이동합니다.`);
            // TODO: 해당 날짜로 캘린더 이동 기능 구현
        } else {
            alert('올바른 날짜 형식이 아닙니다. (예: 2025-07-30)');
        }
    }
}

// 선택된 날짜의 루틴 로드 함수
function loadRoutineForDate(year, month, day) {
    console.log(`${year}년 ${month}월 ${day}일의 루틴을 로드합니다.`);
    // TODO: 실제 루틴 데이터 로드 기능 구현
    // 현재는 샘플 데이터로 시뮬레이션
    const sampleRoutines = [
        '아침 운동 30분',
        '건강한 아침식사',
        '물 2L 마시기'
    ];
    
    console.log('해당 날짜의 루틴:', sampleRoutines);
}

// 월 변경 함수
function changeMonth(direction) {
    console.log(`월을 ${direction > 0 ? '다음' : '이전'}으로 변경합니다.`);
    // TODO: 실제 캘린더 월 변경 기능 구현
}