/* Blog Gallery Lightbox */
(function(){
let imgs=[];let idx=0;let overlay=null;

document.addEventListener('click',function(e){
  const link=e.target.closest('.blog-gallery-link');
  if(!link)return;
  e.preventDefault();
  imgs=Array.from(document.querySelectorAll('.blog-gallery-link'));
  idx=imgs.indexOf(link);
  open();
});

function open(){
  overlay=document.createElement('div');
  overlay.className='blog-lb-overlay';
  overlay.innerHTML='<button class="blog-lb-close">&times;</button>'
    +'<button class="blog-lb-nav blog-lb-prev">&#8249;</button>'
    +'<button class="blog-lb-nav blog-lb-next">&#8250;</button>'
    +'<img src="'+imgs[idx].href+'" alt="">'
    +'<div class="blog-lb-counter">'+(idx+1)+' / '+imgs.length+'</div>';
  document.body.appendChild(overlay);
  document.body.style.overflow='hidden';

  overlay.querySelector('.blog-lb-close').onclick=close;
  overlay.querySelector('.blog-lb-prev').onclick=function(e){e.stopPropagation();prev()};
  overlay.querySelector('.blog-lb-next').onclick=function(e){e.stopPropagation();next()};
  overlay.onclick=function(e){if(e.target===overlay)close()};

  document.addEventListener('keydown',onKey);
}

function close(){
  if(overlay){overlay.remove();overlay=null}
  document.body.style.overflow='';
  document.removeEventListener('keydown',onKey);
}

function prev(){idx=(idx-1+imgs.length)%imgs.length;update()}
function next(){idx=(idx+1)%imgs.length;update()}

function update(){
  if(!overlay)return;
  overlay.querySelector('img').src=imgs[idx].href;
  overlay.querySelector('.blog-lb-counter').textContent=(idx+1)+' / '+imgs.length;
}

function onKey(e){
  if(e.key==='Escape')close();
  if(e.key==='ArrowLeft')prev();
  if(e.key==='ArrowRight')next();
}
})();
