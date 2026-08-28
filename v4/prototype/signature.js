const trigger=document.querySelector('#tsai-signature');
const reveal=document.querySelector('#ai-reveal');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
if(trigger&&reveal){
  const setActive=(active)=>{
    document.body.classList.toggle('intelligence-active',active);
    trigger.setAttribute('aria-expanded',String(active));
    reveal.setAttribute('aria-hidden',String(!active));
    if(active&&!reduceMotion.matches){
      document.querySelectorAll('[data-signal]').forEach((node,index)=>{
        node.style.setProperty('--pulse-delay',`${index*90}ms`);
      });
    }
  };
  trigger.addEventListener('click',()=>setActive(!document.body.classList.contains('intelligence-active')));
  trigger.addEventListener('mouseenter',()=>document.body.classList.add('intelligence-preview'));
  trigger.addEventListener('mouseleave',()=>document.body.classList.remove('intelligence-preview'));
  trigger.addEventListener('focus',()=>document.body.classList.add('intelligence-preview'));
  trigger.addEventListener('blur',()=>document.body.classList.remove('intelligence-preview'));
}
