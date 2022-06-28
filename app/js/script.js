document.addEventListener("DOMContentLoaded", function() {
  var e = [].slice.call(document.querySelectorAll("img.lazy")),
    t = [].slice.call(document.querySelectorAll(".lazy-background")),
    n = [].slice.call(document.querySelectorAll("[data-bg]"));
  if ("IntersectionObserver" in window) {
    let s = new IntersectionObserver(function(e, t) {
      e.forEach(function(e) {
        if (e.isIntersecting) {
          let t = e.target;
          (t.src = t.dataset.src),
            (t.srcset = t.dataset.srcset),
            t.classList.remove("lazy"),
            s.unobserve(t);
        }
      });
    });
    e.forEach(function(e) {
      s.observe(e);
    });
    let c = new IntersectionObserver(function(e, t) {
      e.forEach(function(e) {
        e.isIntersecting &&
          (e.target.classList.add("visible"), c.unobserve(e.target));
      });
    });
    t.forEach(function(e) {
      c.observe(e);
    });
    let l = new IntersectionObserver(function(e, t) {
      e.forEach(function(e) {
        if (e.isIntersecting) {
          let t = e.target;
          (t.style.backgroundImage = "url(" + t.dataset.bg + ")"),
            l.unobserve(t);
        }
      });
    });
    n.forEach(function(e) {
      l.observe(e);
    });
  } else
    e.forEach(function(e) {
      (e.src = e.dataset.src), (e.srcset = e.dataset.srcset);
    }),
      t.forEach(function(e) {
        e.classList.add("visible");
      }),
      n.forEach(function(e) {
        e.style.backgroundImage = "url(" + e.dataset.bg + ")";
      });
});

const body = document.querySelector("body"),
  maxPreviewElements = 2,
  maxStockElements = 1,
  previewsElements = ["preview-page-", "job-title-", "preview-img-"],
  activeIndexes = {
    previewActiveElement: 0,
    stockActiveElement: 0
  },
  forms = Array.prototype.slice.call(
    document.querySelectorAll(".consultation-form")
  );
let mobileNavBarActive = !1;

function changingActiveSlidesElementsByPager(e, t, n, s) {
  const c = e.target.id,
    l = +c[c.length - 1];
  isFinite(l) &&
    ("preview" === n
      ? (changingClassesOfElements(t, s.previewActiveElement, l),
        (s.previewActiveElement = l))
      : "stock" === n &&
        (changingClassesOfElements(t, s.stockActiveElement, l),
        (s.stockActiveElement = l)));
}

function changingActiveElementsByButtonControls(e, t, n) {
  const s = e.target.id.replace(`${t}-control-`, ""),
    c = "preview" === t ? previewsElements : stocksElements,
    l = "preview" === t ? maxPreviewElements : maxStockElements;
  let o = "preview" === t ? n.previewActiveElement : n.stockActiveElement;
  "left" === s
    ? 0 === o
      ? (changingClassesOfElements(c, o, l), (n[`${t}ActiveElement`] = l))
      : (changingClassesOfElements(c, o, o - 1),
        (n[`${t}ActiveElement`] = o - 1))
    : "right" === s &&
      (o === l
        ? (changingClassesOfElements(c, o, 0), (n[`${t}ActiveElement`] = 0))
        : (changingClassesOfElements(c, o, o + 1),
          (n[`${t}ActiveElement`] = o + 1)));
}

function changingClassesOfElements(e, t, n) {
  for (let s = 0; s < 3; s++)
    document.getElementById(`${e[s]}${t}`).classList.toggle("active"),
      document.getElementById(`${e[s]}${n}`).classList.toggle("active");
}

function slowlyScroll() {
  (e => {
    let t = (() => self.pageYOffset)(),
      n = (e => {
        let t = document.getElementById(e),
          n = t.offsetTop,
          s = t;
        for (; s.offsetParent && s.offsetParent != document.body; )
          n += (s = s.offsetParent).offsetTop;
        return n;
      })(e),
      s = n > t ? n - t : t - n;
    if (s < 100) return void scrollTo(0, n);
    let c = Math.round(s / 200),
      l = Math.round(s / 25),
      o = n > t ? t + l : t - l,
      i = 0;
    if (n > t)
      for (let e = t; e < n; e += l)
        setTimeout("window.scrollTo(0, " + o + ")", i * c),
          (o += l) > n && (o = n),
          i++;
    else
      for (let e = t; e > n; e -= l)
        setTimeout("window.scrollTo(0, " + o + ")", i * c),
          (o -= l) < n && (o = n),
          i++;
  })("pageHeader");
}
document.addEventListener("DOMContentLoaded", () => {
  const postData = async function(url, data) {
    const response = await fetch(url, {
      method: `POST`,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  };

  document
    .getElementById("slider-pages-container")
    .addEventListener("click", e => {
      changingActiveSlidesElementsByPager(
        e,
        previewsElements,
        "preview",
        activeIndexes
      );
    }),
    document
      .getElementById("preview-slider-controls")
      .addEventListener("click", e => {
        changingActiveElementsByButtonControls(e, "preview", activeIndexes);
      }),
    document.getElementById("slowlyScrollTop").addEventListener("click", () => {
      slowlyScroll();
    }),
    forms.forEach(e => {
      e.addEventListener("submit", function(e) {
        e.preventDefault();

        if (e.target.id === 'advantages-form') {
          const formPhone = e.target.querySelector('#advantages-phone').value;
          const formName = e.target.querySelector('#advantages-name').value;
          const formMsg = e.target.querySelector('#advantages-msg').value;
          postData('/message', {phone: `${formPhone}`, name: `${formName}`, msg: `${formMsg}`});
        } else if (e.target.id === 'footer-form') {
          const formPhone = e.target.querySelector('#footer-phone').value;
          console.log(formPhone);
          postData('/message', {phone: `${formPhone}`, name: ``, msg: ``});
        }

        document.querySelector(".alert").classList.add("active"),
        setTimeout(function() {
          document.querySelector(".alert").classList.remove("active");
        }, 1300);
      });
    });
});
