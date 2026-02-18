// ─────────────────────────────────────────
// KOHET MANUALE — BAZA: Gostivar / Kërçovë / Tetovë
// Lexuar nga Imsakija 2026 / 1447 H
// E kuqe = Imsak (Syfyri) | E gjelbër = Aksham (Iftari)
// ─────────────────────────────────────────
const BASE_TIMES = [
  { day:1,  label:"19 Shk", syfyr:"04:49", iftar:"17:19" },
  { day:2,  label:"20 Shk", syfyr:"04:48", iftar:"17:21" },
  { day:3,  label:"21 Shk", syfyr:"04:47", iftar:"17:22" },
  { day:4,  label:"22 Shk", syfyr:"04:45", iftar:"17:23" },
  { day:5,  label:"23 Shk", syfyr:"04:44", iftar:"17:24" },
  { day:6,  label:"24 Shk", syfyr:"04:42", iftar:"17:26" },
  { day:7,  label:"25 Shk", syfyr:"04:41", iftar:"17:27" },
  { day:8,  label:"26 Shk", syfyr:"04:39", iftar:"17:28" },
  { day:9,  label:"27 Shk", syfyr:"04:38", iftar:"17:29" },
  { day:10, label:"28 Shk", syfyr:"04:36", iftar:"17:30" },
  { day:11, label:"01 Mar", syfyr:"04:34", iftar:"17:32" },
  { day:12, label:"02 Mar", syfyr:"04:32", iftar:"17:33" },
  { day:13, label:"03 Mar", syfyr:"04:30", iftar:"17:34" },
  { day:14, label:"04 Mar", syfyr:"04:29", iftar:"17:35" },
  { day:15, label:"05 Mar", syfyr:"04:27", iftar:"17:36" },
  { day:16, label:"06 Mar", syfyr:"04:25", iftar:"17:38" },
  { day:17, label:"07 Mar", syfyr:"04:24", iftar:"17:39" },
  { day:18, label:"08 Mar", syfyr:"04:22", iftar:"17:40" },
  { day:19, label:"09 Mar", syfyr:"04:20", iftar:"17:41" },
  { day:20, label:"10 Mar", syfyr:"04:19", iftar:"17:42" },
  { day:21, label:"11 Mar", syfyr:"04:17", iftar:"17:44" },
  { day:22, label:"12 Mar", syfyr:"04:15", iftar:"17:45" },
  { day:23, label:"13 Mar", syfyr:"04:13", iftar:"17:46" },
  { day:24, label:"14 Mar", syfyr:"04:12", iftar:"17:47" },
  { day:25, label:"15 Mar", syfyr:"04:10", iftar:"17:48" },
  { day:26, label:"16 Mar", syfyr:"04:08", iftar:"17:49" },
  { day:27, label:"17 Mar", syfyr:"04:06", iftar:"17:50" },
  { day:28, label:"18 Mar", syfyr:"04:04", iftar:"17:52" },
  { day:29, label:"19 Mar", syfyr:"04:02", iftar:"17:53" },
];

// Datat reale per krahasim
const RAMADAN_DATES = [
  new Date(2026,1,19), new Date(2026,1,20), new Date(2026,1,21),
  new Date(2026,1,22), new Date(2026,1,23), new Date(2026,1,24),
  new Date(2026,1,25), new Date(2026,1,26), new Date(2026,1,27),
  new Date(2026,1,28), new Date(2026,2,1),  new Date(2026,2,2),
  new Date(2026,2,3),  new Date(2026,2,4),  new Date(2026,2,5),
  new Date(2026,2,6),  new Date(2026,2,7),  new Date(2026,2,8),
  new Date(2026,2,9),  new Date(2026,2,10), new Date(2026,2,11),
  new Date(2026,2,12), new Date(2026,2,13), new Date(2026,2,14),
  new Date(2026,2,15), new Date(2026,2,16), new Date(2026,2,17),
  new Date(2026,2,18), new Date(2026,2,19),
];

