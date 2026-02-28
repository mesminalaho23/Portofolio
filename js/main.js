(function(){
// Mobile menus with burger transform
function toggler(burgerId, menuId){
const b = document.getElementById(burgerId);
const m = document.getElementById(menuId);
if(!b || !m) return;
b.addEventListener('click', ()=>{
const showed = m.classList.toggle('open');
b.classList.toggle('active', showed);
m.setAttribute('aria-hidden', String(!showed));
});
// close on link
m.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=>{ m.classList.remove('open'); b.classList.remove('active'); m.setAttribute('aria-hidden','true')}));
}
toggler('burger','mobileMenu');

// Stadium spotlight follows mouse
document.addEventListener('mousemove', (e)=>{
const x = (e.clientX / window.innerWidth) * 100;
const y = (e.clientY / window.innerHeight) * 100;
document.documentElement.style.setProperty('--spotlight-x', x + '%');
document.documentElement.style.setProperty('--spotlight-y', y + '%');
});

// Spin-dribble ball on scroll
window.addEventListener('scroll', ()=>{
const scrollY = window.scrollY;
const dribbleBall = document.getElementById('dribbleBall');
if(dribbleBall){
dribbleBall.style.transform = `rotate(${scrollY * 3}deg)`;
}
});


// Intro animation: hide after animation
window.addEventListener('load', ()=>{
const intro = document.getElementById('intro');
if(!intro) return;
setTimeout(()=>{ intro.classList.add('intro-hide'); intro.setAttribute('aria-hidden','true'); }, 1400);
});


// Page link transitions (fade-out then navigate)
document.querySelectorAll('a.nav-link, a.brand').forEach(a=>{
a.addEventListener('click', (e)=>{
const href = a.getAttribute('href');
if(!href || href.startsWith('#')) return;
e.preventDefault();
document.body.classList.add('page-exit');
setTimeout(()=> window.location = href, 420);
});
});


// Spotlight dunk: Intersection Observer + Halo on skills
const options = {root:null,rootMargin:'-10% 0px -10% 0px',threshold:0.25};
const io = new IntersectionObserver((entries)=>{
entries.forEach(en=>{
const el = en.target;
if(en.isIntersecting){
// compute center point for radial position
const rect = el.getBoundingClientRect();
const x = (rect.left + rect.width/2)/window.innerWidth*100 + '%';
const y = (rect.top + rect.height/2)/window.innerHeight*100 + '%';
el.style.setProperty('--x', x);
el.style.setProperty('--y', y);
el.classList.add('spotlight-on','spotlight-dunk');
// Add halo effect for skills
if(el.classList.contains('category')){
el.classList.add('halo');
el.style.setProperty('--x', x);
el.style.setProperty('--y', y);
}
} else {
el.classList.remove('spotlight-on','spotlight-dunk');
}
});
}, options);


document.querySelectorAll('.spotlight-target').forEach(t=> io.observe(t));


// Extra: small keyboard escape to close mobile menus
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') document.querySelectorAll('.mobile-menu.open').forEach(m=> m.classList.remove('open')) });


// Bouncing ball between sections
const ballElement = document.getElementById('sectionBall');
const sectionOptions = {root:null, rootMargin:'-30% 0px -30% 0px', threshold:0.1};
const sectionBallObserver = new IntersectionObserver((entries)=>{
entries.forEach(en=>{
if(en.isIntersecting && (en.target.tagName === 'SECTION' || en.target.classList.contains('spotlight-target'))){
const rect = en.target.getBoundingClientRect();
const x = rect.left + rect.width/2;
const y = rect.top + rect.height/2;
ballElement.style.left = x + 'px';
ballElement.style.top = y + 'px';
ballElement.classList.remove('bounce-in');
setTimeout(()=> ballElement.classList.add('bounce-in'), 10);
}
});
}, sectionOptions);

document.querySelectorAll('section, .spotlight-target').forEach(el=> sectionBallObserver.observe(el));


// Contact form handler
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const formMessage = document.getElementById('formMessage');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if(!name || !email || !subject || !message){
      formMessage.textContent = 'Veuillez remplir tous les champs.';
      formMessage.classList.remove('success');
      formMessage.classList.add('error');
      return;
    }
    
    try {
      // Using FormSubmit.co free service
      const response = await fetch('https://formsubmit.co/ajax/mesminalaho23@gmail.com', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, subject, message})
      });
      
      if(response.ok){
        formMessage.textContent = 'Message envoyé avec succès! Je vous recontacterai bientôt.';
        formMessage.classList.remove('error');
        formMessage.classList.add('success');
        contactForm.reset();
        setTimeout(()=> formMessage.classList.remove('success'), 5000);
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch(err){
      formMessage.textContent = 'Erreur: ' + err.message + '. Essayez de m\'envoyer un email directement.';
      formMessage.classList.remove('success');
      formMessage.classList.add('error');
    }
  });
}

})();