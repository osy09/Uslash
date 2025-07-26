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

    // 즐겨찾기 데이터 서버에서 불러오기
    const favoritesGrid = document.querySelector('.favorites-grid');

    fetch('http://localhost:8080/api/favorites') // ← 서버 API 주소로 수정하세요
        .then(response => response.json())
        .then(favorites => {
            // 기존 즐겨찾기 항목 제거 (add-item 제외)
            document.querySelectorAll('.grid-item:not(.add-item)').forEach(el => el.remove());

            // 서버에서 받아온 즐겨찾기 항목을 추가
            favorites.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('grid-item');
                div.innerHTML = `
                    <div class="favorite-thumbnail" style="background-image: url('${item.image}')"></div>
                    <div class="favorite-title">${item.title}</div>
                `;
                favoritesGrid.insertBefore(div, document.querySelector('.add-item'));
            });
        })
        .catch(error => {
            console.error('즐겨찾기 불러오기 실패:', error);
        });
});