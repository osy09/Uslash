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