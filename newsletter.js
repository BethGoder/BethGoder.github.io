document.getElementById('subscribe-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('newsletter-email').value;

  const params = new URLSearchParams({
    'fields[email]': email,
  });

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
      document.getElementById('newsletter-form-form').classList.add('hidden');
      document.getElementById('newsletter-form-error').classList.remove('hidden');
    }
  } catch (err) {
    console.error(err);
    document.getElementById('newsletter-form-form').classList.add('hidden');
    document.getElementById('newsletter-form-error').classList.remove('hidden');
  }
});
