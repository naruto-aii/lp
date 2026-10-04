(function () {
  "use strict";

  var PLANS = {
    month: {
      name: "月額",
      button: "月額ではじめる",
      note: "いつでも解約できます。毎月580円です。",
      live: "月額を選びました。毎月580円。ボタンは、月額ではじめる、です。",
      modal: "請求は毎月580円です。割引はありません。",
      lines: [
        "月額を選んでいます。",
        "毎月580円で、割引はありません。リリースから1ヶ月の初回割引は、半年と年額だけが対象です。",
        "0円の期間はありません。初回から580円です。",
        "月ごとに続けたいとき、短く試したいときは、こちらです。",
        "いつでも解約できます。"
      ]
    },
    half: {
      name: "半年",
      button: "半年ではじめる",
      note: "いつでも解約できます。2回目以降は2,900円です。",
      live: "半年を選びました。初回2,320円。2回目以降は2,900円。ボタンは、半年ではじめる、です。",
      modal: "初回の請求は2,320円です。2回目以降は2,900円です。",
      lines: [
        "半年を選んでいます。",
        "初回は2,320円（580円×4）です。2ヶ月分は料金に入っていません。",
        "2回目以降は2,900円（580円×5、1ヶ月分は料金に入っていません）。",
        "0円の期間はなく、初回から2,320円の請求です。",
        "1ヶ月あたりにならすと約387円（2,320円÷6ヶ月）で、この初回だけは3つの中でいちばん低くなります。次の更新は約483円（2,900円÷6ヶ月）です。",
        "いつでも解約できます。"
      ]
    },
    year: {
      name: "年額",
      button: "年額ではじめる",
      note: "いつでも解約できます。2回目以降は5,800円です。",
      live: "年額を選びました。初回5,220円。2回目以降は5,800円。ボタンは、年額ではじめる、です。",
      modal: "初回の請求は5,220円です。2回目以降は5,800円です。",
      lines: [
        "年額を選んでいます。",
        "初回は5,220円（580円×9）です。3ヶ月分は料金に入っていません。",
        "2回目以降は5,800円（580円×10、2ヶ月分は料金に入っていません）。",
        "0円の期間はなく、初回から5,220円の請求です。",
        "1ヶ月あたりは435円（5,220円÷12ヶ月）です。更新までの長さは、3つの中でいちばん長くなります。次の更新は約483円（5,800円÷12ヶ月）です。",
        "いつでも解約できます。"
      ]
    }
  };

  var order = ["month", "half", "year"];
  var current = null;
  var phone = document.getElementById("phone");
  var group = document.getElementById("plan-group");
  var detail = document.getElementById("plan-detail");
  var go = document.getElementById("go");
  var note = document.getElementById("dock-note");
  var live = document.getElementById("live");
  var modal = document.getElementById("modal");
  var modalChoice = document.getElementById("modal-choice");
  var modalPrice = document.getElementById("modal-price");
  var modalClose = document.getElementById("modal-close");
  var scroll = document.getElementById("scroll");
  var topbar = document.querySelector(".topbar");
  var dock = document.querySelector(".dock");
  var lastFocus = null;

  var cards = Array.prototype.slice.call(document.querySelectorAll(".plan"));
  var dockCols = {
    month: document.querySelector('[data-dock="month"]'),
    half: document.querySelector('[data-dock="half"]'),
    year: document.querySelector('[data-dock="year"]')
  };

  function fillLines(lines) {
    detail.replaceChildren();
    lines.forEach(function (line) {
      var p = document.createElement("p");
      p.textContent = line;
      detail.appendChild(p);
    });
  }

  function select(id) {
    var plan = PLANS[id];
    if (!plan) return;
    current = id;
    cards.forEach(function (card) {
      var on = card.getAttribute("data-plan") === id;
      card.setAttribute("aria-checked", on ? "true" : "false");
      card.classList.toggle("is-on", on);
      card.tabIndex = on ? 0 : -1;
    });
    Object.keys(dockCols).forEach(function (key) {
      dockCols[key].classList.toggle("is-on", key === id);
    });
    go.disabled = false;
    go.textContent = plan.button;
    note.textContent = plan.note;
    detail.classList.remove("is-empty");
    fillLines(plan.lines);
    live.textContent = plan.live;
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      select(card.getAttribute("data-plan"));
    });
  });

  group.addEventListener("keydown", function (event) {
    var dir = 0;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") dir = 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") dir = -1;
    if (!dir) return;
    event.preventDefault();
    var focused =
      document.activeElement && document.activeElement.getAttribute("data-plan");
    var base = current || focused || "month";
    var index = order.indexOf(base);
    if (index < 0) index = 0;
    var next = order[(index + dir + order.length) % order.length];
    select(next);
    var button = group.querySelector('[data-plan="' + next + '"]');
    if (button) button.focus();
  });

  function setBehindInert(on) {
    scroll.inert = on;
    topbar.inert = on;
    dock.inert = on;
  }

  function openModal() {
    if (!current || go.disabled) return;
    var plan = PLANS[current];
    modalChoice.textContent = "選んだのは" + plan.name + "プランです。";
    modalPrice.textContent = plan.modal;
    lastFocus = document.activeElement;
    modal.hidden = false;
    phone.classList.add("is-modal");
    setBehindInert(true);
    modalClose.focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    phone.classList.remove("is-modal");
    setBehindInert(false);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  go.addEventListener("click", openModal);
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal();
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-jump]"), function (link) {
    link.addEventListener("click", function (event) {
      var id = (link.getAttribute("href") || "").slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  detail.classList.add("is-empty");
  fillLines([
    "まだ選んでいません。月額、半年、年額のどれかを選ぶと、請求の内訳がここに出ます。",
    "下のボタンは、選んだプランの名前に変わります。選ぶまで押せません。"
  ]);
})();
