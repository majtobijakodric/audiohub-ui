(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={xmlns:`http://www.w3.org/2000/svg`,width:24,height:24,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":2,"stroke-linecap":`round`,"stroke-linejoin":`round`},t=([e,n,r])=>{let i=document.createElementNS(`http://www.w3.org/2000/svg`,e);return Object.keys(n).forEach(e=>{i.setAttribute(e,String(n[e]))}),r?.length&&r.forEach(e=>{let n=t(e);i.appendChild(n)}),i},n=(n,r={})=>t([`svg`,{...e,...r},n]),r=[[`path`,{d:`M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401`}]],i=[[`circle`,{cx:`12`,cy:`12`,r:`4`}],[`path`,{d:`M12 2v2`}],[`path`,{d:`M12 20v2`}],[`path`,{d:`m4.93 4.93 1.41 1.41`}],[`path`,{d:`m17.66 17.66 1.41 1.41`}],[`path`,{d:`M2 12h2`}],[`path`,{d:`M20 12h2`}],[`path`,{d:`m6.34 17.66-1.41 1.41`}],[`path`,{d:`m19.07 4.93-1.41 1.41`}]],a=document.querySelector(`#app`);if(!a)throw Error(`App root not found`);var o=a,s=`audiohub-ui-theme`,c={screen:`connect`,hostname:``,port:`8080`,theme:g()};v(c.theme);function l(){return`${c.hostname.trim()||`127.0.0.1`}:${c.port.trim()||`8080`}`}function u(){let e=(c.theme===`dark`?`light`:`dark`)==`dark`?`Switch to dark mode`:`Switch to light mode`;return`
    <button
      class="absolute top-6 right-6 grid h-11 w-11 place-items-center border border-black/10 bg-surface-container-low text-on-surface transition duration-150 hover:bg-surface-container-highest focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed sm:top-8 sm:right-8"
      type="button"
      data-action="toggle-theme"
      aria-label="${e}"
      title="${e}"
    >
      <span data-theme-icon aria-hidden="true"></span>
    </button>
  `}function d(){return`
    <main
      class="relative grid min-h-svh place-items-center px-6 py-12 sm:px-8"
      aria-labelledby="server-connect-title"
    >
      ${u()}
      <section
        class="grid w-full max-w-[28rem] gap-8 bg-surface-container-low p-6 outline outline-1 -outline-offset-1 outline-ghost sm:gap-12 sm:p-12"
      >
        <header class="grid gap-3">
          <p class="m-0 text-[0.75rem] leading-none font-medium uppercase tracking-[0.08em] text-on-surface-muted">
            Connect to
          </p>
          <h1
            id="server-connect-title"
            class="m-0 text-[clamp(2.25rem,4vw,3.5rem)] leading-[0.95] font-semibold tracking-[-0.02em] text-balance"
          >
            AudioHub
          </h1>
        </header>

        <form class="grid gap-6" data-form="connect" novalidate>
          <div class="grid gap-[0.4rem]">
            <label
              class="text-[0.75rem] leading-none font-medium uppercase tracking-[0.05em] text-on-surface-muted"
              for="hostname"
            >
              Hostname or IP
            </label>
            <input
              class="w-full border-0 border-b-2 border-surface-container-highest bg-transparent px-0 pb-3 text-base text-on-surface outline-none transition-colors duration-150 placeholder:text-on-surface-muted/70 focus:border-primary"
              id="hostname"
              name="hostname"
              type="text"
              inputmode="url"
              autocomplete="off"
              spellcheck="false"
              placeholder="192.168.1.20"
              value="${m(c.hostname)}"
            />
          </div>

          <div class="grid gap-[0.4rem]">
            <label
              class="text-[0.75rem] leading-none font-medium uppercase tracking-[0.05em] text-on-surface-muted"
              for="port"
            >
              Port
            </label>
            <input
              class="w-full border-0 border-b-2 border-surface-container-highest bg-transparent px-0 pb-3 text-base text-on-surface outline-none transition-colors duration-150 placeholder:text-on-surface-muted/70 focus:border-primary"
              id="port"
              name="port"
              type="text"
              inputmode="numeric"
              value="${m(c.port)}"
              aria-describedby="connection-status"
            />
          </div>

          <button
            class="min-h-12 w-full cursor-pointer border-0 bg-linear-to-b from-primary to-primary-container px-4 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-surface-container-highest transition duration-150 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed"
            type="submit"
          >
            Connect
          </button>
          <p class="m-0 text-sm leading-[1.45] text-on-surface-muted" id="connection-status">
            Not connected
          </p>
        </form>
      </section>
    </main>
  `}function f(){return`
    <main
      class="relative grid min-h-svh place-items-center px-6 py-12 sm:px-8"
      aria-labelledby="login-title"
    >
      ${u()}
      <section
        class="grid w-full max-w-[32rem] gap-8 bg-surface-container-low p-6 outline outline-1 -outline-offset-1 outline-ghost sm:gap-12 sm:p-12"
      >
        <header>
          <div class="flex items-baseline gap-4 sm:gap-2">
            <h1
              id="login-title"
              class="m-0 text-[clamp(2.25rem,4vw,3.5rem)] leading-[0.95] font-semibold tracking-[-0.02em] text-balance"
            >
              AudioHub
            </h1>
            <p class="m-0 text-[0.75rem] leading-none font-medium tracking-[0.05em] text-on-surface-muted">
              ${h(l())}
            </p>
          </div>
        </header>

        <form class="grid gap-6" data-form="login" novalidate>
          <div class="grid gap-[0.4rem]">
            <label
              class="text-[0.75rem] leading-none font-medium uppercase tracking-[0.05em] text-on-surface-muted"
              for="email"
            >
              Email
            </label>
            <input
              class="w-full border-0 border-b-2 border-surface-container-highest bg-transparent px-0 pb-3 text-base text-on-surface outline-none transition-colors duration-150 placeholder:text-on-surface-muted/70 focus:border-primary"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
            />
          </div>

          <div class="grid gap-[0.4rem]">
            <label
              class="text-[0.75rem] leading-none font-medium uppercase tracking-[0.05em] text-on-surface-muted"
              for="password"
            >
              Password
            </label>
            <input
              class="w-full border-0 border-b-2 border-surface-container-highest bg-transparent px-0 pb-3 text-base text-on-surface outline-none transition-colors duration-150 placeholder:text-on-surface-muted/70 focus:border-primary"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              aria-describedby="login-status"
            />
          </div>

          <button
            class="min-h-12 w-full cursor-pointer border-0 bg-linear-to-b from-primary to-primary-container px-4 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-surface-container-highest transition duration-150 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-fixed"
            type="submit"
          >
            Login
          </button>
          <p class="m-0 text-sm leading-[1.45] text-on-surface-muted" id="login-status">
            Incorrect email or password
          </p>
        </form>
      </section>
    </main>
  `}function p(){o.innerHTML=c.screen===`connect`?d():f();let e=o.querySelector(`[data-form="connect"]`),t=o.querySelector(`[data-form="login"]`),n=o.querySelector(`[data-action="toggle-theme"]`);y(o.querySelector(`[data-theme-icon]`)),e?.addEventListener(`submit`,t=>{t.preventDefault();let n=new FormData(e);c.hostname=String(n.get(`hostname`)??``),c.port=String(n.get(`port`)??`8080`),c.screen=`login`,p()}),t?.addEventListener(`submit`,e=>{e.preventDefault()}),n?.addEventListener(`click`,()=>{c.theme=c.theme===`dark`?`light`:`dark`,_(c.theme),v(c.theme),p()})}function m(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`"`,`&quot;`)}function h(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`)}function g(){let e=localStorage.getItem(s);return e===`light`||e===`dark`?e:window.matchMedia(`(prefers-color-scheme: dark)`).matches?`dark`:`light`}function _(e){localStorage.setItem(s,e)}function v(e){document.documentElement.dataset.theme=e,document.documentElement.style.colorScheme=e}function y(e){e&&e.replaceChildren(n(c.theme===`dark`?i:r,{width:18,height:18,strokeWidth:2}))}p();