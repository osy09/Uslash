// Form validation and interaction handling
class SignupForm {
    constructor() {
        this.form = document.getElementById('signupForm');
        this.isIdChecked = false;
        this.isPhoneVerified = false;
        this.verificationTimer = null;
        this.timerSeconds = 180; // 3 minutes

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // ID duplicate check
        document.getElementById('checkDuplicateBtn').addEventListener('click', () => this.checkDuplicate());

        // Password validation (input 이벤트 발생 시 즉시 유효성 검사)
        document.getElementById('password').addEventListener('input', () => this.validatePassword());
        document.getElementById('passwordConfirm').addEventListener('input', () => this.validatePasswordConfirm());

        // Email domain handling
        document.getElementById('emailDomain').addEventListener('change', () => this.handleEmailDomain());

        // Phone verification
        document.getElementById('sendVerificationBtn').addEventListener('click', () => this.sendVerification());
        document.getElementById('verifyCodeBtn').addEventListener('click', () => this.verifyCode());

        // Real-time validation for userId: ID 변경 시 중복 확인 상태 초기화
        document.getElementById('userId').addEventListener('input', () => {
            this.isIdChecked = false;
            this.clearMessage('userIdSuccess');
            this.clearMessage('userIdError');
        });

        // Real-time validation for phone: 휴대폰 번호 변경 시 인증 상태 초기화
        document.getElementById('phone').addEventListener('input', () => {
            this.isPhoneVerified = false;
            this.clearMessage('phoneSuccess');
            this.clearMessage('phoneError');
            document.getElementById('verificationGroup').style.display = 'none';
            // 타이머가 동작 중이라면 중지
            if (this.verificationTimer) {
                clearInterval(this.verificationTimer);
                document.getElementById('verificationTimer').textContent = '';
            }
            // 인증 번호 필드와 버튼 활성화 (새로운 인증을 위해)
            document.getElementById('verificationCode').disabled = false;
            document.getElementById('verifyCodeBtn').disabled = false;
        });
    }

    validateUserId(userId) {
        const regex = /^[a-z][a-z0-9]{3,11}$/;
        return regex.test(userId);
    }

    // validatePassword 함수 수정
    validatePassword() {
        const password = document.getElementById('password').value;
        this.clearMessage('passwordError'); // 항상 시작 시 메시지 초기화

        let isValid = true; // 비밀번호 유효성 자체를 위한 플래그

        if (password.length < 6 || password.length > 20) {
            this.showMessage('passwordError', '6~20자의 영문 대소문자, 숫자, 특수문자 중 2가지 이상 조합해주세요.');
            isValid = false;
        } else {
            const hasLower = /[a-z]/.test(password);
            const hasUpper = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            const typeCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

            if (typeCount < 2) {
                this.showMessage('passwordError', '6~20자의 영문 대소문자, 숫자, 특수문자 중 2가지 이상 조합해주세요.');
                isValid = false;
            }
        }

        // 비밀번호 유효성 검사 결과와 상관없이 비밀번호 확인 필드를 항상 검사
        this.validatePasswordConfirm();

        return isValid; // 유효성 검사 통과 여부 반환
    }

    // validatePasswordConfirm 함수 수정
    validatePasswordConfirm() {
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;

        this.clearMessage('passwordConfirmError'); // 항상 시작 시 메시지 초기화

        // 비밀번호 확인 필드가 비어있으면 메시지 표시 안 함 (입력 전 상태)
        if (!passwordConfirm) {
            return false; // 비어있으므로 아직 유효하지 않다고 판단 (handleSubmit에서 다시 검사)
        }

        // 비밀번호와 비밀번호 확인이 일치하는지 여부만 검사
        if (password !== passwordConfirm) {
            this.showMessage('passwordConfirmError', '비밀번호가 일치하지 않습니다.');
            return false;
        }

        return true; // 유효성 검사 통과
    }


    validateEmail(local, domain) {
        const emailRegex = /^[^\s@]+$/;
        const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        return emailRegex.test(local) && domainRegex.test(domain);
    }

    validatePhone(phone) {
        // 숫자, 하이픈만 허용, 01로 시작하며 10-11자리 (하이픈 포함)
        const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // --- 로컬 스토리지 관련 헬퍼 함수 시작 ---
    getUsers() {
        const users = localStorage.getItem('users');
        try {
            return users ? JSON.parse(users) : [];
        } catch (e) {
            console.error("Failed to parse users from localStorage:", e);
            return []; // 파싱 오류 시 빈 배열 반환
        }
    }

    saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }
    // --- 로컬 스토리지 관련 헬퍼 함수 끝 ---

