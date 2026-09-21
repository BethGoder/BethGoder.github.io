const subscribeForm = document.getElementById('subscribe-form');
const validationMessage = document.getElementById('newsletter-form-validation');
const recaptchaContainer = document.getElementById('newsletter-recaptcha');
let recaptchaWidgetId = null;
let recaptchaLoading = false;

const renderNewsletterRecaptcha = () => {
  recaptchaLoading = false;
  validationMessage.textContent = '';

  if (recaptchaWidgetId !== null) return;

  recaptchaWidgetId = window.grecaptcha.render('newsletter-recaptcha-widget', {
    sitekey: '6Lf1KHQUAAAAAFNKEX1hdSWCS3mRMv4FlFaNslaD',
    callback: () => subscribeForm.requestSubmit(),
    'expired-callback': () => {
      validationMessage.textContent = 'The security check expired. Please try again.';
    },
    'error-callback': () => {
      validationMessage.textContent = 'The security check failed to load. Please try again.';
    },
  });
};

const showNewsletterRecaptcha = () => {
  recaptchaContainer.classList.remove('newsletter-recaptcha-hidden');

  if (recaptchaWidgetId !== null) {
    validationMessage.textContent = 'Please complete the security check.';
    return;
  }

  validationMessage.textContent = 'Loading security check…';

  if (window.grecaptcha?.render) {
    renderNewsletterRecaptcha();
    return;
  }

  if (recaptchaLoading) return;
  recaptchaLoading = true;
  window.onNewsletterRecaptchaReady = renderNewsletterRecaptcha;

  const script = document.createElement('script');
  script.src = 'https://www.google.com/recaptcha/api.js?onload=onNewsletterRecaptchaReady&render=explicit';
  script.async = true;
  script.defer = true;
  script.onerror = () => {
    recaptchaLoading = false;
    validationMessage.textContent = 'The security check failed to load. Please try again.';
  };
  document.head.appendChild(script);
};

subscribeForm.addEventListener('submit', async e => {
  e.preventDefault();
  validationMessage.textContent = '';

  const formData = new FormData(subscribeForm);
  if (!formData.get('g-recaptcha-response')) {
    showNewsletterRecaptcha();
    return;
  }

  const params = new URLSearchParams(formData);

  try {
    const res = await fetch('https://assets.mailerlite.com/jsonp/2320086/forms/186643985554474980/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await res.json();
    if (data.success) {
      document.getElementById('newsletter-form-form').classList.add('hidden');
      document.getElementById('newsletter-form-message').classList.remove('hidden');
    } else {
      console.error(data);
      validationMessage.textContent = 'Signup failed. Please try again.';
      window.grecaptcha?.reset(recaptchaWidgetId);
    }
  } catch (err) {
    console.error(err);
    validationMessage.textContent = 'Signup failed. Please try again.';
    window.grecaptcha?.reset(recaptchaWidgetId);
  }
});
