// login.js

// 기존 TEST_USER는 이제 필요 없을 수 있습니다.
// const TEST_USER = { id: 'testuser', pw: '1234' }; // 이 부분은 이제 사용되지 않습니다.

window.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        alert(`${loggedInUser}님은 이미 로그인 상태입니다.`);
        // location.href = './home.html'; // 로그인 후 이동할 페이지
    }
});

const loginForm = document.getElementById('loginForm');
const userIdInput = document.getElementById('userId');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const userIdError = document.getElementById('userIdError');
const passwordError = document.getElementById('passwordError');

const findIdLink = document.getElementById('findId');
const findPasswordLink = document.getElementById('findPassword');
const signUpLink = document.getElementById('signUp');

// --- 로컬 스토리지에서 사용자 목록을 가져오는 헬퍼 함수 추가 ---
function getUsers() {
    const users = localStorage.getItem('users');
    try {
        return users ? JSON.parse(users) : [];
    } catch (e) {
        console.error("Failed to parse users from localStorage:", e);
        return []; // 파싱 오류 시 빈 배열 반환
    }
}
// --- 헬퍼 함수 끝 ---

function validateUserId(userId) {
    return userId.trim() ? '' : '아이디를 입력해주세요.';
}

function validatePassword(password) {
    return password.trim() ? '' : '비밀번호를 입력해주세요.';
}

function showError(el, msg) {
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
}

function clearError(el) {
    el.textContent = '';
    el.style.display = 'none';
}

userIdInput.addEventListener('blur', () => {
    showError(userIdError, validateUserId(userIdInput.value));
});

passwordInput.addEventListener('blur', () => {
    showError(passwordError, validatePassword(passwordInput.value));
});

userIdInput.addEventListener('input', () => {
    if (userIdError.style.display === 'block') clearError(userIdError);
});

passwordInput.addEventListener('input', () => {
    if (passwordError.style.display === 'block') clearError(passwordError);
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userId = userIdInput.value;
    const password = passwordInput.value;

    clearError(userIdError);
    clearError(passwordError);

    const userIdErr = validateUserId(userId);
    const passwordErr = validatePassword(password);

    if (userIdErr) showError(userIdError, userIdErr);
    if (passwordErr) showError(passwordError, passwordErr);
    if (userIdErr || passwordErr) return;

    loginButton.disabled = true;
    loginButton.textContent = '로그인 중...';

    setTimeout(() => {
        // --- 여기를 수정합니다: 로컬 스토리지에서 users 데이터를 가져와 비교 ---
        const users = getUsers(); // 회원가입 데이터 가져오기
        const foundUser = users.find(user => user.userId === userId && user.password === password);

        if (foundUser) {
            localStorage.setItem('loggedInUser', userId); // 로그인 성공 시 사용자 ID 저장
            alert('로그인 성공!');
            // location.href = './home.html'; // 실제 페이지 이동 시 주석 해제
        } else {
            alert('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
        // --- 수정 끝 ---

        loginButton.disabled = false;
        loginButton.textContent = '로그인 하기';
    }, 1000); // 실제 서버 통신을 모방한 딜레이
});

findIdLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('아이디 찾기 페이지로 이동합니다.');
});

findPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('비밀번호 찾기 페이지로 이동합니다.');
});

signUpLink.addEventListener('click', (e) => {
    e.preventDefault();
    // 실제 회원가입 페이지로 이동하는 코드
    // location.href = '../signup/signup.html';
    alert('회원가입 페이지로 이동합니다.');
});

// 모바일 키보드 최적화
function adjustViewportForKeyboard() {
    const inputs = [userIdInput, passwordInput];
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
}
adjustViewportForKeyboard();

// iOS 확대 방지
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.fontSize = '16px';
        });
        input.addEventListener('blur', () => {
            input.style.fontSize = '';
        });
    });
}