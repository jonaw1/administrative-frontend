// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toggleProfileForm = () => {
  const disabled = document.getElementById('profileFirstNameInput').disabled;
  if (!disabled) {
    document.getElementById('editProfileForm').submit();
    document.getElementById('profileModal').modal('show');
  }
  document.getElementById('profileFirstNameInput').disabled = !disabled;
  document.getElementById('profileLastNameInput').disabled = !disabled;
  document.getElementById('profileEmailInput').disabled = !disabled;
  const editButton = document.getElementById('editButton');
  editButton.innerHTML = disabled ? 'Speichern' : 'Ändern';
  const requiredStars = document.getElementsByClassName('required-star');
  for (const star of requiredStars) {
    star.hidden = disabled ? false : true;
  }
};

const validateRegister = () => {
  const passwordInput1 = document.getElementById('passwordInput1');
  const passwordInput2 = document.getElementById('passwordInput2');
  const registerForm = document.getElementById('registerForm');
  const password1InvalidFeedback = document.getElementById(
    'password1InvalidFeedback'
  );
  const password2InvalidFeedback = document.getElementById(
    'password2InvalidFeedback'
  );

  passwordInput1.addEventListener('keyup', () => {
    const password1 = passwordInput1.value;
    const password2 = passwordInput2.value;
    if (
      password1.length < 8 ||
      !/[A-Z]/.test(password1) ||
      !/[a-z]/.test(password1) ||
      !/\d/.test(password1)
    ) {
      password1InvalidFeedback.style.display = 'inline-block';
      passwordInput1.classList.add('is-invalid');
    } else {
      password1InvalidFeedback.style.display = 'none';
      passwordInput1.classList.remove('is-invalid');
      passwordInput1.classList.add('is-valid');
    }

    if (password1 !== password2) {
      password2InvalidFeedback.style.display = 'inline-block';
      passwordInput2.classList.add('is-invalid');
    } else {
      password2InvalidFeedback.style.display = 'none';
      passwordInput2.classList.remove('is-invalid');
      passwordInput2.classList.add('is-valid');
    }
  });

  passwordInput2.addEventListener('keyup', () => {
    const password1 = passwordInput1.value;
    const password2 = passwordInput2.value;
    if (password1 !== password2) {
      password2InvalidFeedback.style.display = 'inline-block';
      passwordInput2.classList.add('is-invalid');
    } else {
      password2InvalidFeedback.style.display = 'none';
      passwordInput2.classList.remove('is-invalid');
      passwordInput2.classList.add('is-valid');
    }
  });

  registerForm.addEventListener('submit', (event) => {
    const invalidFeedbacks = document.getElementsByClassName('invalid-feedb');
    const isInvalid = Array.from(invalidFeedbacks).some((element) => {
      return element.style.display === 'inline-block';
    });
    if (isInvalid) {
      event.preventDefault();
    }
  });
};

validateRegister();
