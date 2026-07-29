  (function () {
    const pageMap = {
      'index.html':           'home',
      'cause.html':           'missions',
      'impact.html':          'impact',
      'trophies.html':        'trophies',
      'profile.html':         'profile',
      'settings.html':        'profile',
      'subscription.html':    'profile',
      'recruit.html':         'profile',
      'edit-profile.html':    'profile',
      'change-password.html': 'profile',
    };

    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    const activeKey = pageMap[filename];

    if (!activeKey) return;

    document.querySelectorAll('.bottom-nav-item').forEach(item => {
      if (item.getAttribute('data-nav') === activeKey) {
        item.classList.add('active');
      }
    });
  })();

</script>