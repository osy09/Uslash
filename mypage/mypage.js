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

    // 페이지 로드 시 즐겨찾기 표시
    displayFavorites();
    
    // 모달 이벤트 리스너 설정
    setupModalEventListeners();

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

    // 즐겨찾기 표시 함수
    function displayFavorites() {
        const favorites = getFavoritesFromLocalStorage();
        const favoritesGrid = document.getElementById('favoritesGrid');
        const noFavorites = document.getElementById('noFavorites');
        const addBtn = document.getElementById('addFavoriteBtn');
        
        // 기존 즐겨찾기 아이템들 제거 (추가 버튼 제외)
        const existingItems = favoritesGrid.querySelectorAll('.favorite-item');
        existingItems.forEach(item => item.remove());
        
        if (favorites.length === 0) {
            noFavorites.style.display = 'block';
            addBtn.style.display = 'none';
        } else {
            noFavorites.style.display = 'none';
            addBtn.style.display = 'flex';
            
            // 즐겨찾기 아이템들을 추가 버튼 앞에 삽입
            favorites.forEach(favorite => {
                const favoriteElement = createFavoriteElement(favorite);
                favoritesGrid.insertBefore(favoriteElement, addBtn);
            });
        }
    }
    
    // 즐겨찾기 아이템 요소 생성
    function createFavoriteElement(favorite) {
        const div = document.createElement('div');
        div.className = 'grid-item favorite-item';
        div.innerHTML = `
            <div class="favorite-thumbnail" style="background-image: url('${favorite.image}')"></div>
            <div class="favorite-title">${favorite.routineName}</div>
            <div class="favorite-celebrity">${favorite.celebrity}</div>
            <div class="favorite-description">${favorite.description}</div>
        `;
        
        // 클릭 이벤트 추가
        div.addEventListener('click', function() {
            openFavoriteModal(favorite);
        });
        
        return div;
    }
    
    // 즐겨찾기 상세 모달 열기
    function openFavoriteModal(favorite) {
        const modal = document.getElementById('favoriteModal');
        
        document.getElementById('favoriteModalImage').src = favorite.image;
        document.getElementById('favoriteModalCelebrity').textContent = favorite.celebrity;
        document.getElementById('favoriteModalRoutineName').textContent = favorite.routineName;
        document.getElementById('favoriteModalDescription').textContent = favorite.description;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // 현재 선택된 즐겨찾기 저장
        modal.dataset.currentFavoriteId = favorite.id;
    }
    
    // 모달 이벤트 리스너 설정
    function setupModalEventListeners() {
        const modal = document.getElementById('favoriteModal');
        const closeBtn = modal.querySelector('.close');
        const removeBtn = modal.querySelector('.remove-btn');
        const addToCalendarBtn = modal.querySelector('.add-to-calendar-btn');
        
        // 모달 닫기
        closeBtn.addEventListener('click', closeFavoriteModal);
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeFavoriteModal();
            }
        });
        
        // 즐겨찾기 제거
        removeBtn.addEventListener('click', function() {
            const favoriteId = modal.dataset.currentFavoriteId;
            removeFavorite(favoriteId);
            closeFavoriteModal();
        });
        
        // 캘린더에 추가
        addToCalendarBtn.addEventListener('click', function() {
            const celebrity = document.getElementById('favoriteModalCelebrity').textContent;
            const routineName = document.getElementById('favoriteModalRoutineName').textContent;
            
            addToRoutine(celebrity, routineName);
            closeFavoriteModal();
            
            // 성공 메시지 표시
            alert('루틴이 캘린더에 추가되었습니다!');
            
            // 캘린더로 이동 여부 확인
            if (confirm('캘린더 페이지로 이동하시겠습니까?')) {
                window.location.href = '../plan/plan.html';
            }
        });
    }
    
    // 즐겨찾기 모달 닫기
    function closeFavoriteModal() {
        const modal = document.getElementById('favoriteModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        delete modal.dataset.currentFavoriteId;
    }
    
    // 즐겨찾기 제거
    function removeFavorite(favoriteId) {
        let favorites = getFavoritesFromLocalStorage();
        favorites = favorites.filter(fav => fav.id != favoriteId);
        saveFavoritesToLocalStorage(favorites);
        displayFavorites();
        alert('즐겨찾기에서 제거되었습니다.');
    }
    
    // 루틴을 캘린더에 추가
    function addToRoutine(celebrity, routineName) {
        const userId = AuthManager.getUserId();
        const ROUTINE_KEY = `routine_${userId}`;
        
        let routines = JSON.parse(localStorage.getItem(ROUTINE_KEY) || '[]');
        
        const newRoutine = {
            id: Date.now(),
            title: celebrity,
            subtitle: routineName,
            addedDate: new Date().toISOString(),
            type: 'diet'
        };
        
        routines.push(newRoutine);
        localStorage.setItem(ROUTINE_KEY, JSON.stringify(routines));
    }

    // --- 기존 이벤트 리스너 및 함수 ---

    // 편집 버튼 클릭 이벤트
    const editButton = document.querySelector('.edit-button');
    if (editButton) {
        editButton.addEventListener('click', function() {
            openProfileModal();
        });
    }

    // 프로필 모달 설정
    setupProfileModal();

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
    const addFavoriteButton = document.getElementById('addFavoriteBtn');
    if (addFavoriteButton) {
        addFavoriteButton.addEventListener('click', function() {
            if (confirm('탐색 페이지에서 새로운 루틴을 즐겨찾기해 보세요!\n탐색 페이지로 이동하시겠습니까?')) {
                window.location.href = '../find/find.html';
            }
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

    // Search button functionality
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            alert('검색 기능이 준비 중입니다.');
        });
    }
    
    // 프로필 모달 설정
    function setupProfileModal() {
        const profileModal = document.getElementById('profileModal');
        const profileCloseBtn = profileModal.querySelectorAll('.close, .cancel-btn');
        const profileForm = document.getElementById('profileForm');
        const profileImageInput = document.getElementById('profileImage');
        
        // 모달 닫기 이벤트
        profileCloseBtn.forEach(btn => {
            btn.addEventListener('click', closeProfileModal);
        });
        
        profileModal.addEventListener('click', function(event) {
            if (event.target === profileModal) {
                closeProfileModal();
            }
        });
        
        // 프로필 이미지 미리보기
        profileImageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('imagePreview');
                    const previewImg = document.getElementById('previewImg');
                    
                    previewImg.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
        
        // 프로필 폼 제출
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleProfileUpdate();
        });
    }
    
    // 프로필 모달 열기
    function openProfileModal() {
        const userInfo = AuthManager.getUserInfo();
        
        document.getElementById('profileName').value = userInfo.name || '';
        document.getElementById('profileEmail').value = userInfo.email || '';
        
        // 기존 프로필 이미지가 있다면 표시
        if (userInfo.profileImage) {
            const preview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');
            
            previewImg.src = userInfo.profileImage;
            preview.style.display = 'block';
        }
        
        document.getElementById('profileModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // 프로필 모달 닫기
    function closeProfileModal() {
        document.getElementById('profileModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // 폼 초기화
        document.getElementById('profileForm').reset();
        document.getElementById('imagePreview').style.display = 'none';
    }
    
    // 프로필 업데이트 처리
    function handleProfileUpdate() {
        const name = document.getElementById('profileName').value.trim();
        const email = document.getElementById('profileEmail').value.trim();
        const imageFile = document.getElementById('profileImage').files[0];
        
        if (!name || !email) {
            alert('이름과 이메일을 모두 입력해주세요.');
            return;
        }
        
        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('올바른 이메일 형식을 입력해주세요.');
            return;
        }
        
        const userInfo = AuthManager.getUserInfo();
        const updatedInfo = {
            ...userInfo,
            name: name,
            email: email
        };
        
        // 프로필 이미지 처리
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                updatedInfo.profileImage = e.target.result;
                updateUserProfile(updatedInfo);
            };
            reader.readAsDataURL(imageFile);
        } else {
            updateUserProfile(updatedInfo);
        }
    }
    
    // 사용자 프로필 업데이트
    function updateUserProfile(updatedInfo) {
        // localStorage에 저장
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
        
        // 화면 업데이트
        updateProfileDisplay(updatedInfo);
        
        // 모달 닫기
        closeProfileModal();
        
        alert('프로필이 성공적으로 업데이트되었습니다!');
    }
    
    // 프로필 화면 업데이트
    function updateProfileDisplay(userInfo) {
        // 사용자 이름 업데이트
        const usernameElement = document.querySelector('.username');
        if (usernameElement) {
            usernameElement.textContent = `${userInfo.name}님`;
        }
        
        // 이메일 업데이트
        const emailElement = document.querySelector('.user-email');
        if (emailElement) {
            emailElement.textContent = userInfo.email;
        }
        
        // 프로필 이미지 업데이트
        const profileImageElement = document.querySelector('.profile-image');
        if (profileImageElement && userInfo.profileImage) {
            profileImageElement.style.backgroundImage = `url(${userInfo.profileImage})`;
            profileImageElement.style.backgroundSize = 'cover';
            profileImageElement.style.backgroundPosition = 'center';
        }
    }
});