// ─────────────────────────────────────────
// OFFSET NE MINUTA PER SECILIN QYTET
// 0  = Gostivar, Kërçovë, Tetovë (baza)
// -2 = Shkup, Kumanovë, Prilep
// +3 = Strugë, Dibër, Ohër
// ─────────────────────────────────────────
const CITIES = {
  "Gostivar":  0,
  "Tetovë":    0,
  "Kërçovë":   0,
  "Shkup":    -2,
  "Kumanovë": -3,
  "Prilep":   -3,
  "Strugë":   +3,
  "Dibër":    +3,
  "Ohër":     +3,
};

// ─────────────────────────────────────────
// GJENDJA
// ─────────────────────────────────────────
let currentCity    = "Gostivar";
let calendarData   = [];
let countdownTimer = null;

// ─────────────────────────────────────────
// SHTO MINUTA TE "HH:MM"
// ─────────────────────────────────────────
function addMinutes(hhmm, mins) {
  const parts = hhmm.split(":");
  const h = parseInt(parts[0]);
  const m = parseInt(parts[1]);
  const total = h * 60 + m + mins;
  const newH = Math.floor(((total % 1440) + 1440) % 1440 / 60);
  const newM = ((total % 60) + 60) % 60;
  return String(newH).padStart(2,"0") + ":" + String(newM).padStart(2,"0");
}

// ─────────────────────────────────────────
// NDERTO KALENDARIN PER QYTETIN AKTUAL
// ─────────────────────────────────────────
function buildCalendarData() {
  const offset = CITIES[currentCity] !== undefined ? CITIES[currentCity] : 0;
  calendarData = BASE_TIMES.map(function(t, i) {
    return {
      day:   t.day,
      date:  RAMADAN_DATES[i],
      label: t.label,
      syfyr: addMinutes(t.syfyr, offset),
      iftar: addMinutes(t.iftar, offset),
    };
  });
}

// ─────────────────────────────────────────
// YJET
// ─────────────────────────────────────────
function createStars() {
  const wrap = document.getElementById("stars");
  for (var i = 0; i < 130; i++) {
    var s = document.createElement("div");
    s.className = "star";
    var sz = Math.random() * 2.2 + 0.4;
    s.style.cssText = "width:"+sz+"px;height:"+sz+"px;top:"+(Math.random()*100)+"%;left:"+(Math.random()*100)+"%;animation-delay:"+(Math.random()*5)+"s;animation-duration:"+(2+Math.random()*3)+"s;";
    wrap.appendChild(s);
  }
}

// ─────────────────────────────────────────
// MBUSH BUTONAT E QYTETEVE
// ─────────────────────────────────────────
function setupCityButtons() {
  document.querySelectorAll(".city-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".city-btn").forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      currentCity = btn.dataset.city;
      buildCalendarData();
      renderCalendar();
      updateTodayAndCountdown();
      document.getElementById("today-city").textContent = currentCity;
    });
  });
}

// ─────────────────────────────────────────
// GJEJ DITEN E SOTME
// ─────────────────────────────────────────
function getTodayEntry() {
  var now = new Date();
  for (var i = 0; i < calendarData.length; i++) {
    var e = calendarData[i];
    if (e.date.getFullYear() === now.getFullYear() &&
        e.date.getMonth()    === now.getMonth()    &&
        e.date.getDate()     === now.getDate()) {
      return e;
    }
  }
  return null;
}

// ─────────────────────────────────────────
// "HH:MM" → Date i sotëm
// ─────────────────────────────────────────
function toTodayDate(hhmm) {
  var parts = hhmm.split(":");
  var d = new Date();
  d.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
  return d;
}

// ─────────────────────────────────────────
// FORMATO MS
// ─────────────────────────────────────────
function fmtMs(ms) {
  if (ms <= 0) return "00:00:00";
  var s  = Math.floor(ms / 1000);
  var hh = Math.floor(s / 3600);
  var mm = Math.floor((s % 3600) / 60);
  var ss = s % 60;
  return hh + ":" + String(mm).padStart(2,"0") + ":" + String(ss).padStart(2,"0");
}