    checkDuplicate() {
        const userId = document.getElementById('userId').value.trim();
        this.clearMessage('userIdError');
        this.clearMessage('userIdSuccess');

        if (!userId) {
            this.showMessage('userIdError', '아이디를 입력해주세요.');
            this.isIdChecked = false; // 중복확인 실패
            return;
        }

        if (!this.validateUserId(userId)) {
            this.showMessage('userIdError', '4~12자의 영문 소문자로 시작하고 숫자 조합이 가능합니다.');
            this.isIdChecked = false; // 중복확인 실패
            return;
        }

        const users = this.getUsers();
        const isDuplicate = users.some(user => user.userId === userId);

        // 실제 API 호출처럼 딜레이를 줍니다.
        setTimeout(() => {
            if (isDuplicate) {
                this.isIdChecked = false;
                this.showMessage('userIdError', '이미 사용 중인 아이디입니다.');
            } else {
                this.isIdChecked = true;
                this.showMessage('userIdSuccess', '사용 가능한 아이디입니다.');
            }
        }, 500);
    }


    handleEmailDomain() {
        const domainSelect = document.getElementById('emailDomain');
        const customDomainInput = document.getElementById('customDomain');

        if (domainSelect.value === 'direct') {
            customDomainInput.style.display = 'block';
            customDomainInput.required = true;
        } else {
            customDomainInput.style.display = 'none';
            customDomainInput.required = false;
            customDomainInput.value = '';
        }
    }

    sendVerification() {
        const phone = document.getElementById('phone').value.trim();
        this.clearMessage('phoneError');
        this.clearMessage('phoneSuccess');

        if (!phone) {
            this.showMessage('phoneError', '휴대폰 번호를 입력해주세요.');
            return;
        }

        if (!this.validatePhone(phone)) {
            this.showMessage('phoneError', '올바른 휴대폰 번호를 입력해주세요. (예: 010-1234-5678)');
            return;
        }

        // 인증번호 발송 모의
        document.getElementById('verificationGroup').style.display = 'block';
        this.showMessage('phoneSuccess', '인증번호가 발송되었습니다.');

        // 타이머 시작
        this.startVerificationTimer();
    }

    startVerificationTimer() {
        const timerElement = document.getElementById('verificationTimer');
        this.timerSeconds = 180; // 3분

        if (this.verificationTimer) {
            clearInterval(this.verificationTimer); // 기존 타이머가 있다면 중지
        }

        // 인증 번호 필드와 버튼 활성화
        document.getElementById('verificationCode').disabled = false;
        document.getElementById('verifyCodeBtn').disabled = false;
        this.clearMessage('verificationError');
        this.clearMessage('verificationSuccess');


        this.verificationTimer = setInterval(() => {
            const minutes = Math.floor(this.timerSeconds / 60);
            const seconds = this.timerSeconds % 60;
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            if (this.timerSeconds <= 0) {
                clearInterval(this.verificationTimer);
                timerElement.textContent = '인증시간이 만료되었습니다.';
                document.getElementById('verificationCode').disabled = true; // 시간 만료 시 입력 필드 비활성화
                document.getElementById('verifyCodeBtn').disabled = true; // 시간 만료 시 버튼 비활성화
                this.showMessage('verificationError', '인증 시간이 만료되었습니다. 다시 인증번호를 받아주세요.');
            }

            this.timerSeconds--;
        }, 1000);
    }

