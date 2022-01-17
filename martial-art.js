let c = document.getElementById("my-canvas");
let ctx = c.getContext("2d");
let actions = ["idle", "kick", "punch", "backward", "block", "forward"];
let currentX = 0;

let loadImage = (src, callback) => {
  let img = document.createElement("img");
  img.onload = () => callback(img);
  img.src = src;
};

let imagePath = (frameNumber, animation) => {
  return "/images/" + animation + "/" + frameNumber + ".png";
};

let frames = {
  idle: [1, 2, 3, 4, 5, 6, 7, 8],
  kick: [1, 2, 3, 4, 5, 6, 7],
  punch: [1, 2, 3, 4, 5, 6, 7],
  backward: [1, 2, 3, 4, 5, 6],
  block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  forward: [1, 2, 3, 4, 5, 6],
};

let loadImages = (callback) => {
  let images = {
    idle: [],
    kick: [],
    punch: [],
    backward: [],
    block: [],
    forward: [],
  };
  let imagesToLoad = 0;
  actions.forEach((animation) => {
    let animationFrames = frames[animation];
    imagesToLoad = imagesToLoad + animationFrames.length;
    animationFrames.forEach((frameNumber) => {
      let path = imagePath(frameNumber, animation);

      loadImage(path, (image) => {
        images[animation][frameNumber - 1] = image;
        imagesToLoad = imagesToLoad - 1;

        if (imagesToLoad === 0) {
          callback(images);
        }
      });
    });
  });
};

let animate = (ctx, images, animation, callback) => {
  images[animation].forEach((image, index) => {
    setTimeout(() => {
      ctx.clearRect(0, 0, 1500, 800);
      ctx.drawImage(image, currentX, 0, 800, 800);
    }, index * 100);
  });
  setTimeout(callback, images[animation].length * 100);
};

loadImages((images) => {
  let queuedAnimations = [];
  let aux = () => {
    let selectedAnimation;
    if (queuedAnimations.length === 0) {
      selectedAnimation = "idle";
    } else {
      selectedAnimation = queuedAnimations.shift();
    }
    animate(ctx, images, selectedAnimation, aux);
  };
  aux();
  document.getElementById("kick").onclick = () => {
    queuedAnimations.push("kick");
  };
  document.getElementById("punch").onclick = () => {
    queuedAnimations.push("punch");
  };
  document.getElementById("backward").onclick = () => {
    currentX = currentX > 0 ? currentX - 50 : currentX;
    queuedAnimations.push("backward");
  };
  document.getElementById("forward").onclick = () => {
    currentX = currentX < 1450 ? currentX + 50 : currentX;
    queuedAnimations.push("forward");
  };
  document.getElementById("block").onclick = () => {
    queuedAnimations.push("block");
  };

  document.addEventListener("keyup", (event) => {
    const key = event.key;
    if (key === "ArrowDown") {
      queuedAnimations.push("kick");
    } else if (key === "ArrowUp") {
      queuedAnimations.push("punch");
    } else if (key === "ArrowRight") {
      currentX = currentX < 1450 ? currentX + 50 : currentX;
      queuedAnimations.push("forward");
    } else if (key === "ArrowLeft") {
      currentX = currentX > 0 ? currentX - 50 : currentX;
      queuedAnimations.push("backward");
    } else if (key === " ") {
      queuedAnimations.push("block");
    }
  });
});

// TODO:
// move upon
