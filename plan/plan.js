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
            }
        });
    });
    
    // 검색 버튼 클릭 이벤트
    document.querySelector('.search-button').addEventListener('click', function() {
        console.log('검색 버튼이 클릭되었습니다.');
    });
    
    // 날짜 선택기 이벤트
    document.querySelector('.date-selector').addEventListener('click', function() {
        console.log('날짜 선택기가 클릭되었습니다.');
    });
    
    // 루틴 카드 클릭 이벤트
    const routineCards = document.querySelectorAll('.routine-card');
    routineCards.forEach(card => {
        card.addEventListener('click', function() {
            console.log('루틴 카드가 클릭되었습니다.');
        });
    });
    
    // 휴지통 아이콘 클릭 이벤트
    document.querySelector('.trash-icon').addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('루틴을 삭제하시겠습니까?');
    });
});