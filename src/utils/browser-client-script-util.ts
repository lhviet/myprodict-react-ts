export const loadScript = (src: string) => new Promise(function (resolve, reject) {
  let s;
  s = document.createElement('script');
  s.src = src;
  s.onload = resolve;
  s.onerror = reject;
  document.head.appendChild(s);
});

export const scrollBodyTop = () => window && window.document.getElementsByTagName('body')[0].scrollIntoView();
