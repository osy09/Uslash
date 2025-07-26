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
        
        // Password validation
        document.getElementById('password').addEventListener('input', () => this.validatePassword());
        document.getElementById('passwordConfirm').addEventListener('input', () => this.validatePasswordConfirm());
        
        // Email domain handling
        document.getElementById('emailDomain').addEventListener('change', () => this.handleEmailDomain());
        
        // Phone verification
        document.getElementById('sendVerificationBtn').addEventListener('click', () => this.sendVerification());
        document.getElementById('verifyCodeBtn').addEventListener('click', () => this.verifyCode());
        
        // Real-time validation
        document.getElementById('userId').addEventListener('input', () => {
            this.isIdChecked = false;
            this.clearMessage('userIdSuccess');
            this.clearMessage('userIdError');
        });
        
        document.getElementById('phone').addEventListener('input', () => {
            this.isPhoneVerified = false;
            this.clearMessage('phoneSuccess');
            this.clearMessage('phoneError');
            document.getElementById('verificationGroup').style.display = 'none';
        });
    }

    validateUserId(userId) {
        const regex = /^[a-z][a-z0-9]{3,11}$/;
        return regex.test(userId);
    }

    validatePassword(password) {
        if (!password) password = document.getElementById('password').value;
        
        if (password.length < 6 || password.length > 20) {
            return false;
        }
        
        // Check for at least 2 types of characters
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const typeCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
        return typeCount >= 2;
    }

    validateEmail(local, domain) {
        const emailRegex = /^[^\s@]+$/;
        const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        return emailRegex.test(local) && domainRegex.test(domain);
    }

    validatePhone(phone) {
        const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    checkDuplicate() {
        const userId = document.getElementById('userId').value.trim();
        const errorElement = document.getElementById('userIdError');
        const successElement = document.getElementById('userIdSuccess');
        
        this.clearMessage('userIdError');
        this.clearMessage('userIdSuccess');
        
        if (!userId) {
            this.showMessage('userIdError', '아이디를 입력해주세요.');
            return;
        }
        
        if (!this.validateUserId(userId)) {
            this.showMessage('userIdError', '4~12자의 영문 소문자로 시작하고 숫자 조합이 가능합니다.');
            return;
        }
        
        // Simulate API call
        setTimeout(() => {
            // Mock duplicate check - assuming all IDs are available for demo
            this.isIdChecked = true;
            this.showMessage('userIdSuccess', '사용 가능한 아이디입니다.');
        }, 500);
    }

    validatePassword() {
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('passwordError');
        
        this.clearMessage('passwordError');
        
        if (password && !this.validatePassword(password)) {
            this.showMessage('passwordError', '6~20자의 영문 대소문자, 숫자, 특수문자 중 2가지 이상 조합해주세요.');
        }
        
        // Also validate password confirmation if it exists
        this.validatePasswordConfirm();
    }

    validatePasswordConfirm() {
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        const errorElement = document.getElementById('passwordConfirmError');
        
        this.clearMessage('passwordConfirmError');
        
        if (passwordConfirm && password !== passwordConfirm) {
            this.showMessage('passwordConfirmError', '비밀번호가 일치하지 않습니다.');
        }
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
        const errorElement = document.getElementById('phoneError');
        const successElement = document.getElementById('phoneSuccess');
        
        this.clearMessage('phoneError');
        this.clearMessage('phoneSuccess');
        
        if (!phone) {
            this.showMessage('phoneError', '휴대폰 번호를 입력해주세요.');
            return;
        }
        
        if (!this.validatePhone(phone)) {
            this.showMessage('phoneError', '올바른 휴대폰 번호를 입력해주세요.');
            return;
        }
        
        // Show verification code input
        document.getElementById('verificationGroup').style.display = 'block';
        this.showMessage('phoneSuccess', '인증번호가 발송되었습니다.');
        
        // Start timer
        this.startVerificationTimer();
    }

    startVerificationTimer() {
        const timerElement = document.getElementById('verificationTimer');
        this.timerSeconds = 180;
        
        if (this.verificationTimer) {
            clearInterval(this.verificationTimer);
        }
        
        this.verificationTimer = setInterval(() => {
            const minutes = Math.floor(this.timerSeconds / 60);
            const seconds = this.timerSeconds % 60;
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (this.timerSeconds <= 0) {
                clearInterval(this.verificationTimer);
                timerElement.textContent = '인증시간이 만료되었습니다.';
                document.getElementById('verificationCode').disabled = true;
                document.getElementById('verifyCodeBtn').disabled = true;
            }
            
            this.timerSeconds--;
        }, 1000);
    }

    verifyCode() {
        const code = document.getElementById('verificationCode').value.trim();
        const errorElement = document.getElementById('verificationError');
        const successElement = document.getElementById('verificationSuccess');
        
        this.clearMessage('verificationError');
        this.clearMessage('verificationSuccess');
        
        if (!code) {
            this.showMessage('verificationError', '인증번호를 입력해주세요.');
            return;
        }
        
        // Mock verification - assume all codes are valid for demo
        setTimeout(() => {
            this.isPhoneVerified = true;
            clearInterval(this.verificationTimer);
            document.getElementById('verificationTimer').textContent = '';
            this.showMessage('verificationSuccess', '휴대폰 인증이 완료되었습니다.');
            document.getElementById('verificationCode').disabled = true;
            document.getElementById('verifyCodeBtn').disabled = true;
        }, 500);
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Clear all previous errors
        this.clearAllMessages();
        
        let isValid = true;
        
        // Validate all fields
        const userId = document.getElementById('userId').value.trim();
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        const emailLocal = document.getElementById('emailLocal').value.trim();
        const emailDomain = document.getElementById('emailDomain').value;
        const customDomain = document.getElementById('customDomain').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        // User ID validation
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
        
        // Password validation
        if (!password) {
            this.showMessage('passwordError', '비밀번호를 입력해주세요.');
            isValid = false;
        } else if (!this.validatePassword(password)) {
            this.showMessage('passwordError', '6~20자의 영문 대소문자, 숫자, 특수문자 중 2가지 이상 조합해주세요.');
            isValid = false;
        }
        
        // Password confirmation validation
        if (!passwordConfirm) {
            this.showMessage('passwordConfirmError', '비밀번호 확인을 입력해주세요.');
            isValid = false;
        } else if (password !== passwordConfirm) {
            this.showMessage('passwordConfirmError', '비밀번호가 일치하지 않습니다.');
            isValid = false;
        }
        
        // Email validation
        if (!emailLocal) {
            this.showMessage('emailError', '이메일을 입력해주세요.');
            isValid = false;
        } else if (!emailDomain) {
            this.showMessage('emailError', '이메일 도메인을 선택해주세요.');
            isValid = false;
        } else {
            const domain = emailDomain === 'direct' ? customDomain : emailDomain;
            if (!domain || !this.validateEmail(emailLocal, domain)) {
                this.showMessage('emailError', '올바른 이메일 주소를 입력해주세요.');
                isValid = false;
            }
        }
        
        // Phone validation
        if (!phone) {
            this.showMessage('phoneError', '휴대폰 번호를 입력해주세요.');
            isValid = false;
        } else if (!this.validatePhone(phone)) {
            this.showMessage('phoneError', '올바른 휴대폰 번호를 입력해주세요.');
            isValid = false;
        } else if (!this.isPhoneVerified) {
            this.showMessage('phoneError', '휴대폰 인증을 완료해주세요.');
            isValid = false;
        }
        
        if (isValid) {
            // Form is valid, show success message
            alert('회원가입이 완료되었습니다!');
            // In a real application, you would submit the form data to the server here
            console.log('Form submitted successfully');
        }
    }

    showMessage(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
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
        const errorElements = document.querySelectorAll('.error-message, .success-message');
        errorElements.forEach(element => {
            element.style.display = 'none';
            element.textContent = '';
        });
    }
}

// Initialize the form when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SignupForm();
});

// Add input formatting for phone number
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 3 && value.length <= 7) {
            value = value.replace(/(\d{3})(\d+)/, '$1-$2');
        } else if (value.length >= 8) {
            value = value.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
        }
        
        e.target.value = value;
    });
});
