
async function loadFragment(id, file) {
  const target = document.getElementById(id);
  try {
    console.log("Loading fragment:", file);
    const response = await fetch(file);
    if (!response.ok) throw new Error("Could not load " + file);
    target.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

// get current url
const currentUrl = window.location.href;
console.log("Current URL:", currentUrl);
// check if it contains localhost
const isLocalhost = currentUrl.includes("localhost");
let baseUrl = "";
if (isLocalhost) {
    baseUrl = "http://localhost/yland/landlord/";
}else{
    baseUrl = "https://boluwarin001.github.io/yland/landlord/";
}


async function initLayout() {
  await Promise.all([
    loadFragment("sidebarMount", baseUrl + "sidebar.html"),
    loadFragment("headerMount", baseUrl + "header.html"),
    loadFragment("notificationsMount", baseUrl + "notifications.html")
  ]);

  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");

  document.getElementById("sidebarToggle")?.addEventListener("click", () => {
    sidebar?.classList.toggle("-translate-x-full");
    backdrop?.classList.toggle("hidden");
  });

  backdrop?.addEventListener("click", () => {
    sidebar?.classList.add("-translate-x-full");
    backdrop?.classList.add("hidden");
  });

  const notifications = document.getElementById("notificationsPanel");
  document.getElementById("notificationButton")?.addEventListener("click", () => {
    notifications?.classList.toggle("translate-x-full");
  });
  document.getElementById("notificationClose")?.addEventListener("click", () => {
    notifications?.classList.add("translate-x-full");
  });

  document.querySelectorAll(".sidebarHref").forEach(href => {
    href.href = baseUrl + href.getAttribute("href");
    if (href.href === currentUrl) href.classList.add("bg-slate-100", "text-slate-800");
  });

  // Portal Switcher
  // Portal switcher logic with pop animation
  const portalSwitcher = document.getElementById("portalSwitcher");
  const portalMenu = document.getElementById("portalMenu");
  const portalChevron = document.getElementById("portalChevron");
  const currentPortal = document.getElementById("currentPortal");

  // Helper function to animate pop open / pop close
  function togglePortalMenu(show) {
    if (!portalMenu) return;
    const shouldOpen = show ?? portalMenu.classList.contains("invisible");

    if (shouldOpen) {
      portalMenu.classList.remove("opacity-0", "scale-95", "pointer-events-none", "invisible");
      portalMenu.classList.add("opacity-100", "scale-100");
      portalChevron?.classList.add("rotate-180");
    } else {
      portalMenu.classList.remove("opacity-100", "scale-100");
      portalMenu.classList.add("opacity-0", "scale-95", "pointer-events-none", "invisible");
      portalChevron?.classList.remove("rotate-180");
    }
  }

  portalSwitcher?.addEventListener("click", e => {
    e.stopPropagation();
    togglePortalMenu();
  });

  document.querySelectorAll(".portalOption").forEach(option => {
    option.addEventListener("click", () => {
      localStorage.setItem("activePortal", option.dataset.portal);
      // Use existing smooth page transition function if available
      const targetUrl = baseUrl + option.dataset.url;
      if (typeof navigateWithTransition === "function") {
        navigateWithTransition(targetUrl);
      } else {
        window.location.href = targetUrl;
      }
    });
  });

  const activePortal = localStorage.getItem("activePortal");

  if (activePortal && currentPortal) {
    currentPortal.textContent = activePortal;
    document.querySelectorAll(".portalOption").forEach(option => {
      option.querySelector(".portalCheck")?.classList.toggle("hidden", option.dataset.portal !== activePortal);
    });
  }

  // Close when clicking outside
  document.addEventListener("click", e => {
    if (!portalSwitcher?.contains(e.target) && !portalMenu?.contains(e.target)) {
      togglePortalMenu(false);
    }
  });

}

initLayout();

document.addEventListener("DOMContentLoaded", function () {
  const page = document.getElementById("page");
  if (!page) return;

  page.style.opacity = "0";
  page.style.transform = "scale(0.96)";
  page.style.transition = "opacity 200ms ease, transform 200ms ease";

  requestAnimationFrame(() => {
    page.style.opacity = "1";
    page.style.transform = "scale(1)";
  });

});

function navigateWithTransition(url) {
  const page = document.getElementById("page");

  if (!page) { window.location.href = url; return;}
  // Start transition out
  page.style.opacity = "0";
  page.style.transform = "scale(0.96)";
  page.style.transition = "opacity 100ms ease, transform 100ms ease";

  setTimeout(() => {
    window.location.href = url;
  }, 100);
}


// Intercept normal left-click navigation
document.addEventListener("click", function (event) {
  // Only handle normal left-clicks
  if (event.button !== 0) return;
  // Don't interfere with Ctrl/Cmd/Shift/Alt clicks
  if ( event.ctrlKey || event.metaKey || event.shiftKey ||event.altKey) { return; }
  // Find the nearest <a>
  const anchor = event.target.closest("a");
  if (!anchor) return;
  const href = anchor.getAttribute("href");
  // Ignore links without destinations
  if (!href || href === "#") return;
  // Ignore downloads
  if (anchor.hasAttribute("download")) return;
  // Ignore external links
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) {return;}
  // Ignore links that only change the hash
  if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) { return;}
  event.preventDefault();
  navigateWithTransition(url.href);

});

document.addEventListener("visibilitychange", () => {
  document.getElementById('page').style.opacity = 1;
  document.getElementById('page').style.transform = "translateX(0)";
});