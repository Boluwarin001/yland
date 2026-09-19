// property.js
fetch("property-header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("propertyHeaderMount").innerHTML = html;

    const currentTab = document.body.dataset.activeTab || "home";
    
    function activateTab(tabKey) {
      document.querySelectorAll("[data-tab]").forEach(btn => {
        const isActive = btn.dataset.tab === tabKey;
        btn.classList.toggle("text-slate-900", isActive);
        btn.classList.toggle("border-slate-900", isActive);
        btn.classList.toggle("font-medium", isActive);
        btn.classList.toggle("text-slate-400", !isActive);
        btn.classList.toggle("border-transparent", !isActive);
      });
    }

    // Set initial page tab
    activateTab(currentTab);

  });