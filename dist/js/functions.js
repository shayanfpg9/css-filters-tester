export { $, GetImage, notification };

function GetImage(input, end = () => {}) {
  const file = input.files[0],
    reader = new FileReader();

  let type = file.type,
    preview = new Image();

  if (type.search("image") == -1)
    throw new Error("you only can upload image files");

  reader.addEventListener("load", () => {
    preview.src = reader.result;

    preview.onload = () => end(preview);
  });

  if (file) {
    reader.readAsDataURL(file);
  }
}

const $ = (
  qr,
  filter = (result) => {
    return result;
  }
) => {
  const select = document.querySelectorAll(qr),
    result =
      select.length > 0 ? (select.length == 1 ? select[0] : select) : undefined;

  if (typeof filter == "function") return filter(result);
};

function notification(msg) {
  const notif = document.createElement("div");
  notif.classList.add("notification");
  notif.innerText = msg;

  $(".card").appendChild(notif);

  setTimeout(() => {
      $(".card").removeChild(notif);
  }, 3500);
}
