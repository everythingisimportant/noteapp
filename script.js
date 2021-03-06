window.onload = function () {
  if (localStorage.getItem("myNote")) {
    const notes = document.querySelector("#notes");
    const dataFromLocal = JSON.parse(localStorage.getItem("myNote"));
    dataFromLocal.forEach((data) => {
      notes.innerHTML += `<div class="note"><div class="content">${marked.parse(
        data.note
      )}</div><button id="edit" onclick="editNote(event)">Edit</button><button onclick="deleteNote(event)">Delete</button></div>`;
    });
  }
  let ta = document.getElementById("add_note");
  ta.setAttribute("placeholder", "Write your note here\nHint: you can use Markdown\n## like this is header 2\n- this is list order 1\n- list order 2");
};

const addNote = () => {
  const notes = document.querySelector("#notes");
  let note = document.querySelector("#add_note").value;
  if (note) {
    note = note[0].toUpperCase() + note.substring(1);
    notes.innerHTML =
      `<div class="note"><div class="content">${marked.parse(
        note
      )}</div><button id="edit" onclick="editNote(event)">Edit</button><button onclick="deleteNote(event)">Delete</button></div>` +
      notes.innerHTML;
    document.querySelector("#add_note").value = "";
  } else alert("Input your note first!");
};

const editNote = (e) => {
  let currentNote =
    e.target.parentNode.querySelector("div.content").textContent;
  if (!e.target.parentNode.getElementsByTagName("textarea")[0]) {
    let textarea = document.createElement("textarea");
    textarea.value = currentNote;
    e.target.parentNode.prepend(textarea);
  }
  if (!e.target.parentElement.querySelector("#saveEdit")) {
    let btnSave = document.createElement("button");
    btnSave.textContent = "Save";
    btnSave.id = "saveEdit";
    btnSave.addEventListener("click", (e) => saveEdit(e));
    e.target.parentNode.append(btnSave);
  }
  e.target.parentNode.querySelector("div.content").classList.toggle("hide");
  e.target.classList.toggle("hide");
};

const deleteNote = (e) => {
  e.target.parentElement.remove();
};

const deleteAllNote = () => {
  const confirmation = prompt("Are you sure? Please type yes or no.");
  if (confirmation.toLowerCase() === "yes") {
    document.querySelector("#notes").innerHTML = "";
    alert("Deleted!");
    localStorage.clear();
  } else if (
    confirmation.toLowerCase() !== "yes" &&
    confirmation.toLowerCase() !== "no"
  )
    alert("Only yes or no please!");
};

const addLocalStorage = () => {
  const notes = document.querySelectorAll("div.content");
  let data = [];
  try {
    notes.forEach((note) => data.push({ note: note.innerHTML }));
    localStorage.clear();
    localStorage.setItem("myNote", JSON.stringify(data));
    alert(`Saved!`);
  } catch (e) {
    console.log(e);
    alert("Something's wrong! Please try again later!");
  }
};

const saveEdit = (e) => {
  let textarea = e.target.parentElement.querySelector("textarea");
  let content = textarea.value;
  let div = e.target.parentElement.querySelector("div.content");
  div.innerHTML = marked.parse(content);
  div.classList.toggle("hide");
  textarea.remove();
  e.target.parentElement.querySelector("#edit").classList.toggle("hide");
  document.getElementById("saveEdit").remove();
};

function getScrollHeight(elm) {
  var savedValue = elm.value;
  elm.value = "";
  elm._baseScrollHeight = elm.scrollHeight;
  elm.value = savedValue;
}

function onExpandableTextareaInput({ target: elm }) {
  // make sure the input event originated from a textarea and it's desired to be auto-expandable
  if (!elm.classList.contains("autoExpand") || !elm.nodeName == "TEXTAREA")
    return;
  var minRows = elm.getAttribute("data-min-rows") | 0,
    rows;
  !elm._baseScrollHeight && getScrollHeight(elm);

  elm.rows = minRows;
  rows = Math.ceil((elm.scrollHeight - elm._baseScrollHeight) / 16);
  elm.rows = minRows + rows;
}

// global delegated event listener
document.addEventListener("input", onExpandableTextareaInput);
