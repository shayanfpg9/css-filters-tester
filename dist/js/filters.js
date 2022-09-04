import { $, notification } from "./functions.js";
export { setPage, filters, styles };

let doc = document,
  img,
  styleList = ["", ""],
  styles = [];

function filters(value) {
  let data = {};

  if (value instanceof HTMLInputElement) {
    data.name = value.id;
    data.value = value.value + value.getAttribute("suffix");
  } else {
    const range = doc.querySelector(`#${value.name}`),
      span = doc.querySelector(`label[for = ${value.name}] span`);
    range.value = +value.value.replace(range.getAttribute("suffix"), "");
    span.innerText = value.value;
    data = value;
  }

  styles = styles.filter((filter) => {
    if (filter.name != data.name) return filter;
    else {
      filter.value = data.value;
      return filter;
    }
  });

  styleList = ["", ""];

  styles.forEach((filter) => {
    if (filter.effect == "filter") {
      styleList[0] += ` ${filter.name}(${filter.value})`;
    } else if (filter.effect == "transform") {
      styleList[1] += ` ${filter.name}(${filter.value})`;
    }
  });

  styleList.forEach((val, i) => {
    if (i == 0) {
      img.style.filter = val;
    } else if (i == 1) {
      img.style.transform = val;
    }
  });

  return data.value;
}

function setPage(image) {
  img = image;
  getFilters((fils) => {
    const iframe = $("iframe.filter-box");
    doc = iframe.contentDocument;

    const form = doc.querySelector("form"),
      ul = doc.querySelector("ul");

    form.addEventListener("submit", (e) => e.preventDefault());

    ul.classList.add("show-filters");

    $(".filter").onclick = () => {
      ul.classList.remove("show-transforms");
      ul.classList.add("show-filters");

      ul.querySelector("li[effect='filter']").click();
      if(iframe.classList.contains("close")){
        $(".table").click()
      }
    };

    $(".transform").onclick = () => {
      ul.classList.remove("show-filters");
      ul.classList.add("show-transforms");

      ul.querySelector("li[effect='transform']").click();
      if(iframe.classList.contains("close")){
        $(".table").click()
      }
    };

    fils.forEach((filter) => {
      if (filter.multi == undefined) {
        filter.multi = [];
        filter.multi[0] = {
          min: filter.min,
          max: filter.max,
          name: filter.name,
          default: filter.default,
          suffix: filter.suffix,
          step: filter.step,
        };
      }

      const li = document.createElement("li"),
        box = document.createElement("div");
      ul.appendChild(li);
      form.appendChild(box);

      if (filter.multi.length > 1) {
        box.setAttribute("multi", "");
      }

      filter.multi.forEach((multi) => {
        styles.push({
          name: multi.name,
          value: multi.default + multi.suffix,
          effect: filter.effect,
          default: multi.default + multi.suffix,
        });

        const btnDefault = document.createElement("button"),
          range = document.createElement("input"),
          label = document.createElement("label");

        label.setAttribute("for", multi.name);
        range.setAttribute("type", "range");
        range.classList.add("filter");
        btnDefault.classList.add("change-default");
        range.id = multi.name;
        li.innerText = filter.name;

        //set control attributes
        range.setAttribute("suffix", multi.suffix);
        range.setAttribute("min", multi.min);
        range.setAttribute("max", multi.max);
        li.setAttribute("effect", filter.effect);
        range.setAttribute(
          "step",
          typeof multi.step != "undefined" ? multi.step : 1
        );
        range.value = filter.default;

        label.innerHTML = `${multi.name} ${filter.effect}: <span>${range.value}${multi.suffix}</span>`;

        label.appendChild(btnDefault);
        box.appendChild(label);
        box.appendChild(range);

        range.addEventListener("input", () => {
          label.querySelector(
            "span"
          ).innerText = `${range.value}${multi.suffix}`;
          filters(range);
        });

        li.addEventListener("click", () => {
          form.scrollTo({
            top: box.offsetTop - form.clientHeight,
            left: 0,
            behavior: "smooth",
          });
        });

        btnDefault.addEventListener("click", () => {
          filters({
            name: multi.name,
            value: multi.default + multi.suffix,
          });
          notification(`${multi.name} value be default`);
        });
      });
    });
  });

  $(".restore").addEventListener("click", () => {
    doc.querySelectorAll(".change-default").forEach((btn) => {
      btn.click();
    });
  });
}

function getFilters(end = () => {}) {
  fetch("./dist/filters.json")
    .then((req) => req.json())
    .then(({ filters }) => {
      end(filters);
    });
}
