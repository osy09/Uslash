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
    
    // TODO: 실제 즐겨찾기 추가 API 호출 로직을 여기에 추가해야 합니다.
    
    // 이 부분은 POST 요청으로 서버에 새로운 즐겨찾기 데이터를 보내는 코드가 필요합니다.
    
    // 예시:
    
    // const newFavoriteData = {
    
    // personName: "새로운 사용자",
    
    // routineTitle: "새로운 루틴",
    
    // routineImage: "URL",
    
    // description: "새로운 설명"
    
    // };
    
    // fetch('http://localhost:8080/api/favorites', {
    
    // method: 'POST',
    
    // headers: {
    
    // 'Content-Type': 'application/json',
    
    // },
    
    // body: JSON.stringify(newFavoriteData),
    
    // })
    
    // .then(response => response.json())
    
    // .then(data => {
    
    // console.log('즐겨찾기 추가 성공:', data);
    
    // // 성공 시 즐겨찾기 목록 새로고침 또는 새 항목 추가
    
    // loadFavorites(); // 아래에 정의된 함수 호출
    
    // })
    
    // .catch(error => {
    
    // console.error('즐겨찾기 추가 실패:', error);
    
    // });
    
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
    
    
    
    // 즐겨찾기 데이터를 서버에서 불러와 표시하는 함수
    
    function loadFavorites() {
    
    const favoritesGrid = document.querySelector('.favorites-grid');
    
    
    
    // 서버 API 주소를 정확히 확인하여 수정하세요!
    
    // 예: 'http://localhost:8080/api/favorites/workout-routines'
    
    // 또는 실제 배포 환경 주소 'https://your-domain.com/api/favorites/workout-routines'
    
    fetch('https://aa01cc8371dc.ngrok-free.app')
    
    .then(response => {
    
    if (!response.ok) { // HTTP 상태 코드가 200번대가 아니면 오류 처리
    
    throw new Error(`HTTP error! status: ${response.status}`);
    
    }
    
    return response.json();
    
    })
    
    .then(favorites => {
    
    // 기존 즐겨찾기 항목 제거 (add-item 제외)
    
    document.querySelectorAll('.grid-item:not(.add-item)').forEach(el => el.remove());
    
    
    
    // 서버에서 받아온 즐겨찾기 항목을 추가
    
    favorites.forEach(item => {
    
    const div = document.createElement('div');
    
    div.classList.add('grid-item');
    
    // 서버 응답의 필드명(routineImage, routineTitle, personName, description)에 맞춰 사용
    
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
    
    })
    
    .catch(error => {
    
    console.error('즐겨찾기 불러오기 실패:', error);
    
    // 사용자에게 오류 메시지를 표시하는 UI를 추가할 수도 있습니다.
    
    // 예: favoritesGrid.innerHTML = '<p>즐겨찾기를 불러오는데 실패했습니다. 서버 상태를 확인해주세요.</p>';
    
    });
    
    }
    
    
    
    // 페이지 로드 시 즐겨찾기 데이터 불러오기 함수 호출
    
    loadFavorites();
    
    });