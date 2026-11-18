/* Karuzela "Nasze projekty" — test, kod napisany od nowa.
   Technika jak na monikaserbista.pl: animacja CSS (@keyframes) przesuwa cala
   szyne; JS tylko dokleja jedna kopie kart, mierzy dlugosc jednego zestawu
   i ustawia czas petli = dlugosc / tempo. Zadnej petli klatek w JS.
   Tempo mozna zmienic w adresie: ?tempo=20 (px/s), domyslnie 14. */
(() => {
  const okno = document.querySelector("[data-karuzela]");
  const szyna = document.querySelector("[data-szyna]");
  if (!okno || !szyna) return;

  const zAdresu = Number(new URLSearchParams(location.search).get("tempo"));
  const tempo = zAdresu > 0 ? zAdresu : 14; // px / s
  const pole = document.querySelector("[data-tempo-teraz]");
  if (pole) pole.textContent = String(tempo);

  // Jedna kopia calego zestawu kart, zeby petla byla bez przerwy.
  const oryginaly = [...szyna.children];
  oryginaly.forEach(karta => {
    const kopia = karta.cloneNode(true);
    kopia.setAttribute("aria-hidden", "true");
    szyna.append(kopia);
  });

  const zmierz = () => {
    // Dlugosc jednego zestawu = odleglosc od pierwszej karty do jej kopii.
    const dlugosc = szyna.children[oryginaly.length].offsetLeft - szyna.children[0].offsetLeft;
    if (!dlugosc) return;
    szyna.style.setProperty("--przesuniecie", `${-dlugosc}px`);
    szyna.style.setProperty("--czas", `${dlugosc / tempo}s`);
    // Restart animacji z nowymi wartosciami.
    szyna.classList.remove("jedzie");
    void szyna.offsetWidth;
    szyna.classList.add("jedzie");
  };

  // Zatrzymanie po najechaniu myszka (jak na monikaserbista.pl).
  okno.addEventListener("pointerenter", () => okno.classList.add("pauza"));
  okno.addEventListener("pointerleave", () => okno.classList.remove("pauza"));

  requestAnimationFrame(zmierz);
  document.fonts?.ready.then(zmierz);
  let czasZmiany = 0;
  window.addEventListener("resize", () => {
    clearTimeout(czasZmiany);
    czasZmiany = setTimeout(zmierz, 150);
  });
})();