function fmtMsShort(ms) {
  if (ms <= 0) return "";
  var s  = Math.floor(ms / 1000);
  var hh = Math.floor(s / 3600);
  var mm = Math.floor((s % 3600) / 60);
  if (hh > 0 && mm > 0) return hh + "h " + mm + "min";
  if (hh > 0) return hh + "h";
  return mm + "min";
}

// ─────────────────────────────────────────
// COUNTDOWN SOT
// ─────────────────────────────────────────
function updateTodayAndCountdown() {
  var entry = getTodayEntry();
  var now   = new Date();

  var dateOpts = { weekday:"long", day:"numeric", month:"long", year:"numeric" };
  document.getElementById("today-date").textContent = now.toLocaleDateString("sq-MK", dateOpts);

  var label = document.getElementById("cd-label");
  var clock = document.getElementById("cd-clock");
  var sub   = document.getElementById("cd-sub");

  if (!entry) {
    // Countdown deri ne diten e pare te Ramazanit
    var firstDay   = calendarData[0];
    var syfyrParts = firstDay.syfyr.split(":");
    var firstImsak = new Date(firstDay.date);
    firstImsak.setHours(parseInt(syfyrParts[0]), parseInt(syfyrParts[1]), 0, 0);
    var msToRamazan = firstImsak - now;

    document.getElementById("today-syfyr").textContent = "--:--";
    document.getElementById("today-iftar").textContent = "--:--";

    if (msToRamazan > 0) {
      label.textContent = "🌙 KOHA DERI NE FILLIM TE RAMAZANIT";
      clock.textContent = fmtMs(msToRamazan);
      clock.style.color = "#f4c942";
      sub.textContent   = "Imsaku i dites se pare: " + firstDay.syfyr + "  •  Iftari: " + firstDay.iftar;
    } else {
      label.textContent = "Ramazani filloi! Ramazan Mubarek! 🎉";
      clock.textContent = "";
      clock.style.color = "#51cf66";
      sub.textContent   = "";
    }
    updateCalendarRemaining();
    return;
  }

  document.getElementById("today-syfyr").textContent = entry.syfyr;
  document.getElementById("today-iftar").textContent = entry.iftar;

  var syfyrT  = toTodayDate(entry.syfyr);
  var iftarT  = toTodayDate(entry.iftar);
  var msIftar = iftarT - now;
  var msSyfyr = syfyrT - now;

  if (msSyfyr > 0) {
    label.textContent = "⏰ KOHA DERI NË IMSAK / SYFYR";
    clock.textContent = fmtMs(msSyfyr);
    clock.style.color = "#ff6b6b";
    sub.textContent   = "Imsaku nis në " + entry.syfyr + "  •  Iftari sot në " + entry.iftar;
  } else if (msIftar > 0) {
    label.textContent = "🌙 KOHA DERI NË AKSHAM / IFTAR";
    clock.textContent = fmtMs(msIftar);
    clock.style.color = "#51cf66";
    sub.textContent   = "Iftari është në " + entry.iftar;
  } else {
    // Pas iftarit — gjej nesërin
    var tom = new Date(now);
    tom.setDate(now.getDate() + 1);
    var tomorrow = null;
    for (var i = 0; i < calendarData.length; i++) {
      var e = calendarData[i];
      if (e.date.getFullYear() === tom.getFullYear() &&
          e.date.getMonth()    === tom.getMonth()    &&
          e.date.getDate()     === tom.getDate()) {
        tomorrow = e; break;
      }
    }
    if (tomorrow) {
      var nextSyfyr = new Date(syfyrT.getTime() + 24*60*60*1000);
      var msNext    = nextSyfyr - now;
      label.textContent = "✨ DERI NË IMSAKUN E NESËRM";
      clock.textContent = fmtMs(msNext);
      clock.style.color = "#ff6b6b";
      sub.textContent   = "Imsak nesër: " + tomorrow.syfyr + "  •  Iftar nesër: " + tomorrow.iftar;
    } else {
      label.textContent = "🌙 Ramazani mbaroi. Bajram Sherif! 🎉";
      clock.textContent = "";
      sub.textContent   = "";
    }
  }

  updateCalendarRemaining();
}

