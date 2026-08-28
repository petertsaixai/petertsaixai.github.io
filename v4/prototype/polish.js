const lensPanel = document.querySelector('#lens-panel');
const tabs = [...document.querySelectorAll('.lens-tab')];

function refineLensSummary(){
  const summary = lensPanel?.querySelector('.lens-summary');
  const strong = summary?.querySelector('strong');
  if (!summary || !strong || summary.querySelector('.priority-list')) return;

  const labels = strong.textContent.split(' · ').map(s => s.trim()).filter(Boolean);
  const selected = document.querySelector('.lens-tab[aria-selected="true"]')?.textContent?.trim() || 'Perspective';
  strong.textContent = `${selected} priorities`;

  const list = document.createElement('ol');
  list.className = 'priority-list';
  labels.slice(0,3).forEach(label => {
    const item = document.createElement('li');
    item.textContent = label;
    list.appendChild(item);
  });
  strong.insertAdjacentElement('afterend', list);
}

function collapseInitialMobileContext(){
  if (window.matchMedia('(max-width: 900px)').matches){
    document.querySelector('.inline-context')?.remove();
  }
}

const observer = new MutationObserver(() => queueMicrotask(refineLensSummary));
if (lensPanel) observer.observe(lensPanel,{childList:true,subtree:true});

queueMicrotask(() => {
  refineLensSummary();
  collapseInitialMobileContext();
});

tabs.forEach(tab => {
  const tidy = () => queueMicrotask(() => {
    refineLensSummary();
    collapseInitialMobileContext();
  });
  tab.addEventListener('click', tidy);
  tab.addEventListener('keydown', tidy);
});
