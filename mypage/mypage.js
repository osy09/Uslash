document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인 및 보호
    if (!AuthManager.requireAuth()) {
        return;
    }
    
    // 사용자 정보 표시 업데이트
    AuthManager.updateUserDisplay();
    
    // 사용자별 즐겨찾기 데이터 키
    const userId = AuthManager.getUserId();
    const FAVORITES_STORAGE_KEY = `favorites_${userId}`;

    // --- 유틸리티 함수: 로컬 스토리지 관리 ---
    /**
     * 로컬 스토리지에서 즐겨찾기 데이터를 불러옵니다.
     * @returns {Array} 저장된 즐겨찾기 목록
     */
    function getFavoritesFromLocalStorage() {
        try {
            const data = localStorage.getItem(FAVORITES_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('로컬 스토리지에서 즐겨찾기를 불러오는 중 오류 발생:', error);
            return []; // 오류 발생 시 빈 배열 반환
        }
    }

    /**
     * 즐겨찾기 데이터를 로컬 스토리지에 저장합니다.
     * @param {Array} favorites 저장할 즐겨찾기 목록
     */
    function saveFavoritesToLocalStorage(favorites) {
        try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
        } catch (error) {
            console.error('로컬 스토리지에 즐겨찾기를 저장하는 중 오류 발생:', error);
        }
    }

    // --- 기존 이벤트 리스너 및 함수 ---

    // 편집 버튼 클릭 이벤트
    const editButton = document.querySelector('.edit-button');
    if (editButton) {
        editButton.addEventListener('click', function() {
            alert('내 정보 수정 기능이 클릭되었습니다.');
        });
    }

    // 설정 아이콘 클릭 이벤트 (로그아웃 메뉴 포함)
    const settingsIcon = document.querySelector('.settings-icon');
    if (settingsIcon) {
        settingsIcon.addEventListener('click', function() {
            const action = confirm('로그아웃 하시겠습니까?\n확인: 로그아웃\n취소: 설정');
            if (action) {
                AuthManager.logout();
            } else {
                alert('설정 페이지로 이동합니다.');
            }
        });
    }

    // 즐겨찾기 추가 버튼 클릭 이벤트
    const addFavoriteButton = document.querySelector('.add-item');
    if (addFavoriteButton) {
        addFavoriteButton.addEventListener('click', function() {
            alert('새로운 즐겨찾기를 추가합니다.');

            // TODO: 실제 사용자 입력을 받아 새로운 즐겨찾기 데이터를 생성해야 합니다.
            // 현재는 예시 데이터를 사용합니다. 사용자에게 입력 필드를 제공하여
            // 루틴명, 등록자, 이미지 URL, 설명을 입력받도록 구현해야 합니다.
            const newFavoriteData = {
                // 고유 ID를 위해 현재 시간을 사용 (실제 앱에서는 더 견고한 ID 생성 방식 고려)
                id: Date.now(),
                personName: "새로운 사용자",
                routineTitle: "새로운 로컬 루틴",
                routineImage: "https://via.placeholder.com/150/FF0000/FFFFFF?text=LOCAL", // 예시 이미지
                description: "로컬 스토리지에 저장된 새로운 설명입니다."
            };

            addFavorite(newFavoriteData); // 즐겨찾기 추가 및 저장 함수 호출
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

    /**
     * 즐겨찾기 데이터를 로컬 스토리지에서 불러와 화면에 표시하는 함수
     */
    function loadFavorites() {
        const favoritesGrid = document.querySelector('.favorites-grid');
        // 기존 즐겨찾기 항목 제거 (add-item 제외)
        document.querySelectorAll('.grid-item:not(.add-item)').forEach(el => el.remove());

        const favorites = getFavoritesFromLocalStorage(); // 로컬 스토리지에서 데이터 불러오기

        // 불러온 즐겨찾기 항목들을 화면에 추가
        favorites.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('grid-item');
            div.innerHTML = `
                <div class="favorite-thumbnail" style="background-image: url('${item.routineImage}')"></div>
                <div class="favorite-title">${item.routineTitle}</div>
                <div class="favorite-info">
                    <span class="favorite-person">등록자: ${item.personName}</span>
                    <p class="favorite-description">${item.description}</p>
                </div>
            `;
            favoritesGrid.insertBefore(div, document.querySelector('.add-item'));
        });
    }

    /**
     * 새로운 즐겨찾기 항목을 추가하고 로컬 스토리지에 저장한 뒤 화면을 업데이트하는 함수
     * @param {Object} newFavorite 새로운 즐겨찾기 데이터 객체
     */
    function addFavorite(newFavorite) {
        const favorites = getFavoritesFromLocalStorage(); // 현재 즐겨찾기 목록 불러오기
        favorites.push(newFavorite); // 새 항목 추가
        saveFavoritesToLocalStorage(favorites); // 로컬 스토리지에 저장

        // 화면 새로고침
        loadFavorites();
    }

    // 페이지 로드 시 즐겨찾기 데이터 불러오기 함수 호출
    loadFavorites();
});