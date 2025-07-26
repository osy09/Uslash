// 앱의 상호작용성을 위한 간단한 스크립트

document.addEventListener('DOMContentLoaded', function() {
    // 편집 버튼 클릭 이벤트
    const editButton = document.querySelector('.edit-button');
    if (editButton) {
        editButton.addEventListener('click', function() {
            alert('내 정보 수정 기능이 클릭되었습니다.');
        });
    }
    
    // 즐겨찾기 추가 버튼 클릭 이벤트
    const addFavoriteButton = document.querySelector('.add-item');
    if (addFavoriteButton) {
        addFavoriteButton.addEventListener('click', function() {
            alert('새로운 즐겨찾기를 추가합니다.');
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
        });
    });
});