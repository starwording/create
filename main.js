const storageKey = 'theme-preference';
const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.textContent = isDark ? 'Light mode' : 'Dark mode';
  }
};

const getPreferredTheme = () => {
  const stored = localStorage.getItem(storageKey);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const setTheme = (theme) => {
  localStorage.setItem(storageKey, theme);
  applyTheme(theme);
};

applyTheme(getPreferredTheme());

if (toggle) {
  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  if (localStorage.getItem(storageKey)) {
    return;
  }
  applyTheme(event.matches ? 'dark' : 'light');
});

const shareRows = document.querySelectorAll('.share-row');
const pageTitle = document.querySelector('h1')?.textContent?.trim() || document.title;
const pageUrl = window.location.href;

const setShareHint = (row, message) => {
  const hint = row.querySelector('.share-row__hint');
  if (hint) {
    hint.textContent = message;
  }
};

shareRows.forEach((row) => {
  const xLink = row.querySelector('[data-share="x"]');
  const fbLink = row.querySelector('[data-share="facebook"]');
  const kakaoLink = row.querySelector('[data-share="kakaostory"]');
  const nativeBtn = row.querySelector('[data-share="native"]');
  const copyBtn = row.querySelector('[data-share="copy"]');

  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(pageTitle);

  if (xLink) {
    xLink.href = `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  }
  if (fbLink) {
    fbLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  }
  if (kakaoLink) {
    kakaoLink.href = `https://story.kakao.com/share?url=${encodedUrl}`;
  }

  if (nativeBtn) {
    if (navigator.share) {
      nativeBtn.addEventListener('click', async () => {
        try {
          await navigator.share({ title: pageTitle, url: pageUrl });
          setShareHint(row, '공유가 완료되었습니다.');
        } catch (error) {
          setShareHint(row, '공유가 취소되었습니다.');
        }
      });
    } else {
      nativeBtn.setAttribute('disabled', 'true');
      nativeBtn.textContent = 'Share not supported';
    }
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pageUrl);
        setShareHint(row, '링크가 복사되었습니다.');
      } catch (error) {
        setShareHint(row, '복사에 실패했습니다.');
      }
    });
  }
});
