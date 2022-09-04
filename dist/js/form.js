import { getstyles } from "./export.js";
import { filters, setPage, styles } from "./filters.js";
import { $, GetImage } from "./functions.js";

const card = $(".card"),
  input = $("#upload"),
  random = $("form > .random");

input.addEventListener("input", () => {
  try {
    GetImage(input, (image) => {
      ImageAdded(image);
    });
  } catch (error) {
    $("#upload~label").innerHTML = "please upload an image";
    input.setCustomValidity(error);
  }
});

random.addEventListener("click", () => {
  random.disabled = true;

  getRandIamge();
});

function getRandIamge() {
  const image = new Image();

  image.src = `https://picsum.photos/${Math.floor(
    (Math.random() + 0.5) * (0.9 * innerWidth)
  )}`;

  random.style.cursor = "wait";
  random.innerHTML = "loading...";

  image.onload = () => {
    if (!card.hasAttribute("filter")) {
      ImageAdded(image);
    }
  };

  image.onerror = () => {
    if (!card.hasAttribute("filter")) {
      random.style.cursor = "not-allowed";
      random.innerHTML = "loading...";
      getRandIamge();
    }
  };
}

function ImageAdded(image) {
  const element = document.createElement("div");

  //clear
  card.innerHTML = "";
  card.setAttribute("filter", "");

  //image
  element.innerHTML = `
      <div id="preview" style="background-image:url(${image.src})"></div>
    `;
  element.classList.add("image");

  card.appendChild(element);

  //real size
  const realSize = document.createElement("span");
  realSize.classList.add("realsize");
  realSize.innerHTML = `${image.width}x${image.height}`;

  element.appendChild(realSize);

  //iframe
  const filterBox = document.createElement("iframe");
  filterBox.classList.add("filter-box");
  filterBox.src = "./dist/html/filter.htm";
  card.appendChild(filterBox);

  filterBox.onload = () => {
    setPage($("#preview"));
  };

  //move image
  const pos = { x: 0, y: 0 };

  let click = false,
    sum = { x: 0, y: 0 };

  element.onmousedown = ({ clientX, clientY }) => {
    // debugger;
    pos.x = clientX - sum.x;
    pos.y = clientY - sum.y;

    click = true;

    element.style.cursor = "grabbing";
  };

  const endpoint = () => {
    click = false;
    element.style.cursor = "grab";
  };

  element.onmouseup = () => {
    endpoint();
  };

  element.onmouseleave = () => {
    endpoint();
  };

  element.addEventListener("mousemove", ({ clientX, clientY }) => {
    if (click) {
      element.style.cursor = "grabbing";

      const dis = {
        x: pos.x - clientX + sum.x,
        y: pos.y - clientY + sum.y,
      };

      sum.x = sum.x - dis.x;
      sum.y = sum.y - dis.y;

      filters({
        name: "translateX",
        value: sum.x + "px",
      });

      filters({
        name: "translateY",
        value: sum.y + "px",
      });
    } else {
      element.style.cursor = "grab";
    }
  });

  //make buttons

  const btnbar = document.createElement("div");
  btnbar.classList.add("btn-bar");
  element.appendChild(btnbar);

  const btnName = [
    "refresh",
    "filter",
    "transform",
    "pointer",
    "restore",
    "fullscreen",
    "table",
    "export",
  ];

  btnName.forEach((name, i) => {
    const btn = document.createElement("button");
    btn.classList.add("btn", name);
    btn.setAttribute("tooltip", name);

    btnbar.appendChild(btn);
  });

  //make button listeners
  $(".refresh").addEventListener("click", () => {
    location.reload();
  });

  $(".pointer").addEventListener("click", () => {
    filters({
      name: "translateX",
      value: "0px",
    });

    filters({
      name: "translateY",
      value: "0px",
    });
  });

  $(".fullscreen").setAttribute("tooltip", "go to fullscreen");
  $(".fullscreen").addEventListener("click", function () {
    if (!this.classList.contains("exit")) {
      if (card.requestFullscreen) {
        card.requestFullscreen();
      } else if (card.webkitRequestFullscreen) {
        card.webkitRequestFullscreen();
      } else if (card.msRequestFullscreen) {
        card.msRequestFullscreen();
      }

      this.classList.add("exit");
      this.setAttribute("tooltip", "exit fullscreen");
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }

      this.classList.remove("exit");
      this.setAttribute("tooltip", "go to fullscreen");
    }
  });

  $(".btn.table").classList.add("close");

  $(".table").setAttribute("tooltip", "close edit table");
  $(".table").addEventListener("click", function () {
    if (this.classList.contains("close")) {
      this.classList.replace("close", "open");
      filterBox.classList.add("close");
      element.classList.add("full");
      this.setAttribute("tooltip", "open edit table");
    } else if (this.classList.contains("open")) {
      this.classList.replace("open", "close");
      element.classList.remove("full");
      filterBox.classList.remove("close");
      this.setAttribute("tooltip", "close edit table");
    }
  });

  $(".export").addEventListener("click", () => {
    const exportCode = document.createElement("iframe");
    exportCode.classList.add("export");
    exportCode.src = "./dist/html/export.htm";

    exportCode.style.opacity = 0;

    card.setAttribute("export", "");

    setTimeout(() => {
      card.appendChild(exportCode);
    }, 500);

    exportCode.onload = () => {
      getstyles(styles);
    };
  });
}

if (!navigator.onLine) {
  random.disabled = true;
  random.innerHTML = "you're offline";
}

addEventListener("offline", () => {
  random.disabled = true;
  random.innerHTML = "you're offline";
});

addEventListener("online", () => {
  random.disabled = false;
  random.innerHTML = "import random image";
});
