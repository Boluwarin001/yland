async function loadFragment(id,file){
  const target=document.getElementById(id);
  try{
    const response=await fetch(file);
    if(!response.ok)throw new Error("Could not load "+file);
    target.innerHTML=await response.text();
  }catch(error){console.error(error)}
}

const currentUrl=window.location.href;
const isLocalhost=currentUrl.includes("localhost");
const baseUrl=isLocalhost?"http://localhost/yland/tenant/":"https://boluwarin001.github.io/yland/tenant/";

async function initLayout(){

  await Promise.all([
    loadFragment("sidebarMount",baseUrl+"sidebar.html"),
    loadFragment("headerMount",baseUrl+"header.html"),
    loadFragment("notificationsMount",baseUrl+"notifications.html")
  ]);

  const sidebar=document.getElementById("sidebar");
  const backdrop=document.getElementById("sidebarBackdrop");

  document.getElementById("sidebarToggle")?.addEventListener("click",()=>{
    sidebar?.classList.toggle("-translate-x-full");
    backdrop?.classList.toggle("hidden");
  });

  backdrop?.addEventListener("click",()=>{
    sidebar?.classList.add("-translate-x-full");
    backdrop?.classList.add("hidden");
  });

  const notifications=document.getElementById("notificationsPanel");

  document.getElementById("notificationButton")?.addEventListener("click",()=>{
    notifications?.classList.toggle("translate-x-full");
  });

  document.querySelectorAll(".sidebarHref").forEach(href=>{
    const target=href.getAttribute("href");
    if(!target||target==="#")return;

    href.href=baseUrl+target;

    const targetUrl=new URL(href.href);
    const pageUrl=new URL(currentUrl);

    if(targetUrl.pathname===pageUrl.pathname){
      href.classList.add("bg-slate-100","text-slate-800");
    }
  });

  const portalSwitcher=document.getElementById("portalSwitcher");
  const portalMenu=document.getElementById("portalMenu");
  const portalChevron=document.getElementById("portalChevron");
  const currentPortal=document.getElementById("currentPortal");

  function togglePortalMenu(show){
    if(!portalMenu)return;

    const shouldOpen=show??portalMenu.classList.contains("invisible");

    if(shouldOpen){
      portalMenu.classList.remove("opacity-0","scale-95","pointer-events-none","invisible");
      portalMenu.classList.add("opacity-100","scale-100");
      portalChevron?.classList.add("rotate-180");
    }else{
      portalMenu.classList.remove("opacity-100","scale-100");
      portalMenu.classList.add("opacity-0","scale-95","pointer-events-none","invisible");
      portalChevron?.classList.remove("rotate-180");
    }
  }

  portalSwitcher?.addEventListener("click",e=>{
    e.stopPropagation();
    togglePortalMenu();
  });

  document.querySelectorAll(".portalOption").forEach(option=>{
    option.addEventListener("click",()=>{
      localStorage.setItem("activePortal",option.dataset.portal);

      const targetUrl=option.dataset.portal==="Landlord"
        ?(isLocalhost?"http://localhost/yland/landlord/index.html":"https://boluwarin001.github.io/yland/landlord/index.html")
        :baseUrl+option.dataset.url;

      navigateWithTransition(targetUrl);
    });
  });

  const activePortal=localStorage.getItem("activePortal")||"Tenant";

  if(currentPortal){
    currentPortal.textContent=activePortal;
  }

  document.querySelectorAll(".portalOption").forEach(option=>{
    option.querySelector(".portalCheck")?.classList.toggle("hidden",option.dataset.portal!==activePortal);
  });

  document.addEventListener("click",e=>{
    if(!portalSwitcher?.contains(e.target)&&!portalMenu?.contains(e.target)){
      togglePortalMenu(false);
    }
  });
}

initLayout();

document.addEventListener("DOMContentLoaded",()=>{
  const page=document.getElementById("page");
  if(!page)return;

  page.style.opacity="0";
  page.style.transform="scale(0.96)";
  page.style.transition="opacity 200ms ease, transform 200ms ease";

  requestAnimationFrame(()=>{
    page.style.opacity="1";
    page.style.transform="scale(1)";
  });
});

function navigateWithTransition(url){

  const page=document.getElementById("page");

  if(!page){
    window.location.href=url;
    return;
  }

  page.style.opacity="0";
  page.style.transform="scale(0.96)";
  page.style.transition="opacity 100ms ease, transform 100ms ease";

  setTimeout(()=>{
    window.location.href=url;
  },100);
}

document.addEventListener("click",event=>{

  if(event.button!==0)return;
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;

  const anchor=event.target.closest("a");
  if(!anchor)return;

  const href=anchor.getAttribute("href");

  if(!href||href==="#")return;
  if(anchor.hasAttribute("download"))return;

  const url=new URL(anchor.href,window.location.href);

  if(url.origin!==window.location.origin)return;

  if(url.pathname===window.location.pathname&&url.search===window.location.search&&url.hash)return;

  event.preventDefault();
  navigateWithTransition(url.href);
});

document.addEventListener("visibilitychange",()=>{
  const page=document.getElementById("page");
  if(!page)return;
  page.style.opacity="1";
  page.style.transform="translateX(0)";
});