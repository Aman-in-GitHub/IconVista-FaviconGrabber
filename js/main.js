const download = document.querySelector('.download');
const grab = document.querySelector('.grab');
let loaded = false;
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
});

function grabFavicon() {
  loaded = false;

  const urlInput = document.getElementById('urlInput');
  const faviconImg = document.getElementById('faviconImg');
  const url = urlInput.value.trim();

  if (!url) {
    alert('Please enter a valid website URL.');
    return;
  }

  const normalizedURL =
    url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;

  async function favIcon(normalizedURL) {
    try {
      const location = await fetchFavicon(normalizedURL);
      faviconImg.src = location;
      faviconImg.style.display = 'block';
      loaded = true;
    } catch (error) {
      console.error('Error fetching favicon:', error);
      faviconImg.style.display = 'none';
      alert('An error occurred while fetching the favicon.');
    }
  }

  favIcon(normalizedURL);
}

function fetchFavicon(url) {
  return new Promise((resolve, reject) => {
    const faviconURL = new URL('/favicon.ico', url);

    const img = new Image();

    img.onload = function () {
      resolve(faviconURL.href);
    };

    img.onerror = function () {
      reject(new Error('No favicon found for the provided website.'));
    };

    img.src = faviconURL.href;
  });
}

function downloadFavicon() {
  const faviconImg = document.getElementById('faviconImg');

  if (!faviconImg.src || faviconImg.src === '' || !loaded) {
    alert('No favicon available for download. Please grab the favicon first.');
    return;
  }

  const urlObject = new URL(faviconImg.src);
  const pathname = urlObject.pathname.split('/').pop();
  const name = pathname.split('.')[0];

  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = faviconImg.src;
  link.download = `${name}.ico`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}

download.addEventListener('click', downloadFavicon);
grab.addEventListener('click', grabFavicon);