    verifyCode() {
        const code = document.getElementById('verificationCode').value.trim();
        this.clearMessage('verificationError');
        this.clearMessage('verificationSuccess');

        if (!code) {
            this.showMessage('verificationError', '인증번호를 입력해주세요.');
            return;
        }

        // Mock verification - 실제로는 서버에서 발송된 인증번호와 비교해야 함
        setTimeout(() => {
            // 이 부분에서 실제 인증 번호 (예: 1234)와 사용자가 입력한 코드를 비교
            if (code === '1234') { // '123456' 대신 '1234'로 다시 변경합니다.
                this.isPhoneVerified = true;
                clearInterval(this.verificationTimer); // 타이머 중지
                document.getElementById('verificationTimer').textContent = ''; // 타이머 텍스트 제거
                this.showMessage('verificationSuccess', '휴대폰 인증이 완료되었습니다.');
                document.getElementById('verificationCode').disabled = true; // 인증 완료 시 입력 필드 비활성화
                document.getElementById('verifyCodeBtn').disabled = true; // 인증 완료 시 버튼 비활성화
            } else {
                this.isPhoneVerified = false;
                this.showMessage('verificationError', '인증번호가 일치하지 않습니다.');
            }
        }, 500);
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log('Form submission initiated.');

        this.clearAllMessages(); // 모든 에러/성공 메시지 초기화

        let isValid = true; // 전체 폼 유효성 상태

        // 모든 필드 값 가져오기
        const userId = document.getElementById('userId').value.trim();
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        const emailLocal = document.getElementById('emailLocal').value.trim();
        const emailDomainSelect = document.getElementById('emailDomain');
        const emailDomainValue = emailDomainSelect.value;
        const customDomain = document.getElementById('customDomain').value.trim();
        const phone = document.getElementById('phone').value.trim();


        // 1. 아이디 유효성 검사
        if (!userId) {
            this.showMessage('userIdError', '아이디를 입력해주세요.');
            isValid = false;
        } else if (!this.validateUserId(userId)) {
            this.showMessage('userIdError', '4~12자의 영문 소문자로 시작하고 숫자 조합이 가능합니다.');
            isValid = false;
        } else if (!this.isIdChecked) {
            this.showMessage('userIdError', '아이디 중복확인을 해주세요.');
            isValid = false;
        }

        // 2. 비밀번호 유효성 검사 (handleSubmit에서 최종 검사)
        // validatePassword()가 메시지를 표시하므로, isValid만 업데이트합니다.
        if (!this.validatePassword()) {
            isValid = false;
        }

        // 3. 비밀번호 확인 유효성 검사 (handleSubmit에서 최종 검사)
        // validatePasswordConfirm()이 메시지를 표시하므로, isValid만 업데이트합니다.
        if (!this.validatePasswordConfirm()) {
            isValid = false;
        }

        // 4. 이메일 유효성 검사
        let fullEmailDomain = emailDomainValue;
        if (emailDomainValue === 'direct') {
            fullEmailDomain = customDomain;
        }

        if (!emailLocal) {
            this.showMessage('emailError', '이메일 주소를 입력해주세요.');
            isValid = false;
        } else if (!fullEmailDomain || fullEmailDomain === '선택') { // '선택' 옵션도 처리
            this.showMessage('emailError', '이메일 도메인을 선택하거나 직접 입력해주세요.');
            isValid = false;
        } else if (!this.validateEmail(emailLocal, fullEmailDomain)) {
            this.showMessage('emailError', '올바른 이메일 주소 형식이 아닙니다.');
            isValid = false;
        }


        // 5. 휴대폰 번호 유효성 검사
        if (!phone) {
            this.showMessage('phoneError', '휴대폰 번호를 입력해주세요.');
            isValid = false;
        } else if (!this.validatePhone(phone)) {
            this.showMessage('phoneError', '올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)');
            isValid = false;
        } else if (!this.isPhoneVerified) {
            this.showMessage('phoneError', '휴대폰 인증을 완료해주세요.');
            isValid = false;
        }

        // 모든 유효성 검사를 통과했을 때만 회원가입 처리
        if (isValid) {
            console.log('All form validations passed. Attempting to save user data.');

            // --- 회원가입 데이터 로컬 스토리지에 저장 ---
            const users = this.getUsers();
            const newUser = {
                userId: userId,
                // 실제 앱에서는 비밀번호를 해싱하여 저장해야 합니다. (보안 경고)
                password: password,
                email: `${emailLocal}@${fullEmailDomain}`,
                phone: phone
            };

            users.push(newUser);
            this.saveUsers(users);

            alert('회원가입이 완료되었습니다!');
            console.log('회원가입 성공:', newUser);
            console.log('Current users in Local Storage:', this.getUsers());

            // 폼 초기화 및 상태 초기화
            this.form.reset();
            this.clearAllMessages();
            this.isIdChecked = false;
            this.isPhoneVerified = false;
            document.getElementById('verificationGroup').style.display = 'none';
            document.getElementById('customDomain').style.display = 'none';
            // 타이머가 동작 중이라면 중지
            if (this.verificationTimer) {
                clearInterval(this.verificationTimer);
                document.getElementById('verificationTimer').textContent = '';
            }
            // 인증 번호 필드와 버튼 활성화 (다음 회원가입을 위해)
            document.getElementById('verificationCode').disabled = false;
            document.getElementById('verifyCodeBtn').disabled = false;


            // 로그인 페이지로 리다이렉트 (HTML 주석 해제 후 사용)
            // setTimeout(() => { // 사용자에게 완료 메시지를 보여줄 시간을 주기 위해 딜레이
            //     window.location.href = '../login/login.html';
            // }, 1500);

        } else {
            console.log('Form validation failed. Please check error messages.');
        }
    }

    // 메시지 표시 및 숨김 헬퍼 함수
    showMessage(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            element.style.color = elementId.includes('Error') ? '#dc3545' : '#28a745'; // 에러는 빨간색, 성공은 초록색
        }
    }

    clearMessage(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
            element.textContent = '';
        }
    }

    clearAllMessages() {
        const messageElements = document.querySelectorAll('.error-message, .success-message');
        messageElements.forEach(element => {
            element.style.display = 'none';
            element.textContent = '';
        });
    }
}

// DOM 로드 완료 후 폼 초기화
document.addEventListener('DOMContentLoaded', () => {
    new SignupForm();
});

// 휴대폰 번호 입력 포맷팅
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');

    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // 숫자만 남김
        let formattedValue = '';

        if (value.length > 0) {
            formattedValue += value.substring(0, 3); // 010
            if (value.length >= 4) {
                formattedValue += '-' + value.substring(3, 7); // 010-XXXX
                if (value.length >= 8) {
                    formattedValue += '-' + value.substring(7, 11); // 010-XXXX-XXXX
                }
            }
        }
        e.target.value = formattedValue;
    });
});