// ─────────────────────────────────────────
// KOHA MBETUR PER TABELE
// ─────────────────────────────────────────
function getRemainingText(entry) {
  var now           = new Date();
  var todayMidnight = new Date(now); todayMidnight.setHours(0,0,0,0);
  var entryMidnight = new Date(entry.date); entryMidnight.setHours(0,0,0,0);

  var isToday  = entryMidnight.getTime() === todayMidnight.getTime();
  var isPast   = entryMidnight < todayMidnight;
  var isFuture = entryMidnight > todayMidnight;

  if (isPast) return { text:"✅ Kaloi", cls:"" };

  if (isToday) {
    var syfyrT  = toTodayDate(entry.syfyr);
    var iftarT  = toTodayDate(entry.iftar);
    var msIftar = iftarT - now;
    var msSyfyr = syfyrT - now;
    if (msSyfyr > 0) return { text:"🌙 Imsak\n" + fmtMsShort(msSyfyr), cls:"active-rem" };
    if (msIftar > 0) return { text:"🌅 Iftar\n" + fmtMsShort(msIftar), cls:"active-rem" };
    return { text:"✅ Kaloi", cls:"" };
  }

  if (isFuture) {
    var diff = Math.round((entryMidnight - todayMidnight) / (86400*1000));
    if (diff === 1) return { text:"Nesër", cls:"" };
    return { text: diff + " ditë", cls:"" };
  }

  return { text:"", cls:"" };
}

// ─────────────────────────────────────────
// PERDITESO KOLONEN MBETUR
// ─────────────────────────────────────────
function updateCalendarRemaining() {
  for (var i = 0; i < calendarData.length; i++) {
    var cell = document.getElementById("rem-" + i);
    if (!cell) continue;
    var r = getRemainingText(calendarData[i]);
    cell.innerHTML = r.text.split("\n").map(function(l){ return "<span class='rem-line'>"+l+"</span>"; }).join("");
    cell.className = "cal-rem" + (r.cls ? " " + r.cls : "");
  }
}

// ─────────────────────────────────────────
// RENDO KALENDARIN
// ─────────────────────────────────────────
function renderCalendar() {
  var list = document.getElementById("cal-list");
  list.innerHTML = "";

  var now           = new Date();
  var todayMidnight = new Date(now); todayMidnight.setHours(0,0,0,0);

  for (var i = 0; i < calendarData.length; i++) {
    var entry        = calendarData[i];
    var entryMidnight = new Date(entry.date); entryMidnight.setHours(0,0,0,0);
    var isToday  = entryMidnight.getTime() === todayMidnight.getTime();
    var isPast   = entryMidnight < todayMidnight;

    var isKadir = (i === 25); // Dita 26 = 16 Mars = Nata e Kadrit (e 27-ta e Ramazanit)
    var row = document.createElement("div");
    row.className = "cal-row" +
      (isToday ? " is-today" : "") +
      (isPast  ? " is-past"  : " is-future") +
      (isKadir ? " is-kadir" : "");

    var r = getRemainingText(entry);
    var remHtml = r.text.split("\n").map(function(l){ return "<span class='rem-line'>"+l+"</span>"; }).join("");

    row.innerHTML =
      "<span class='cal-num'>" + entry.day + "</span>" +
      "<span class='cal-date'>" + entry.label + (isToday ? " ⭐" : "") + (isKadir ? " ✨" : "") + "</span>" +
      "<span class='cal-syfyr'>" + entry.syfyr + "</span>" +
      "<span class='cal-iftar'>" + entry.iftar + "</span>" +
      "<span class='cal-rem " + r.cls + "' id='rem-" + i + "'>" + remHtml + "</span>";

    list.appendChild(row);
  }
}

// ─────────────────────────────────────────
// NISJA
// ─────────────────────────────────────────
createStars();
setupCityButtons();
buildCalendarData();
renderCalendar();
updateTodayAndCountdown();
document.getElementById("today-city").textContent = currentCity;

// Countdown cdo sekonde
countdownTimer = setInterval(function() {
  updateTodayAndCountdown();
}, 1000);