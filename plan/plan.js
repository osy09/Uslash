document.addEventListener('DOMContentLoaded', function() {
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
                document.querySelector('.day-value').textContent = day;
            }
        });
    });
    
    // 검색 버튼 클릭 이벤트
    document.querySelector('.search-button').addEventListener('click', function() {
        alert('검색 기능을 시작합니다');
    });
    
    // 작은 검색 버튼 클릭 이벤트
    document.querySelector('.search-small').addEventListener('click', function() {
        alert('날짜 검색을 시작합니다');
    });
});