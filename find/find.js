document.addEventListener('DOMContentLoaded', function() {
    const ROUTINES_STORAGE_KEY = 'allRoutinesData'; // 로컬 스토리지 키

    let currentRoutines = []; // 현재 필터링된 루틴들을 담을 배열
    let currentFilterType = '식단'; // 현재 선택된 탭 (식단/운동)
    let currentFilterCategory = '가수'; // 현재 선택된 카테고리 (가수/배우/아이돌/기타)
    let itemsPerPage = 6; // 한 페이지에 보여줄 카드 개수
    let currentPage = 1; // 현재 페이지 번호

    // --- 유틸리티 함수: 로컬 스토리지 관리 ---
    function getRoutinesFromLocalStorage() {
        try {
            const data = localStorage.getItem(ROUTINES_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('로컬 스토리지에서 루틴 데이터를 불러오는 중 오류 발생:', error);
            return [];
        }
    }

    function saveRoutinesToLocalStorage(routines) {
        try {
            localStorage.setItem(ROUTINES_STORAGE_KEY, JSON.stringify(routines));
        } catch (error) {
            console.error('로컬 스토리지에 루틴 데이터를 저장하는 중 오류 발생:', error);
        }
    }

    // --- 초기 데이터 설정 (로컬 스토리지에 데이터가 없으면 기본 데이터 저장) ---
    function initializeRoutinesData() {
        let routines = getRoutinesFromLocalStorage();
        if (routines.length === 0) {
            const initialRoutines = [
                {
                    "id": "diet_iu_1",
                    "type": "식단",
                    "category": "가수",
                    "personName": "아이유",
                    "routineTitle": "사과 아침 식단",
                    "routineImage": "https://previews.123rf.com/images/belchonock/belchonock1504/belchonock150405021/38931531-sliced-apple-isolated-on-white.jpg",
                    "description": "사과 1개, 고구마 1개, 단백질 셰이크로 구성된 아침 식단입니다."
                },
                {
                    "id": "diet_iu_2",
                    "type": "식단",
                    "category": "가수",
                    "personName": "아이유",
                    "routineTitle": "IU 점심 식단",
                    "routineImage": "https://img.cjthemarket.com/images/file/RVW/2025/0426/7f7c7c2b-8d6e-43ea-980c-adc3e3311a50_20250426132037_thum.jpg?SF=webp&RS=656",
                    "description": "닭가슴살 샐러드와 통밀빵 한 조각으로 이루어진 점심 식단입니다."
                },
                {
                    "id": "workout_jk_1",
                    "type": "운동",
                    "category": "가수",
                    "personName": "정국",
                    "routineTitle": "BTS 정국 근력 루틴",
                    "routineImage": "https://i.ytimg.com/vi/2knAJkotofM/maxresdefault.jpg",
                    "description": "고강도 인터벌 트레이닝과 전신 근력 운동으로 구성됩니다."
                },
                {
                    "id": "diet_baesuzy_1",
                    "type": "식단",
                    "category": "배우",
                    "personName": "배수지",
                    "routineTitle": "수지 클린 식단",
                    "routineImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPE3kFy8m4Zmi9pCsFawL2rz7I7UKbu2MvSw&s",
                    "description": "현미밥, 닭가슴살, 채소 위주의 건강한 식단입니다."
                },
                {
                    "id": "workout_baesuzy_1",
                    "type": "운동",
                    "category": "배우",
                    "personName": "배수지",
                    "routineTitle": "수지 요가 스트레칭",
                    "routineImage": "https://mblogthumb-phinf.pstatic.net/MjAxODA3MDlfMjk1/MDAxNTMxMTA0NzMxMjM1.Y_h-20osTjG3yEaj0cGlPaC1YT3FC6QDvgb1f-2wfrYg.GJ9WXggDmKVDPL3NlSe1oSkCCpRJyMOUU0d1mF7-3dsg.JPEG.ed_sunny/image_3115686011531104536636.jpg?type=w800",
                    "description": "유연성 증진과 몸의 균형을 위한 요가 스트레칭 루틴입니다."
                },
                {
                    "id": "diet_goyoonjung_1",
                    "type": "식단",
                    "category": "배우",
                    "personName": "고윤정",
                    "routineTitle": "고윤정 다이어트",
                    "routineImage": "https://kormedi.com/wp-content/uploads/2024/01/gettyimages-1337501952.jpg",
                    "description": "단백질 위주와 저탄수 식단입니다."
                },
                {
                    "id": "workout_goyoonjung_1",
                    "type": "운동",
                    "category": "배우",
                    "personName": "고윤정",
                    "routineTitle": "고윤정 필라테스",
                    "routineImage": "https://www.cosmopolitan.co.kr/resources_old/online/org_online_image/cp/0c8fbbbd-03d6-4c40-b978-60a1ddb2b323.jpg",
                    "description": "코어 강화와 자세 교정을 위한 필라테스 루틴입니다."
                },
                {
                    "id": "diet_jennie_1",
                    "type": "식단",
                    "category": "아이돌",
                    "personName": "제니",
                    "routineTitle": "제니 해독 주스",
                    "routineImage": "https://i1.daumcdn.net/thumb/C230x300/?fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FxqpEn%2FbtsIpy77VTU%2FAAAAAAAAAAAAAAAAAAAAAETZiH4vGPSGOdEQ6GQRLaCHvLVyF6V4vdOiPPuAtMQ-%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1751295599%26allow_ip%3D%26allow_referer%3D%26signature%3DVtqjm5YgYQEe7Dpc140jFUl%252FUOI%253D",
                    "description": "신선한 채소와 과일로 만든 해독 주스 레시피입니다."
                },
                {
                    "id": "workout_jennie_1",
                    "type": "운동",
                    "category": "아이돌",
                    "personName": "제니",
                    "routineTitle": "제니 댄스 트레이닝",
                    "routineImage": "https://www.harpersbazaar.co.kr/resources_old/online/org_online_image/06db2716-3922-49e4-81f9-e6df9841f8eb.jpg",
                    "description": "유산소와 근력 운동을 결합한 댄스 트레이닝 루틴입니다."
                },
                {
                    "id": "diet_jennie_2",
                    "type": "식단",
                    "category": "아이돌",
                    "personName": "제니",
                    "routineTitle": "제니 저염식단",
                    "routineImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXCKUHVzdS3jW-b040ZninZ8-jEaRosWzIAw&s",
                    "description": "염분 섭취를 최소화한 저염식 식단입니다."
                },
                {
                    "id": "diet_eunbi_1",
                    "type": "식단",
                    "category": "가수",
                    "personName": "권은비",
                    "routineTitle": "사과 슬라이드",
                    "routineImage": "https://preview.free3d.com/img/2020/01/2279681175729473169/8c85qmsz.jpg",
                    "description": "사과를 슬라이스로 잘라 시간별로 섭취하여 하루에 사과 하나씩 섭취"
                },
                {
                    "id": "workout_eunbi_1",
                    "type": "운동",
                    "category": "가수",
                    "personName": "권은비",
                    "routineTitle": "은비 코어 운동",
                    "routineImage": "https://preview.free3d.com/img/2020/01/2279681175729473169/8c85qmsz.jpg",
                    "description": "복근과 코어 강화를 위한 운동 루틴입니다."
                },
                {
                    "id": "diet_etc_1",
                    "type": "식단",
                    "category": "기타",
                    "personName": "일반인 A",
                    "routineTitle": "건강 유지 식단",
                    "routineImage": "https://health.chosun.com/fileupload/healthcare_news/mdtoday_202104/20210401132202_20210401122353_60653cc9702da_1.jpg",
                    "description": "균형 잡힌 영양소 섭취를 위한 일반적인 식단입니다."
                },
                {
                    "id": "workout_etc_1",
                    "type": "운동",
                    "category": "기타",
                    "personName": "트레이너 B",
                    "routineTitle": "초급자 전신 운동",
                    "routineImage": "https://i.ytimg.com/vi/w0WQHVYKsss/sddefault.jpg",
                    "description": "운동 초급자를 위한 쉽고 효과적인 전신 운동 루틴입니다."
                },
                {
                    "id": "diet_actor_1",
                    "type": "식단",
                    "category": "배우",
                    "personName": "김배우",
                    "routineTitle": "김배우 디톡스 주스",
                    "routineImage": "https://m.nongshimmall.com/file_data/nsmall2022/2023/05/12/afdaa5f48896b256df3d82e899a597c9.jpg",
                    "description": "몸 속 노폐물 배출을 돕는 디톡스 주스 레시피입니다."
                },
                {
                    "id": "workout_idol_1",
                    "type": "운동",
                    "category": "아이돌",
                    "personName": "박아이돌",
                    "routineTitle": "박아이돌 유산소 댄스",
                    "routineImage": "https://i.ytimg.com/vi/YMDdfzZcSiw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCEBnRAMvvYGG_wxBh0DzuNwKgBYg",
                    "description": "칼로리 소모에 효과적인 유산소 댄스 루틴입니다."
                }
            ];
            saveRoutinesToLocalStorage(initialRoutines);
            routines = initialRoutines;
        }
        return routines;
    }

    const allRoutines = initializeRoutinesData(); // 모든 루틴 데이터

    // 로그인 상태 확인 (선택적 - find 페이지는 비로그인도 접근 가능)
    if (window.AuthManager) {
        window.AuthManager.updateUserDisplay();
    }

    const tabs = document.querySelectorAll('.tab');
    const filterPills = document.querySelectorAll('.filter-pill');
    const navItems = document.querySelectorAll('.nav-item');
    const searchButton = document.querySelector('.search-button');
    const dietCardsContainer = document.querySelector('.diet-cards'); // 루틴 카드를 표시할 컨테이너

    // 무한 스크롤을 위한 IntersectionObserver 설정
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 마지막 요소가 보일 때 다음 페이지 로드
                loadMoreRoutines();
            }
        });
    }, {
        root: null, // 뷰포트를 기준으로
        threshold: 0.1 // 10%가 보이면 콜백 실행
    });

    let lastCardObserver = null; // 이전에 관찰하던 요소를 저장

    // --- 이벤트 리스너 설정 ---

    // 탭 전환 기능
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentFilterType = this.textContent.trim(); // '식단' 또는 '운동'
            currentPage = 1; // 탭 변경 시 페이지 초기화
            filterAndDisplayRoutines(); // 필터링 및 재표시
        });
    });

    // 카테고리 필터 기능
    filterPills.forEach(pill => {
        pill.addEventListener('click', function() {
            filterPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            currentFilterCategory = this.textContent.trim(); // '가수', '배우' 등
            currentPage = 1; // 카테고리 변경 시 페이지 초기화
            filterAndDisplayRoutines(); // 필터링 및 재표시
        });
    });

    // 네비게이션 아이템 기능
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const navText = this.querySelector('.nav-text').textContent.trim();
            handleNavigation(navText);
        });
    });

    // 검색 버튼 기능
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            showSearchModal();
        });
    }

    // --- 루틴 표시 및 필터링 함수 ---

    /**
     * 필터링된 루틴 데이터를 화면에 표시하는 함수
     * @param {Array} routinesToDisplay - 표시할 루틴 데이터 배열
     * @param {boolean} append - 기존 카드에 추가할지 (true), 새로 그릴지 (false)
     */
    function displayRoutines(routinesToDisplay, append = false) {
        if (!append) {
            dietCardsContainer.innerHTML = ''; // 기존 카드 모두 제거 (초기 로드 또는 필터 변경 시)
            currentPage = 1; // 새롭게 시작하므로 현재 페이지를 1로 설정
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const routinesToShow = routinesToDisplay.slice(startIndex, endIndex);

        if (routinesToShow.length === 0 && !append) {
            dietCardsContainer.innerHTML = '<p class="no-results">검색 결과가 없습니다.</p>';
            if (lastCardObserver) { // 기존에 관찰 중인 요소가 있다면 관찰 중지
                lastCardObserver.disconnect();
            }
            return;
        }

        routinesToShow.forEach(routine => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img class="card-image" src="${routine.routineImage}" alt="${routine.routineTitle}">
                <div class="card-content">
                    <div class="card-title">
                        <h3>${routine.personName}</h3>
                        <p class="subtitle">${routine.routineTitle}</p>
                    </div>
                    <p class="card-description">
                        ${routine.description.replace(/\n/g, '<br>')}
                    </p>
                </div>
                <div class="add-button" data-routine-id="${routine.id}">
                    <div class="plus-icon"></div>
                </div>
            `;
            dietCardsContainer.appendChild(card);
        });

        // Add button functionality for newly added cards
        addEventListenersToNewCards();

        // 무한 스크롤을 위해 마지막 카드에 Observer 연결
        if (routinesToDisplay.length > endIndex) { // 아직 로드할 데이터가 남아있으면
            if (lastCardObserver) {
                observer.unobserve(lastCardObserver); // 이전 마지막 카드의 관찰 중지
            }
            lastCardObserver = dietCardsContainer.lastElementChild;
            if (lastCardObserver) {
                observer.observe(lastCardObserver);
            }
        } else {
            if (lastCardObserver) {
                observer.unobserve(lastCardObserver); // 모든 데이터 로드 완료 시 관찰 중지
                lastCardObserver = null;
            }
        }
    }

    /**
     * 현재 선택된 탭, 카테고리, 검색어에 따라 루틴을 필터링하고 화면을 업데이트합니다.
     * @param {string} searchTerm - 검색어 (선택 사항)
     */
    function filterAndDisplayRoutines(searchTerm = '') {
        // 모든 루틴 데이터를 가져옴
        let filteredRoutines = allRoutines;

        // 1. 탭 필터링 (식단/운동)
        if (currentFilterType !== '') {
            filteredRoutines = filteredRoutines.filter(routine => routine.type === currentFilterType);
        }

        // 2. 카테고리 필터링 (가수/배우/아이돌/기타)
        if (currentFilterCategory !== '전체' && currentFilterCategory !== '') {
            filteredRoutines = filteredRoutines.filter(routine => routine.category === currentFilterCategory);
        }

        // 3. 검색어 필터링
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filteredRoutines = filteredRoutines.filter(routine =>
                routine.personName.toLowerCase().includes(lowerCaseSearchTerm) ||
                routine.routineTitle.toLowerCase().includes(lowerCaseSearchTerm) ||
                routine.description.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }
        
        currentRoutines = filteredRoutines; // 필터링된 전체 루틴 저장
        displayRoutines(currentRoutines, false); // 처음부터 다시 표시
    }

    /**
     * 다음 페이지의 루틴을 로드하여 기존 카드에 추가합니다.
     */
    function loadMoreRoutines() {
        if (currentRoutines.length > currentPage * itemsPerPage) {
            currentPage++;
            displayRoutines(currentRoutines, true); // 기존 카드에 추가
        } else {
            console.log('더 이상 로드할 루틴이 없습니다.');
            if (lastCardObserver) {
                observer.unobserve(lastCardObserver); // 모든 데이터 로드 완료 시 관찰 중지
                lastCardObserver = null;
            }
        }
    }

    // --- 기타 함수 ---

    // 새로운 카드에 '루틴에 추가' 버튼 이벤트 리스너를 동적으로 연결
    function addEventListenersToNewCards() {
        const newlyAddedButtons = document.querySelectorAll('.card:not(.has-event) .add-button');
        newlyAddedButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // 카드 자체의 클릭 이벤트가 발생하지 않도록
                const card = this.closest('.card');
                const title = card.querySelector('.subtitle').textContent; // 루틴 제목
                const personName = card.querySelector('h3').textContent; // 등록자 이름
                const description = card.querySelector('.card-description').textContent; // 설명
                const routineImage = card.querySelector('.card-image').src; // 이미지 URL
                const routineId = this.dataset.routineId; // 루틴 ID

                addToRoutine(routineId, personName, title, routineImage, description);
            });
            button.closest('.card').classList.add('has-event'); // 이벤트가 등록되었음을 표시
        });
    }

    // 네비게이션 핸들러
    function handleNavigation(navName) {
        switch(navName) {
            case '루틴':
                window.location.href = '../plan/plan.html';
                break;
            case '마이 페이지':
                window.location.href = '../mypage/mypage.html';
                break;
            case '탐색':
                // 현재 페이지이므로 아무것도 하지 않음
                break;
            default:
                console.log(`${navName} 네비게이션 클릭`);
        }
    }

    // 검색 모달 기능
    function showSearchModal() {
        const searchTerm = prompt('검색할 키워드를 입력하세요: (인물명, 루틴 제목, 설명)');
        if (searchTerm !== null && searchTerm.trim() !== '') {
            console.log(`검색어: ${searchTerm}`);
            filterAndDisplayRoutines(searchTerm.trim()); // 검색어로 필터링하여 표시
        } else if (searchTerm === '') {
            // 검색어 없이 확인 누르면 필터 초기화
            filterAndDisplayRoutines('');
        }
    }

    /**
     * 루틴을 마이 페이지의 즐겨찾기 또는 루틴 목록에 추가합니다.
     * @param {string} id - 루틴의 고유 ID
     * @param {string} personName - 등록자 이름
     * @param {string} routineTitle - 루틴 제목
     * @param {string} routineImage - 루틴 이미지 URL
     * @param {string} description - 루틴 설명
     */
    function addToRoutine(id, personName, routineTitle, routineImage, description) {
        const mypageFavoritesKey = 'myWorkoutFavorites'; // mypage.js와 동일한 키 사용

        // mypage.js에서 사용될 즐겨찾기 데이터 구조와 동일하게 만듭니다.
        const newFavoriteData = {
            id: id,
            personName: personName,
            routineTitle: routineTitle,
            routineImage: routineImage,
            description: description
        };

        let favorites = [];
        try {
            const storedFavorites = localStorage.getItem(mypageFavoritesKey);
            favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        } catch (error) {
            console.error('마이페이지 즐겨찾기를 불러오는 중 오류 발생:', error);
        }

        // 중복 추가 방지 (optional)
        const isDuplicate = favorites.some(item => item.id === newFavoriteData.id);
        if (isDuplicate) {
            alert('이미 루틴에 추가된 항목입니다!');
            return;
        }

        favorites.push(newFavoriteData);

        try {
            localStorage.setItem(mypageFavoritesKey, JSON.stringify(favorites));
            alert(`${personName}님의 "${routineTitle}"이(가) 루틴에 추가되었습니다!`);
            console.log('루틴 추가 성공:', newFavoriteData);
        } catch (error) {
            console.error('루틴 저장 실패:', error);
            alert('루틴 추가에 실패했습니다.');
        }
    }

    // --- 초기화 ---
    // 페이지 로드 시 초기 루틴 표시
    filterAndDisplayRoutines(); // 초기에는 '식단' 탭, '가수' 카테고리 기준으로 표시
});

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('.add-button'); // Get the first add button, you might want to select all
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeButton = document.querySelector('.modal-close-button');

    // Show modal when add button is clicked (example)
    if (addButton) {
        addButton.addEventListener('click', () => {
            modalOverlay.classList.add('active');
        });
    }

    // Hide modal when close button is clicked
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }

    // Hide modal when clicking outside of the modal content
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }
});

