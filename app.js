const STORAGE_KEY = "my-first-app.todos";

const form = document.getElementById("new-form");
const input = document.getElementById("new-input");
const list = document.getElementById("list");
const empty = document.getElementById("empty");
const count = document.getElementById("count");
const clearDone = document.getElementById("clear-done");
const filterButtons = document.querySelectorAll("[data-filter]");

let todos = load();
let filter = "all";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // 保存できない環境（プライベートモードなど）でも動作は続ける
  }
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function render() {
  const visible = todos.filter((t) =>
    filter === "active" ? !t.done : filter === "done" ? t.done : true
  );

  list.replaceChildren(...visible.map(renderItem));

  const remaining = todos.filter((t) => !t.done).length;
  count.textContent = `${remaining} 件残り`;
  empty.hidden = visible.length > 0;
  clearDone.hidden = !todos.some((t) => t.done);

  filterButtons.forEach((b) => b.classList.toggle("active", b.dataset.filter === filter));
}

function renderItem(todo) {
  const li = document.createElement("li");
  li.className = "item" + (todo.done ? " done" : "");

  const check = document.createElement("input");
  check.type = "checkbox";
  check.checked = todo.done;
  check.setAttribute("aria-label", "完了にする");
  check.addEventListener("change", () => {
    todo.done = check.checked;
    save();
    render();
  });

  const text = document.createElement("span");
  text.className = "text";
  text.textContent = todo.text;
  text.title = "ダブルクリックで編集";
  text.addEventListener("dblclick", () => startEdit(li, text, todo));

  const del = document.createElement("button");
  del.type = "button";
  del.className = "delete";
  del.textContent = "×";
  del.setAttribute("aria-label", "削除");
  del.addEventListener("click", () => {
    todos = todos.filter((t) => t.id !== todo.id);
    save();
    render();
  });

  li.append(check, text, del);
  return li;
}

function startEdit(li, textEl, todo) {
  const edit = document.createElement("input");
  edit.className = "edit";
  edit.value = todo.text;
  edit.maxLength = 200;
  textEl.replaceWith(edit);
  edit.focus();
  edit.select();

  let finished = false;
  const finish = (commit) => {
    if (finished) return;
    finished = true;
    if (commit) {
      const value = edit.value.trim();
      if (value) todo.text = value;
      else todos = todos.filter((t) => t.id !== todo.id); // 空にしたら削除
      save();
    }
    render();
  };

  edit.addEventListener("keydown", (e) => {
    if (e.isComposing) return; // 日本語変換中の Enter は無視
    if (e.key === "Enter") finish(true);
    if (e.key === "Escape") finish(false);
  });
  edit.addEventListener("blur", () => finish(true));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  todos.push({ id: newId(), text: value, done: false });
  input.value = "";
  save();
  render();
});

filterButtons.forEach((b) =>
  b.addEventListener("click", () => {
    filter = b.dataset.filter;
    render();
  })
);

clearDone.addEventListener("click", () => {
  todos = todos.filter((t) => !t.done);
  save();
  render();
});

render();
