const Links = JSON.parse(localStorage.getItem("link") || "[]");
let inputUrl = document.getElementById("inputUrl");
let shortBtn = document.getElementById("shortBtn");
let slug = document.getElementById("slug");
let form = document.querySelector("form");

let linkContainer = document.querySelector(".links-container");
const spinner =
  '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24"><use href="#icon.spinner"></use></svg>';

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputUrl.value) {
    FetchData();
  }else{

  }
});

function displayLinks() {
  document.startViewTransition(() => {
    document.querySelectorAll(".links-wrapper").forEach((li) => li.remove());
    let reversedLinks = [...Links].reverse();
    reversedLinks.forEach((item, id) => {
      let newLink = `<div class="links-wrapper">
          <div class="original-link">${item.long}</div>
          <a href="${item.link}" class="shorten-link">${item.link}</a>
          <button onclick="copyLink(this,'${item.link}')" class="copy-btn">Copy</button>
        </div>`;
      linkContainer.insertAdjacentHTML("beforeend", newLink);
    });
  });
}

displayLinks();
function addLinks(link, long) {
  let newLink = { link, long };
  Links.push(newLink);
  localStorage.setItem("link", JSON.stringify(Links));
  displayLinks();
}

function copyLink(elem, link) {
  navigator.clipboard.writeText(link);
  elem.innerHTML = "Copied!";
  setTimeout(() => {
    elem.innerHTML = "Copy";
  }, 5000);
}

function FetchData() {
  if (!inputUrl.value) return;
  shortBtn.innerHTML = `${spinner}`;
  let mainUrl = inputUrl.value;
  let newUrl = slug.value.trim();
  let API = `https://csclub.uwaterloo.ca/~phthakka/1pt/addURL.php?url=${mainUrl}&cu=${newUrl}`;

  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 201) {
        let url = "https://1pt.co/" + data.short;
        addLinks(url, mainUrl);
        inputUrl.value = "";
        slug.value = ""
        shortBtn.innerHTML = "Shorten It";
      } else {
        alert("Something went wrong ):");
      }
    });
}

