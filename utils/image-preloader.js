export function preloadImages(arr) {
  const images = [];
  const successCallback = function() {};
  let unloaded = arr.length;

  function imageLoadPost() {
    unloaded--;
    if (unloaded === 0) {
      successCallback(images);
    }
  }

  for (let i = 0, len = arr.length; i < len; i++) {
    images[i] = new Image();
    images[i].src = arr[i];
    images[i].onload = function() {
      imageLoadPost();
    };
    images[i].onerror = function() {
      imageLoadPost();
    };
  }

  return {
    done(func) {
      successCallback = func;
    }
  };
}
