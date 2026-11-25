// Live parts of the page: Lviv time next to the service line, office open/closed status,
// the mobile action bar after the first screen and closing the mobile menu after an anchor click.
// Without scripting the static text stays (service 24/7, office hours), nothing is hidden.
const TZ = "Europe/Kyiv";
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function lvivNow(): { hh: number; mm: number; weekday: number; text: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ, hour: "2-digit", minute: "2-digit", weekday: "short", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hh = Number(get("hour"));
  const mm = Number(get("minute"));
  return { hh, mm, weekday: days.indexOf(get("weekday")), text: `${get("hour")}:${get("minute")}` };
}

const OPEN = 10;
const CLOSE = 17;

function officeStatus(now: ReturnType<typeof lvivNow>): { open: boolean; text: string } {
  const workday = now.weekday >= 1 && now.weekday <= 5;
  const minutes = now.hh * 60 + now.mm;
  if (workday && minutes >= OPEN * 60 && minutes < CLOSE * 60) {
    return { open: true, text: `Офіс зараз відчинено, до ${CLOSE}:00` };
  }
  let when: string;
  if (workday && minutes < OPEN * 60) when = "сьогодні о 10:00";
  else if (now.weekday >= 1 && now.weekday <= 4) when = "завтра о 10:00";
  else when = "у понеділок о 10:00";
  return { open: false, text: `Офіс зараз зачинено, відчиняємо ${when}` };
}

function swap(el: Element, value: string) {
  if (el.textContent === value) return;
  el.textContent = value;
  if (reduce) return;
  el.classList.remove("is-ticking");
  void (el as HTMLElement).offsetWidth;
  el.classList.add("is-ticking");
}

const clocks = document.querySelectorAll("[data-live-clock]");
const timeWraps = document.querySelectorAll<HTMLElement>("[data-live-time]");
const statuses = document.querySelectorAll<HTMLElement>("[data-office-status]");

function tick(first = false) {
  const now = lvivNow();
  clocks.forEach((c) => (first ? (c.textContent = now.text) : swap(c, now.text)));
  const st = officeStatus(now);
  statuses.forEach((s) => {
    s.dataset.open = String(st.open);
    s.hidden = false;
    const text = s.querySelector("[data-office-text]");
    if (text) first ? (text.textContent = st.text) : swap(text, st.text);
  });
}

tick(true);
timeWraps.forEach((w) => (w.hidden = false));
// Align updates to the start of each minute.
const msToNextMinute = 60000 - (Date.now() % 60000) + 50;
window.setTimeout(() => {
  tick();
  window.setInterval(tick, 60000);
}, msToNextMinute);

// Mobile action bar: shows once the first screen has left the viewport.
const bar = document.querySelector<HTMLElement>("[data-mobile-bar]");
const hero = document.querySelector("[data-hero]");
const contacts = document.querySelector("#contacts");
if (bar && hero && "IntersectionObserver" in window) {
  let heroVisible = true;
  let contactsVisible = false;
  const update = () => {
    const shown = !heroVisible && !contactsVisible;
    bar.classList.toggle("is-shown", shown);
    bar.inert = !shown; // off-screen links stay out of the tab order
  };
  update();
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; update(); }, { threshold: 0 }).observe(hero);
  if (contacts) new IntersectionObserver(([e]) => { contactsVisible = e.isIntersecting; update(); }, { threshold: 0.2 }).observe(contacts);
}

// Mobile menu (<details>): close after an anchor click, on Escape and on a click outside.
const menu = document.querySelector<HTMLDetailsElement>("[data-menu]");
if (menu) {
  const summary = menu.querySelector("summary");
  const sync = () => summary?.setAttribute("aria-expanded", String(menu.open));
  sync();
  menu.addEventListener("toggle", sync);
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { menu.open = false; }));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.open) { menu.open = false; summary?.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (menu.open && !menu.contains(e.target as Node)) menu.open = false;
  });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", (m) => { if (m.matches) menu.open = false; });
}
