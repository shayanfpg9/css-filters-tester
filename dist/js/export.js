import { $, notification } from "./functions.js";

export { getstyles };

function getstyles(styles) {
  const doc = $("iframe.export").contentDocument,
    code = doc.querySelector("code>p.write-code"),
    transform = [],
    filter = [];

  styles.forEach((style) => {
    if (style.value != style.default) {
      if (style.effect == "filter") {
        filter.push(style);
      } else if (style.effect == "transform") {
        transform.push(style);
      }
    }
  });

  code.innerHTML += `<span class="prop">transform</span>: `;

  if (transform.length == 0) {
    code.innerHTML += "<span class='value str'>none</span>";
  } else {
    transform.forEach(({ name, value }) => {
      code.innerHTML += `<span class="value function">${name}(<span class="value num">${value}</span>)</span> `;
    });
  }

  code.innerHTML += ";<br><br>";

  code.innerHTML += `<span class="prop">filter</span>: `;

  if (filter.length == 0) {
    code.innerHTML += "<span class='value str'>none</span>";
  } else {
    filter.forEach(({ name, value }) => {
      code.innerHTML += `<span class="value function">${name}(<span class="value num">${value}</span>)</span> `;
    });
  }

  code.innerHTML += ";";

  doc.querySelector(".btn.back").addEventListener("click", () => {
    $(".card").removeChild($("iframe.export"));
    $(".card").removeAttribute("export");
  });

  doc.querySelector(".btn.copy").addEventListener("click", () => {
    navigator.clipboard.writeText(`#preview{\n${code.innerText}\n}`);
    notification("the text was copied");
  });

  doc.querySelector(".btn.download").addEventListener("click", () => {
    const A = document.createElement("a"),
      file = new Blob([`#preview{${code.innerText}}`], {
        type: "text/css",
      });

    A.href = URL.createObjectURL(file);
    A.download = $("title").innerText;
    A.click();
    URL.revokeObjectURL(file);

    notification("the css file was downloaded");
  });
}
