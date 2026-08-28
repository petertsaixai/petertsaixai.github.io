const params=new URLSearchParams(location.search);
if(params.get('ai')==='1'){
  document.body.classList.add('intelligence-active');
  window.addEventListener('load',()=>{
    const technology=document.querySelector('[data-lens="technology"]');
    if(technology) technology.click();
    const panel=document.querySelector('#lens-panel');
    if(panel){
      panel.setAttribute('data-ai-entry','true');
      panel.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    }
  },{once:true});
}
