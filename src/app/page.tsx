/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCatalogProducts } from "@/lib/catalog";
import { STORE, PAYMENTS, TESTIMONIALS, CATEGORIES, SIZES, fmt } from "@/config/store";
import Image from "next/image";

export default async function Home() {
  const products = await getCatalogProducts();
  const counts: Record<string, number> = {};
  products.forEach((p) => { counts[p.catId] = (counts[p.catId] || 0) + 1; });
  const usedCats = CATEGORIES.filter((c) => counts[c.id]);
  const waUrl = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(STORE.waMessage)}`;
  const activePayments = PAYMENTS;

  const JS = `(function(){
  var cart=[], WA="https://wa.me/${STORE.whatsapp}";
  window.addEventListener('scroll',function(){var h=document.getElementById('hdr');if(h)h.style.boxShadow=window.scrollY>30?'0 2px 16px rgba(196,0,106,.09)':'none';});
  document.addEventListener('click',function(e){
    var t=e.target;
    if(!t)return;
    if(t.classList&&t.classList.contains('sz')){
      var pid=t.dataset.pid;
      document.querySelectorAll('.sz[data-pid="'+pid+'"]').forEach(function(b){b.style.background='#fff';b.style.borderColor='#d4bfca';b.style.color='#111';});
      t.style.background='#ff2d87';t.style.borderColor='#ff2d87';t.style.color='#fff';
    }
    if(t.classList&&t.classList.contains('qbtn')){
      var pid=t.dataset.pid,d=parseInt(t.dataset.d||'0');
      var el=document.getElementById('q-'+pid);
      if(el)el.textContent=String(Math.max(1,Math.min(99,parseInt(el.textContent||'1')+d)));
    }
    if(t.classList&&t.classList.contains('btn-add')){
      var pid=t.dataset.pid,name=t.dataset.name||'',ref=t.dataset.ref||'',price=parseInt(t.dataset.price||'0'),file=t.dataset.file||'';
      var sz=document.querySelector('.sz[data-pid="'+pid+'"][style*="#ff2d87"]')||document.querySelector('.sz[data-pid="'+pid+'"]');
      var size=sz?sz.textContent.trim():'S';
      var qEl=document.getElementById('q-'+pid);
      var qty=parseInt(qEl?qEl.textContent||'1':'1');
      var hit=cart.find(function(c){return c.pid===pid&&c.size===size;});
      if(hit)hit.qty+=qty;else cart.push({pid:pid,name:name,ref:ref,price:price,file:file,size:size,qty:qty});
      renderCart();showToast('Agregado: '+name+' T.'+size);
    }
    if(t.classList&&t.classList.contains('ci-rm')){cart.splice(parseInt(t.dataset.i||'0'),1);renderCart();}
    if(t.id==='c-clear'){cart=[];renderCart();}
    if(t.id==='lb'||t.id==='lb-cls'){var lb=document.getElementById('lb');if(lb)lb.style.display='none';document.body.style.overflow='';}
    if(t.closest&&(t.closest('#mob-bar')||t.closest('#cart-hdr-btn')))toggleCart();
    var iw=t.closest&&t.closest('.pc-img');
    if(iw){var img=iw.querySelector('img');if(img){var lbEl=document.getElementById('lb');var lbImg=document.getElementById('lb-img');var lbCap=document.getElementById('lb-cap');if(lbImg)lbImg.src=img.src;if(lbCap)lbCap.textContent=iw.dataset.name||'';if(lbEl)lbEl.style.display='flex';document.body.style.overflow='hidden';}}
    document.querySelectorAll('#fbar button').forEach(function(b){
      if(b===t){
        b.style.background='#ff2d87';b.style.borderColor='#ff2d87';b.style.color='#fff';
        var cat=b.dataset.cat||'todos';
        var title=document.getElementById('cat-title');
        if(title)title.textContent=cat==='todos'?'Catálogo':cat.replace(/-/g,' ').replace(/\\b\\w/g,function(c){return c.toUpperCase();});
        document.querySelectorAll('.pcard').forEach(function(c){c.style.display=(cat==='todos'||c.dataset.cat===cat)?'':'none';});
      }else{b.style.background='#fff';b.style.borderColor='#d4bfca';b.style.color='#4a3a42';}
    });
  });
  function renderCart(){
    var l=document.getElementById('c-list'),f=document.getElementById('c-foot'),h=document.getElementById('c-hint'),h2=document.getElementById('c-hint2'),bd=document.getElementById('cbadge'),bar=document.getElementById('mob-bar'),cnt=document.getElementById('mob-cnt');
    if(!l||!f)return;
    var total=cart.reduce(function(s,c){return s+(c.price||0)*c.qty;},0),n=cart.reduce(function(s,c){return s+c.qty;},0);
    if(!cart.length){l.innerHTML='';f.style.display='none';if(h)h.style.display='block';if(h2)h2.style.display='block';if(bd)bd.style.display='none';if(bar)bar.style.display='none';return;}
    if(h)h.style.display='none';if(h2)h2.style.display='none';f.style.display='block';
    if(bd){bd.textContent=String(n);bd.style.display='flex';}
    if(bar)bar.style.display='flex';if(cnt)cnt.textContent=n+' item'+(n>1?'s':'');
    l.innerHTML=cart.map(function(c,i){return '<div style="display:flex;align-items:center;gap:.5rem;background:#faf7f8;border-radius:14px;padding:.48rem"><img src="'+c.file+'" alt="" style="width:40px;height:40px;border-radius:8px;object-fit:cover;flex-shrink:0"><div style="flex:1;min-width:0"><div style="font-size:.75rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#111">'+c.name+'</div><div style="font-size:.67rem;color:#8a7080">'+c.ref+' T.'+c.size+' x'+c.qty+' $'+(c.price*c.qty).toLocaleString('es-CO')+'</div></div><button class="ci-rm" data-i="'+i+'" style="background:none;border:none;cursor:pointer;color:#d4bfca;font-size:.82rem;flex-shrink:0">x</button></div>';}).join('');
    var totEl=document.getElementById('c-total');if(totEl)totEl.textContent='$ '+total.toLocaleString('es-CO');
    var msg='Hola Creaciones Sofi!\\n\\nPedido:\\n\\n';
    cart.forEach(function(c,i){msg+=(i+1)+'. '+c.name+' '+c.ref+' T.'+c.size+' x'+c.qty+' $'+(c.price*c.qty).toLocaleString('es-CO')+'\\n';});
    msg+='\\nTotal: $'+total.toLocaleString('es-CO')+'\\nGracias!';
    var waEl=document.getElementById('c-wa');if(waEl)waEl.href=WA+'?text='+encodeURIComponent(msg);
  }
  function toggleCart(){var cs=document.getElementById('cart-side');if(cs)cs.style.transform=cs.style.transform==='translateY(0px)'?'translateY(100%)':'translateY(0px)';}
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){var lb=document.getElementById('lb');if(lb)lb.style.display='none';document.body.style.overflow='';}});
  var tt;function showToast(msg){var t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';clearTimeout(tt);tt=setTimeout(function(){t.style.opacity='0';t.style.transform='translateX(-50%) translateY(10px)';},2800);}
  if(window.innerWidth<=900){var cs=document.getElementById('cart-side');if(cs){cs.style.position='fixed';cs.style.bottom='0';cs.style.left='0';cs.style.right='0';cs.style.zIndex='799';cs.style.borderRadius='22px 22px 0 0';cs.style.maxHeight='65vh';cs.style.overflowY='auto';cs.style.transform='translateY(100%)';cs.style.transition='transform .25s ease';cs.style.top='auto';}}
})();`;

  return (
    <main>
      {/* HEADER */}
      <header id="hdr" style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,height:58,padding:"0 2rem",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid #efe8ed"}}>
        <a href="#inicio" style={{display:"flex",alignItems:"center",gap:".6rem",textDecoration:"none"}}>
          <Image src="/logo.webp" alt="Creaciones Sofi" width={38} height={38} style={{borderRadius:"50%",objectFit:"cover"}} priority />
          <span style={{fontFamily:"var(--serif)",fontSize:"1.35rem",fontWeight:700,color:"#111"}}>Creaciones <em style={{color:"#ff2d87",fontStyle:"italic"}}>Sofi</em></span>
        </a>
        <nav style={{display:"flex",alignItems:"center",gap:"1.8rem"}}>
          {[["inicio","Inicio"],["categorias","Categorías"],["catalogo","Catálogo"],["testimonios","Reseñas"],["contacto","Contacto"]].map(([id,lbl])=>(
            <a key={id} href={`#${id}`} style={{fontSize:".82rem",fontWeight:500,color:"#4a3a42",textDecoration:"none"}}>{lbl}</a>
          ))}
        </nav>
        <div style={{display:"flex",alignItems:"center",gap:".6rem"}}>
          <button id="cart-hdr-btn" style={{position:"relative",width:36,height:36,background:"#efe8ed",border:"none",borderRadius:"50%",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            🛒<span id="cbadge" style={{display:"none",position:"absolute",top:-3,right:-3,background:"#ff2d87",color:"#fff",fontSize:".58rem",fontWeight:800,minWidth:15,height:15,borderRadius:"50px",alignItems:"center",justifyContent:"center",padding:"0 2px"}}>0</span>
          </button>
          <a href={waUrl} target="_blank" rel="noopener" style={{display:"flex",alignItems:"center",gap:".35rem",padding:".42rem 1.1rem",background:"#ff2d87",color:"#fff",borderRadius:"50px",fontSize:".8rem",fontWeight:700,textDecoration:"none"}}>💬 WhatsApp</a>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" style={{position:"relative",minHeight:"100vh",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",padding:"78px 2rem 4rem",background:"linear-gradient(145deg,#fff5f9 0%,#ffd6eb 50%,#ffc2df 100%)"}}>
        <div style={{position:"absolute",width:560,height:560,borderRadius:"50%",filter:"blur(70px)",opacity:.28,background:"#ff2d87",top:"-120px",right:"-120px"}} />
        <div style={{position:"absolute",width:380,height:380,borderRadius:"50%",filter:"blur(70px)",opacity:.28,background:"#f0b429",bottom:"-80px",left:"-80px"}} />
        <div style={{position:"relative",zIndex:2,display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",maxWidth:1200,width:"100%",alignItems:"center"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"rgba(255,45,135,.1)",border:"1px solid rgba(255,45,135,.22)",borderRadius:"50px",padding:".33rem .9rem",fontSize:".7rem",fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#ff2d87",marginBottom:"1.1rem"}}>💗 Nueva Colección 2026</div>
            <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(2.8rem,5.5vw,5rem)",fontWeight:700,lineHeight:.98,marginBottom:".7rem",color:"#111"}}>
              Moda <em style={{color:"#ff2d87",fontStyle:"italic"}}>Femenina</em>
              <span style={{display:"block",fontStyle:"italic",color:"#ff2d87",fontSize:"clamp(2.2rem,4.5vw,4rem)"}}>Creaciones Sofi</span>
            </h1>
            <p style={{fontSize:"1rem",color:"#4a3a42",fontStyle:"italic",marginBottom:".4rem"}}>con Estilo y Elegancia</p>
            <div style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"rgba(255,45,135,.08)",border:"1px solid rgba(255,45,135,.2)",borderRadius:"50px",padding:".3rem .9rem",fontSize:".75rem",fontWeight:700,color:"#ff2d87",marginBottom:".7rem"}}>🏭 {STORE.mayorista}</div>
            <p style={{fontSize:".92rem",color:"#8a7080",lineHeight:1.8,maxWidth:440,marginBottom:"1.8rem"}}>{STORE.description}</p>
            <div style={{display:"flex",gap:".8rem",flexWrap:"wrap",marginBottom:"1.4rem"}}>
              <a href="#catalogo" style={{padding:".78rem 2rem",background:"#ff2d87",color:"#fff",borderRadius:"50px",fontWeight:700,fontSize:".9rem",textDecoration:"none"}}>👗 Ver Catálogo</a>
              <a href={waUrl} target="_blank" rel="noopener" style={{padding:".78rem 2rem",background:"transparent",color:"#111",border:"2px solid rgba(0,0,0,.16)",borderRadius:"50px",fontWeight:700,fontSize:".9rem",textDecoration:"none"}}>💬 WhatsApp</a>
            </div>
            <div style={{display:"flex",gap:".5rem",flexWrap:"wrap",marginBottom:"1.2rem"}}>
              {[{href:STORE.instagram,lbl:"📸 Instagram"},{href:STORE.facebook,lbl:"📘 Facebook"},{href:`https://wa.me/${STORE.whatsapp}`,lbl:"💬 WhatsApp"}].map(s=>(
                <a key={s.href} href={s.href} target="_blank" rel="noopener" style={{display:"flex",alignItems:"center",gap:".3rem",padding:".26rem .65rem",background:"rgba(255,255,255,.7)",border:"1px solid rgba(255,255,255,.8)",borderRadius:"50px",fontSize:".72rem",fontWeight:600,color:"#4a3a42",textDecoration:"none"}}>{s.lbl}</a>
              ))}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:".4rem",marginBottom:"1.5rem"}}>
              {/* Métodos de pago con logos reales */}
              <a href="https://transacciones.nequi.com/bdigital/login.jsp?region=co" target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"#fff",border:"2px solid #e91e8c",borderRadius:"50px",padding:".3rem .85rem",textDecoration:"none",boxShadow:"0 2px 10px rgba(233,30,140,.2)",cursor:"pointer"}}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Nequi_logo.svg/200px-Nequi_logo.svg.png" alt="Nequi" style={{height:18,objectFit:"contain"}} />
              </a>
              <a href="https://www.bancolombia.com/centro-de-ayuda/canales/sucursal-virtual-personas" target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"#fff",border:"2px solid #fdda24",borderRadius:"50px",padding:".3rem .85rem",textDecoration:"none",boxShadow:"0 2px 10px rgba(0,100,0,.15)",cursor:"pointer"}}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Bancolombia_logo.svg/200px-Bancolombia_logo.svg.png" alt="Bancolombia" style={{height:18,objectFit:"contain"}} />
              </a>
              <span style={{display:"inline-flex",alignItems:"center",gap:".3rem",background:"rgba(255,200,0,.15)",border:"1px solid rgba(255,180,0,.4)",borderRadius:"50px",padding:".26rem .72rem",fontSize:".7rem",fontWeight:700,color:"#b8860b"}}>⚠️ Envío no incluido</span>
              {/* Redes sociales con íconos SVG */}
              <a href={STORE.instagram} target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",textDecoration:"none",flexShrink:0}} title="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href={STORE.facebook} target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:28,height:28,borderRadius:"50%",background:"#1877f2",textDecoration:"none",flexShrink:0}} title="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:28,height:28,borderRadius:"50%",background:"#25d366",textDecoration:"none",flexShrink:0}} title="WhatsApp">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
            <div style={{display:"flex",gap:"1.8rem",paddingTop:"1.4rem",borderTop:"1px solid rgba(255,45,135,.14)"}}>
              {[{n:"500+",l:"Clientas felices"},{n:"100+",l:"Estilos únicos"},{n:"5★",l:"Calificación"}].map(s=>(
                <div key={s.l}><span style={{fontFamily:"var(--serif)",fontSize:"1.7rem",fontWeight:700,color:"#ff2d87",display:"block",lineHeight:1}}>{s.n}</span><span style={{fontSize:".68rem",letterSpacing:1,textTransform:"uppercase",color:"#8a7080"}}>{s.l}</span></div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <div style={{
              background:"linear-gradient(135deg,#ff80ab,#f48fb1)",
              borderRadius:24,
              padding:16,
              boxShadow:"0 20px 60px rgba(255,100,150,0.35)",
              maxWidth:"min(340px,84vw)",
              width:"100%",
            }}>
              <video
                src="/video_creaciones_sofi.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width:"100%",
                  borderRadius:16,
                  display:"block",
                  objectFit:"cover",
                  maxHeight:"420px",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section id="categorias" style={{padding:"76px 2rem",background:"#fff"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:"2.2rem",flexWrap:"wrap",gap:"1rem"}}>
            <div>
              <span style={{fontSize:".68rem",fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#ff2d87",display:"block",marginBottom:".35rem"}}>✦ Colecciones ✦</span>
              <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(1.8rem,3.5vw,2.5rem)",fontWeight:700,color:"#111"}}>Nuestras <em style={{color:"#ff2d87",fontStyle:"italic"}}>Categorías</em></h2>
            </div>
            <a href="#catalogo" style={{fontSize:".84rem",fontWeight:600,color:"#ff2d87",textDecoration:"none"}}>Ver todo el catálogo →</a>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:".9rem"}}>
            {usedCats.length > 0 ? usedCats.map(cat=>{
              const cover = products.find(p=>p.catId===cat.id);
              return (
                <a key={cat.id} href="#catalogo" style={{position:"relative",borderRadius:22,overflow:"hidden",aspectRatio:"3/4",cursor:"pointer",boxShadow:"0 2px 16px rgba(196,0,106,.09)",display:"block",background:"#fff5f9",textDecoration:"none"}}>
                  {cover ? <Image src={cover.file} alt={cat.label} fill style={{objectFit:"cover"}} /> : <div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#ffd6eb,#ff2d87)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"3.2rem"}}>👗</div>}
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(0,0,0,.62) 0%,transparent 55%)"}} />
                  <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"1rem .9rem",color:"#fff"}}>
                    <div style={{fontFamily:"var(--serif)",fontSize:".95rem",fontWeight:700,marginBottom:".18rem"}}>{cat.label}</div>
                    <div style={{fontSize:".7rem",opacity:.8}}>{counts[cat.id]} prendas</div>
                  </div>
                </a>
              );
            }) : (
              <div style={{gridColumn:"1/-1",textAlign:"center",padding:"3rem",color:"#8a7080",fontStyle:"italic"}}>
                Agrega fotos a <strong style={{color:"#ff2d87"}}>public/catalog/</strong> para ver las categorías 💗
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section id="catalogo" style={{padding:"50px 0 76px",background:"#faf7f8"}}>
        <div style={{maxWidth:1400,margin:"0 auto",padding:"0 2rem"}}>
          <div style={{marginBottom:"1rem"}}>
            <span style={{fontSize:".68rem",fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#ff2d87",display:"block",marginBottom:".35rem"}}>✦ Prendas ✦</span>
            <div id="cat-title" style={{fontFamily:"var(--serif)",fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:700,color:"#111"}}>Catálogo</div>
          </div>
          <div id="fbar" style={{display:"flex",gap:".4rem",overflowX:"auto",paddingBottom:".4rem",marginBottom:"1.6rem",position:"sticky",top:58,zIndex:100,background:"#faf7f8",paddingTop:".7rem"}}>
            <button data-cat="todos" style={{flexShrink:0,padding:".38rem .85rem",borderRadius:"50px",background:"#ff2d87",border:"1.5px solid #ff2d87",color:"#fff",fontSize:".76rem",fontWeight:600,whiteSpace:"nowrap",cursor:"pointer"}}><strong>{products.length}</strong> Todo</button>
            {usedCats.map(cat=>(
              <button key={cat.id} data-cat={cat.id} style={{flexShrink:0,padding:".38rem .85rem",borderRadius:"50px",background:"#fff",border:"1.5px solid #d4bfca",color:"#4a3a42",fontSize:".76rem",fontWeight:600,whiteSpace:"nowrap",cursor:"pointer"}}><strong>{counts[cat.id]}</strong> {cat.label}</button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:"1.4rem",alignItems:"start"}}>
            <div>
              <div id="pgrid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:"1rem"}}>
                {products.length === 0 ? (
                  <div style={{gridColumn:"1/-1",textAlign:"center",padding:"4rem 2rem",background:"#fff",borderRadius:22,border:"2px dashed #d4bfca"}}>
                    <span style={{fontSize:"3rem",display:"block",marginBottom:".9rem"}}>📂</span>
                    <h3 style={{fontFamily:"var(--serif)",fontSize:"1.4rem",color:"#ff2d87",marginBottom:".45rem"}}>Agrega tus fotos</h3>
                    <p style={{fontSize:".86rem",color:"#8a7080",lineHeight:1.7,maxWidth:380,margin:"0 auto"}}>Copia tus fotos dentro de <strong style={{color:"#ff2d87"}}>public/catalog/</strong> y vuelve a publicar.</p>
                  </div>
                ) : products.map(p=>(
                  <div key={p.id} className="pcard" data-cat={p.catId} style={{background:"#fff",borderRadius:22,overflow:"hidden",boxShadow:"0 2px 16px rgba(196,0,106,.09)",border:"1.5px solid transparent"}}>
                    <div className="pc-img" data-name={`${p.name} — ${p.ref}`} style={{position:"relative",overflow:"hidden",aspectRatio:"1/1",background:"#fff5f9",cursor:"zoom-in"}}>
                      <Image src={p.file} alt={p.name} fill style={{objectFit:"cover"}} sizes="200px" />
                    </div>
                    <div style={{padding:".85rem .9rem 1rem"}}>
                      <div style={{fontSize:".88rem",fontWeight:700,lineHeight:1.3,marginBottom:".08rem",color:"#111"}}>{p.name}</div>
                      <div style={{fontSize:".65rem",color:"#8a7080",marginBottom:".05rem"}}>{p.ref}</div>
                      <div style={{fontFamily:"var(--serif)",fontSize:"1.2rem",fontWeight:700,color:"#ff2d87",marginBottom:".65rem"}}>{fmt(p.price)}</div>
                      <div style={{fontSize:".63rem",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"#8a7080",marginBottom:".28rem"}}>TALLAS</div>
                      <div style={{display:"flex",gap:".26rem",flexWrap:"wrap",marginBottom:".6rem"}}>
                        {SIZES.map((s,i)=>(
                          <button key={s} className="sz" data-pid={p.id} style={{width:29,height:29,borderRadius:"50%",border:i===0?"1.5px solid #ff2d87":"1.5px solid #d4bfca",background:i===0?"#ff2d87":"#fff",color:i===0?"#fff":"#111",fontSize:".68rem",fontWeight:700,cursor:"pointer"}}>{s}</button>
                        ))}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:".42rem",marginBottom:".65rem"}}>
                        <button className="qbtn" data-pid={p.id} data-d="-1" style={{width:25,height:25,borderRadius:"50%",border:"1.5px solid #d4bfca",background:"#fff",fontSize:".88rem",fontWeight:700,cursor:"pointer"}}>−</button>
                        <span id={`q-${p.id}`} style={{fontSize:".88rem",fontWeight:700,minWidth:17,textAlign:"center"}}>1</span>
                        <button className="qbtn" data-pid={p.id} data-d="1" style={{width:25,height:25,borderRadius:"50%",border:"1.5px solid #d4bfca",background:"#fff",fontSize:".88rem",fontWeight:700,cursor:"pointer"}}>+</button>
                      </div>
                      <button className="btn-add" data-pid={p.id} data-name={p.name} data-ref={p.ref} data-price={String(p.price)} data-file={p.file} style={{width:"100%",padding:".52rem",background:"#ff2d87",color:"#fff",border:"none",borderRadius:"50px",fontSize:".76rem",fontWeight:800,letterSpacing:".5px",textTransform:"uppercase",cursor:"pointer"}}>Agregar al carrito</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <aside id="cart-side" style={{background:"#fff",borderRadius:22,border:"1.5px solid #efe8ed",padding:"1.2rem",position:"sticky",top:71,boxShadow:"0 2px 16px rgba(196,0,106,.09)"}}>
              <span style={{fontSize:".6rem",fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:"#ff2d87",display:"block",marginBottom:".35rem"}}>CARRITO</span>
              <div style={{fontFamily:"var(--serif)",fontSize:"1.3rem",fontWeight:700,marginBottom:".38rem",color:"#111"}}>Tu carrito te espera</div>
              <p id="c-hint" style={{fontSize:".8rem",color:"#8a7080",lineHeight:1.6,marginBottom:".28rem"}}>Elige tu talla y arma tu pedido.</p>
              <p id="c-hint2" style={{fontSize:".72rem",color:"#d4bfca",fontStyle:"italic"}}>Los productos aparecen al hacer clic en agregar.</p>
              <div id="c-list" style={{display:"flex",flexDirection:"column",gap:".5rem",margin:".85rem 0"}}></div>
              <div id="c-foot" style={{display:"none"}}>
                <hr style={{border:"none",borderTop:"1px solid #efe8ed",margin:".65rem 0"}} />
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".8rem"}}>
                  <span style={{fontSize:".78rem",color:"#8a7080"}}>Total estimado</span>
                  <span id="c-total" style={{fontFamily:"var(--serif)",fontSize:"1.4rem",fontWeight:700,color:"#ff2d87"}}>$0</span>
                </div>
                <a id="c-wa" href="#" target="_blank" rel="noopener" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".4rem",width:"100%",padding:".62rem",background:"#25d366",color:"#fff",borderRadius:"50px",fontSize:".8rem",fontWeight:800,textTransform:"uppercase",textDecoration:"none",marginBottom:".42rem"}}>💬 Pedir por WhatsApp</a>
                <button id="c-clear" style={{width:"100%",padding:".4rem",background:"none",border:"1.5px solid #d4bfca",borderRadius:"50px",fontSize:".72rem",fontWeight:600,color:"#8a7080",cursor:"pointer"}}>Vaciar carrito</button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div id="mob-bar" style={{display:"none",position:"fixed",bottom:0,left:0,right:0,zIndex:800,background:"#ff2d87",color:"#fff",padding:".75rem 1.5rem",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
        <span style={{fontWeight:700,fontSize:".84rem"}}>🛒 Ver Carrito</span>
        <span id="mob-cnt" style={{background:"rgba(255,255,255,.22)",borderRadius:"50px",padding:".18rem .65rem",fontWeight:800,fontSize:".76rem"}}>0 items</span>
      </div>

      <div style={{background:"#1a1020",padding:"2.2rem 2rem"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",gap:"2.8rem"}}>
          {[{n:"500+",l:"Clientas"},{n:"100+",l:"Estilos"},{n:"3+",l:"Años"},{n:"24h",l:"WhatsApp"}].map(s=>(
            <div key={s.l} style={{textAlign:"center",color:"#fff"}}>
              <span style={{fontFamily:"var(--serif)",fontSize:"2.3rem",fontWeight:700,color:"#ff2d87",display:"block",lineHeight:1}}>{s.n}</span>
              <span style={{fontSize:".68rem",letterSpacing:2,textTransform:"uppercase",opacity:.55}}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      <section id="testimonios" style={{padding:"72px 2rem",background:"#fff5f9"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.2rem"}}>
            <span style={{fontSize:".68rem",fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#ff2d87",display:"block",marginBottom:".35rem"}}>✦ Lo que dicen ✦</span>
            <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(1.8rem,3.5vw,2.5rem)",fontWeight:700,color:"#111"}}>Nuestras <em style={{color:"#ff2d87",fontStyle:"italic"}}>Clientas Felices</em></h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:"1.1rem"}}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:22,padding:"1.5rem",boxShadow:"0 2px 16px rgba(196,0,106,.09)",position:"relative"}}>
                <span style={{position:"absolute",top:".9rem",right:"1.2rem",fontFamily:"var(--serif)",fontSize:"3.2rem",lineHeight:1,color:"#ffd6eb"}}>❝</span>
                <div style={{color:"#f0b429",marginBottom:".65rem",fontSize:".9rem"}}>{"★".repeat(t.stars)}</div>
                <p style={{fontSize:".86rem",lineHeight:1.75,color:"#4a3a42",marginBottom:"1.1rem",fontStyle:"italic"}}>&ldquo;{t.text}&rdquo;</p>
                <div style={{display:"flex",alignItems:"center",gap:".65rem"}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#ffd6eb,#ff2d87)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>{t.avatar}</div>
                  <div><div style={{fontWeight:700,fontSize:".83rem",color:"#111"}}>{t.name}</div><div style={{fontSize:".71rem",color:"#8a7080"}}>{t.city}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" style={{padding:"72px 2rem",background:"#fff"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.2rem"}}>
            <span style={{fontSize:".68rem",fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#ff2d87",display:"block",marginBottom:".35rem"}}>✦ Encuéntranos ✦</span>
            <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(1.8rem,3.5vw,2.5rem)",fontWeight:700,color:"#111"}}>Estamos para <em style={{color:"#ff2d87",fontStyle:"italic"}}>Ti</em></h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(225px,1fr))",gap:".95rem"}}>
            {[
              {href:`https://wa.me/${STORE.whatsapp}`,lbl:"WhatsApp",val:"3223815323",bg:"linear-gradient(135deg,#25d366,#128c7e)",icon:"💬"},
              {href:STORE.facebook,lbl:"Facebook",val:"@creacionesofi.848405",bg:"linear-gradient(135deg,#1877f2,#0c4faa)",icon:"📘"},
              {href:STORE.instagram,lbl:"Instagram",val:"@crea.cionesofio9",bg:"linear-gradient(135deg,#f09433,#dc2743,#bc1888)",icon:"📸"},
              {href:"#",lbl:"Ubicación",val:"Medellín, Antioquia",bg:"linear-gradient(135deg,#ffd6eb,#ff2d87)",icon:"📍"},
            ].map(s=>(
              <a key={s.lbl} href={s.href} target={s.href!=="#"?"_blank":undefined} rel="noopener" style={{display:"flex",alignItems:"center",gap:".9rem",padding:"1rem 1.2rem",borderRadius:22,background:"#faf7f8",border:"1.5px solid transparent",color:"#111",textDecoration:"none"}}>
                <div style={{width:44,height:44,borderRadius:14,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem",flexShrink:0}}>{s.icon}</div>
                <div><div style={{fontSize:".62rem",fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#8a7080",marginBottom:".12rem"}}>{s.lbl}</div><div style={{fontFamily:"var(--serif)",fontSize:"1rem",fontWeight:700}}>{s.val}</div></div>
                <span style={{color:"#ff2d87",marginLeft:"auto"}}>→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer style={{background:"#1a1020",color:"#fff",padding:"3.8rem 2rem 2rem",position:"relative"}}>
        <div style={{height:3,background:"linear-gradient(90deg,#c4006a,#ff2d87,#f0b429,#ff2d87,#c4006a)",marginBottom:"3.8rem",marginTop:"-3.8rem"}} />
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:"2.4rem",paddingBottom:"2.8rem",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:".7rem",marginBottom:".55rem"}}>
              <Image src="/logo.webp" alt="Creaciones Sofi" width={40} height={40} style={{borderRadius:"50%",objectFit:"cover"}} />
              <span style={{fontFamily:"var(--serif)",fontSize:"1.6rem",fontWeight:700,color:"#fff"}}>Creaciones <em style={{color:"#ff2d87",fontStyle:"italic"}}>Sofi</em></span>
            </div>
            <p style={{fontStyle:"italic",color:"rgba(255,255,255,.38)",fontSize:".83rem",lineHeight:1.7,marginBottom:"1.2rem"}}>Moda femenina con estilo y elegancia.</p>
            <div style={{display:"flex",gap:".55rem"}}>
              {[{h:`https://wa.me/${STORE.whatsapp}`,i:"💬"},{h:STORE.facebook,i:"📘"},{h:STORE.instagram,i:"📸"}].map(s=>(
                <a key={s.h} href={s.h} target="_blank" rel="noopener" style={{width:32,height:32,background:"rgba(255,255,255,.08)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".85rem",textDecoration:"none"}}>{s.i}</a>
              ))}
            </div>
          </div>
          <div><div style={{fontSize:".68rem",fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#ff2d87",marginBottom:".9rem"}}>Navegación</div><ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:".52rem"}}>{[["inicio","Inicio"],["categorias","Categorías"],["catalogo","Catálogo"],["contacto","Contacto"]].map(([id,lbl])=><li key={id}><a href={`#${id}`} style={{color:"rgba(255,255,255,.38)",fontSize:".8rem",textDecoration:"none"}}>{lbl}</a></li>)}</ul></div>
          <div><div style={{fontSize:".68rem",fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#ff2d87",marginBottom:".9rem"}}>Categorías</div><ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:".52rem"}}>{CATEGORIES.slice(0,5).map(c=><li key={c.id}><a href="#catalogo" style={{color:"rgba(255,255,255,.38)",fontSize:".8rem",textDecoration:"none"}}>{c.label}</a></li>)}</ul></div>
          <div><div style={{fontSize:".68rem",fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#ff2d87",marginBottom:".9rem"}}>Contacto</div><ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:".52rem"}}><li><a href={`https://wa.me/${STORE.whatsapp}`} style={{color:"rgba(255,255,255,.38)",fontSize:".8rem",textDecoration:"none"}}>3223815323</a></li><li><span style={{color:"rgba(255,255,255,.38)",fontSize:".8rem"}}>Medellín, Antioquia</span></li></ul></div>
        </div>
        <div style={{maxWidth:1100,margin:"0 auto",paddingTop:"1.4rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:".7rem"}}>
          <p style={{fontSize:".73rem",color:"rgba(255,255,255,.22)"}}>© 2026 Creaciones Sofi</p>
          <p style={{fontSize:".73rem",color:"rgba(255,255,255,.22)"}}>📍 Medellín, Antioquia, Colombia</p>
        </div>
      </footer>

      <a href={waUrl} target="_blank" rel="noopener" style={{position:"fixed",bottom:"1.8rem",right:"1.8rem",zIndex:700,width:52,height:52,background:"linear-gradient(135deg,#25d366,#128c7e)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",textDecoration:"none"}}>💬</a>

      <div id="lb" style={{display:"none",position:"fixed",inset:0,background:"rgba(0,0,0,.93)",zIndex:5000,alignItems:"center",justifyContent:"center",padding:"1rem"}}>
        <div style={{position:"relative",maxWidth:"min(90vw,700px)"}}>
          <button id="lb-cls" style={{position:"absolute",top:-40,right:0,background:"none",border:"none",color:"rgba(255,255,255,.7)",fontSize:"1.9rem",cursor:"pointer"}}>✕</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="lb-img" src="" alt="" style={{width:"100%",maxHeight:"88vh",objectFit:"contain",borderRadius:14,display:"block"}} />
          <div id="lb-cap" style={{textAlign:"center",color:"rgba(255,255,255,.55)",fontSize:".78rem",marginTop:".65rem"}}></div>
        </div>
      </div>
      <div id="toast" style={{position:"fixed",bottom:"4.8rem",left:"50%",transform:"translateX(-50%) translateY(10px)",zIndex:6000,background:"#1a1020",color:"#fff",padding:".58rem 1.25rem",borderRadius:"50px",fontSize:".79rem",fontWeight:600,opacity:0,transition:"all .28s",pointerEvents:"none",whiteSpace:"nowrap"}}></div>
      <script dangerouslySetInnerHTML={{__html: JS}} />
    </main>
  );
}
