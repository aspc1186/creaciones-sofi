import { getCatalogProducts } from "@/lib/catalog";
import { STORE, PAYMENTS, TESTIMONIALS, CATEGORIES, SIZES, fmt } from "@/config/store";
import Image from "next/image";

export default function Home() {
  const products = getCatalogProducts();
  const counts: Record<string, number> = {};
  products.forEach((p) => { counts[p.catId] = (counts[p.catId] || 0) + 1; });
  const usedCats = CATEGORIES.filter((c) => counts[c.id]);
  const waUrl = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(STORE.waMessage)}`;
  const activePayments = PAYMENTS.filter((p) => p.active && p.label);

  return (
    <main>
      {/* HEADER */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,height:58,padding:"0 2rem",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid #efe8ed"}}>
        <a href="#inicio" style={{display:"flex",alignItems:"center",gap:".6rem",textDecoration:"none"}}>
          <Image src="/logo.webp" alt="Creaciones Sofi" width={38} height={38} style={{borderRadius:"50%",objectFit:"cover"}} priority />
          <span style={{fontFamily:"var(--serif)",fontSize:"1.35rem",fontWeight:700,color:"#111"}}>
            Creaciones <em style={{color:"#ff2d87",fontStyle:"italic"}}>Sofi</em>
          </span>
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
        <div style={{position:"absolute",width:560,height:560,borderRadius:"50%",filter:"blur(70px)",opacity:.28,background:"#ff2d87",top:"-120px",right:"-120px",animation:"blobMove 14s ease-in-out infinite"}} />
        <div style={{position:"absolute",width:380,height:380,borderRadius:"50%",filter:"blur(70px)",opacity:.28,background:"#f0b429",bottom:"-80px",left:"-80px",animation:"blobMove 18s ease-in-out infinite reverse"}} />

        <div style={{position:"relative",zIndex:2,display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",maxWidth:1200,width:"100%",alignItems:"center"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:".4rem",background:"rgba(255,45,135,.1)",border:"1px solid rgba(255,45,135,.22)",borderRadius:"50px",padding:".33rem .9rem",fontSize:".7rem",fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#ff2d87",marginBottom:"1.1rem"}}>💗 Nueva Colección 2026</div>
            <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(2.8rem,5.5vw,5rem)",fontWeight:700,lineHeight:.98,marginBottom:".7rem",color:"#111"}}>
              Moda <em style={{color:"#ff2d87",fontStyle:"italic"}}>Femenina</em>
              <span style={{display:"block",fontStyle:"italic",color:"#ff2d87",fontSize:"clamp(2.2rem,4.5vw,4rem)"}}>Creaciones Sofi</span>
            </h1>
            <p style={{fontSize:"1rem",color:"#4a3a42",fontStyle:"italic",marginBottom:".7rem"}}>con Estilo y Elegancia</p>
            <p style={{fontSize:".92rem",color:"#8a7080",lineHeight:1.8,maxWidth:440,marginBottom:"1.8rem"}}>{STORE.description}</p>
            <div style={{display:"flex",gap:".8rem",flexWrap:"wrap",marginBottom:"1.4rem"}}>
              <a href="#catalogo" style={{padding:".78rem 2rem",background:"#ff2d87",color:"#fff",borderRadius:"50px",fontWeight:700,fontSize:".9rem",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:".4rem"}}>👗 Ver Catálogo</a>
              <a href={waUrl} target="_blank" rel="noopener" style={{padding:".78rem 2rem",background:"transparent",color:"#111",border:"2px solid rgba(0,0,0,.16)",borderRadius:"50px",fontWeight:700,fontSize:".9rem",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:".4rem"}}>💬 WhatsApp</a>
            </div>
            <div style={{display:"flex",gap:".5rem",flexWrap:"wrap",marginBottom:"1.2rem"}}>
              {[{href:STORE.instagram,lbl:"📸 Instagram"},{href:STORE.facebook,lbl:"📘 Facebook"},{href:`https://wa.me/${STORE.whatsapp}`,lbl:"💬 WhatsApp"}].map(s=>(
                <a key={s.href} href={s.href} target="_blank" rel="noopener" style={{display:"flex",alignItems:"center",gap:".3rem",padding:".26rem .65rem",background:"rgba(255,255,255,.7)",border:"1px solid rgba(255,255,255,.8)",borderRadius:"50px",fontSize:".72rem",fontWeight:600,color:"#4a3a42",textDecoration:"none"}}>{s.lbl}</a>
              ))}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:".4rem",marginBottom:"1.5rem"}}>
              {activePayments.map(p=>(
                <span key={p.id} style={{display:"inline-flex",alignItems:"center",gap:".3rem",background:"rgba(255,255,255,.65)",border:"1px solid rgba(255,255,255,.8)",borderRadius:"50px",padding:".26rem .72rem",fontSize:".7rem",fontWeight:600,color:"#4a3a42"}}>{p.icon} {p.label}</span>
              ))}
            </div>
            <div style={{display:"flex",gap:"1.8rem",paddingTop:"1.4rem",borderTop:"1px solid rgba(255,45,135,.14)"}}>
              {[{n:"500+",l:"Clientas felices"},{n:"100+",l:"Estilos únicos"},{n:"5★",l:"Calificación"}].map(s=>(
                <div key={s.l}>
                  <span style={{fontFamily:"var(--serif)",fontSize:"1.7rem",fontWeight:700,color:"#ff2d87",display:"block",lineHeight:1}}>{s.n}</span>
                  <span style={{fontSize:".68rem",letterSpacing:1,textTransform:"uppercase",color:"#8a7080"}}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"center"}}>
            <div style={{position:"relative",width:"min(320px,84vw)",height:"min(380px,96vw)"}}>
              <div style={{position:"absolute",width:"65%",height:"72%",top:"2%",left:"2%",borderRadius:22,overflow:"hidden",boxShadow:"0 16px 48px rgba(196,0,106,.22)",background:"#fff",zIndex:1,transform:"rotate(-5deg)",opacity:.8}}><div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#ffd6eb,#ff2d87)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"4.5rem"}}>👘</div></div>
              <div style={{position:"absolute",width:"65%",height:"72%",top:"2%",right:"2%",borderRadius:22,overflow:"hidden",boxShadow:"0 16px 48px rgba(196,0,106,.22)",background:"#fff",zIndex:2,transform:"rotate(5deg)",opacity:.8}}><div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#ffd6eb,#ff2d87)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"4.5rem"}}>👙</div></div>
              <div style={{position:"absolute",width:"78%",height:"85%",top:"8%",left:"11%",borderRadius:22,overflow:"hidden",boxShadow:"0 16px 48px rgba(196,0,106,.22)",background:"#fff",zIndex:3}}><div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#ffd6eb,#ff2d87)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"4.5rem"}}>👗</div></div>
              <div style={{position:"absolute",bottom:"5%",left:"-5%",background:"#fff",borderRadius:14,padding:".5rem .85rem",boxShadow:"0 6px 32px rgba(196,0,106,.16)",fontSize:".74rem",fontWeight:700,display:"flex",alignItems:"center",gap:".3rem",whiteSpace:"nowrap",zIndex:4,animation:"floatTag 3s ease-in-out infinite"}}>✨ Nueva Colección</div>
              <div style={{position:"absolute",top:"5%",right:"-5%",background:"#fff",borderRadius:14,padding:".5rem .85rem",boxShadow:"0 6px 32px rgba(196,0,106,.16)",fontSize:".74rem",fontWeight:700,display:"flex",alignItems:"center",gap:".3rem",whiteSpace:"nowrap",zIndex:4,animation:"floatTag 3s ease-in-out infinite",animationDelay:".8s"}}>💗 +100 Estilos</div>
              <div style={{position:"absolute",top:"42%",right:"-8%",background:"#fff",borderRadius:14,padding:".5rem .85rem",boxShadow:"0 6px 32px rgba(196,0,106,.16)",fontSize:".74rem",fontWeight:700,display:"flex",alignItems:"center",gap:".3rem",whiteSpace:"nowrap",zIndex:4,animation:"floatTag 3s ease-in-out infinite",animationDelay:"1.5s"}}>🌟 Premium</div>
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
          <div id="fbar" style={{display:"flex",gap:".4rem",overflowX:"auto",paddingBottom:".4rem",marginBottom:"1.6rem",position:"sticky",top:58,zIndex:100,background:"#faf7f8",paddingTop:".7rem",scrollbarWidth:"none"}}>
            <button data-cat="todos" style={{flexShrink:0,padding:".38rem .85rem",borderRadius:"50px",background:"#ff2d87",border:"1.5px solid #ff2d87",color:"#fff",fontSize:".76rem",fontWeight:600,whiteSpace:"nowrap",cursor:"pointer"}}>
              <strong>{products.length}</strong> Todo
            </button>
            {usedCats.map(cat=>(
              <button key={cat.id} data-cat={cat.id} style={{flexShrink:0,padding:".38rem .85rem",borderRadius:"50px",background:"#fff",border:"1.5px solid #d4bfca",color:"#4a3a42",fontSize:".76rem",fontWeight:600,whiteSpace:"nowrap",cursor:"pointer"}}>
                <strong>{counts[cat.id]}</strong> {cat.label}
              </button>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:"1.4rem",alignItems:"start"}}>
            <div>
              <div id="pgrid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:"1rem"}}>
                {products.length === 0 ? (
                  <div style={{gridColumn:"1/-1",textAlign:"center",padding:"4rem 2rem",background:"#fff",borderRadius:22,border:"2px dashed #d4bfca"}}>
                    <span style={{fontSize:"3rem",display:"block",marginBottom:".9rem"}}>📂</span>
                    <h3 style={{fontFamily:"var(--serif)",fontSize:"1.4rem",color:"#ff2d87",marginBottom:".45rem"}}>Agrega tus fotos</h3>
                    <p style={{fontSize:".86rem",color:"#8a7080",lineHeight:1.7,maxWidth:380,margin:"0 auto"}}>
                      Copia tus fotos dentro de <strong style={{color:"#ff2d87"}}>public/catalog/</strong> y vuelve a publicar en Vercel.
                    </p>
                  </div>
                ) : products.map(p=>(
                  <div key={p.id} className="pcard" data-cat={p.catId} style={{background:"#fff",borderRadius:22,overflow:"hidden",boxShadow:"0 2px 16px rgba(196,0,106,.09)",border:"1.5px solid transparent"}}>
                    <div className="pc-img" data-src={p.file} data-name={`${p.name} — ${p.ref}`} style={{position:"relative",overflow:"hidden",aspectRatio:"1/1",background:"#fff5f9",cursor:"zoom-in"}}>
                      <Image src={p.file} alt={p.name} fill style={{objectFit:"cover"}} sizes="(max-width:480px) 50vw,200px" />
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
                      <button className="btn-add" data-pid={p.id} data-name={p.name} data-ref={p.ref} data-price={p.price} data-file={p.file} style={{width:"100%",padding:".52rem",background:"#ff2d87",color:"#fff",border:"none",borderRadius:"50px",fontSize:".76rem",fontWeight:800,letterSpacing:".5px",textTransform:"uppercase",cursor:"pointer"}}>
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CARRITO */}
            <aside id="cart-side" style={{background:"#fff",borderRadius:22,border:"1.5px solid #efe8ed",padding:"1.2rem",position:"sticky",top:71,boxShadow:"0 2px 16px rgba(196,0,106,.09)"}}>
              <span style={{fontSize:".6rem",fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:"#ff2d87",display:"block",marginBottom:".35rem"}}>CARRITO</span>
              <div style={{fontFamily:"var(--serif)",fontSize:"1.3rem",fontWeight:700,marginBottom:".38rem",color:"#111"}}>Tu carrito te espera</div>
              <p id="c-hint" style={{fontSize:".8rem",color:"#8a7080",lineHeight:1.6,marginBottom:".28rem"}}>Elige tu talla, ajusta la cantidad y arma tu pedido en pocos toques.</p>
              <p id="c-hint2" style={{fontSize:".72rem",color:"#d4bfca",fontStyle:"italic"}}>Los productos aparecen aquí al hacer clic en &quot;Agregar al carrito&quot;.</p>
              <div id="c-list" style={{display:"flex",flexDirection:"column",gap:".5rem",margin:".85rem 0"}}></div>
              <div id="c-foot" style={{display:"none"}}>
                <hr style={{border:"none",borderTop:"1px solid #efe8ed",margin:".65rem 0"}} />
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".8rem"}}>
                  <span style={{fontSize:".78rem",color:"#8a7080"}}>Total estimado</span>
                  <span id="c-total" style={{fontFamily:"var(--serif)",fontSize:"1.4rem",fontWeight:700,color:"#ff2d87"}}>$0</span>
                </div>
                <a id="c-wa" href="#" target="_blank" rel="noopener" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".4rem",width:"100%",padding:".62rem",background:"#25d366",color:"#fff",borderRadius:"50px",fontSize:".8rem",fontWeight:800,letterSpacing:".5px",textTransform:"uppercase",textDecoration:"none",marginBottom:".42rem"}}>
                  💬 Pedir por WhatsApp
                </a>
                <button id="c-clear" style={{width:"100%",padding:".4rem",background:"none",border:"1.5px solid #d4bfca",borderRadius:"50px",fontSize:".72rem",fontWeight:600,color:"#8a7080",cursor:"pointer"}}>
                  🗑 Vaciar carrito
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* MOBILE CART BAR */}
      <div id="mob-bar" style={{display:"none",position:"fixed",bottom:0,left:0,right:0,zIndex:800,background:"#ff2d87",color:"#fff",padding:".75rem 1.5rem",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
        <span style={{fontWeight:700,fontSize:".84rem"}}>🛒 Ver Carrito</span>
        <span id="mob-cnt" style={{background:"rgba(255,255,255,.22)",borderRadius:"50px",padding:".18rem .65rem",fontWeight:800,fontSize:".76rem"}}>0 items</span>
      </div>

      {/* STRIP */}
      <div style={{background:"#1a1020",padding:"2.2rem 2rem"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",gap:"2.8rem"}}>
          {[{n:"500+",l:"Clientas satisfechas"},{n:"100+",l:"Modelos exclusivos"},{n:"3+",l:"Años de experiencia"},{n:"24h",l:"Atención WhatsApp"}].map(s=>(
            <div key={s.l} style={{textAlign:"center",color:"#fff"}}>
              <span style={{fontFamily:"var(--serif)",fontSize:"2.3rem",fontWeight:700,color:"#ff2d87",display:"block",lineHeight:1}}>{s.n}</span>
              <span style={{fontSize:".68rem",letterSpacing:2,textTransform:"uppercase",opacity:.55}}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIOS */}
      <section id="testimonios" style={{padding:"72px 2rem",background:"#fff5f9"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.2rem"}}>
            <span style={{fontSize:".68rem",fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#ff2d87",display:"block",marginBottom:".35rem"}}>✦ Lo que dicen ✦</span>
            <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(1.8rem,3.5vw,2.5rem)",fontWeight:700,color:"#111"}}>
              Nuestras <em style={{color:"#ff2d87",fontStyle:"italic"}}>Clientas Felices</em>
            </h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:"1.1rem"}}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:22,padding:"1.5rem",boxShadow:"0 2px 16px rgba(196,0,106,.09)",position:"relative"}}>
                <span style={{position:"absolute",top:".9rem",right:"1.2rem",fontFamily:"var(--serif)",fontSize:"3.2rem",lineHeight:1,color:"#ffd6eb"}}>❝</span>
                <div style={{color:"#f0b429",marginBottom:".65rem",fontSize:".9rem"}}>{"★".repeat(t.stars)}</div>
                <p style={{fontSize:".86rem",lineHeight:1.75,color:"#4a3a42",marginBottom:"1.1rem",fontStyle:"italic"}}>&ldquo;{t.text}&rdquo;</p>
                <div style={{display:"flex",alignItems:"center",gap:".65rem"}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#ffd6eb,#ff2d87)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",flexShrink:0}}>{t.avatar}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:".83rem",color:"#111"}}>{t.name}</div>
                    <div style={{fontSize:".71rem",color:"#8a7080"}}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{padding:"72px 2rem",background:"#fff"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.2rem"}}>
            <span style={{fontSize:".68rem",fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:"#ff2d87",display:"block",marginBottom:".35rem"}}>✦ Encuéntranos ✦</span>
            <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(1.8rem,3.5vw,2.5rem)",fontWeight:700,color:"#111"}}>
              Estamos para <em style={{color:"#ff2d87",fontStyle:"italic"}}>Ti</em>
            </h2>
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
                <div>
                  <div style={{fontSize:".62rem",fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#8a7080",marginBottom:".12rem"}}>{s.lbl}</div>
                  <div style={{fontFamily:"var(--serif)",fontSize:"1rem",fontWeight:700}}>{s.val}</div>
                </div>
                <span style={{color:"#ff2d87",marginLeft:"auto",fontSize:".9rem"}}>→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
          <div>
            <div style={{fontSize:".68rem",fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#ff2d87",marginBottom:".9rem"}}>Navegación</div>
            <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:".52rem"}}>
              {[["inicio","Inicio"],["categorias","Categorías"],["catalogo","Catálogo"],["contacto","Contacto"]].map(([id,lbl])=>(
                <li key={id}><a href={`#${id}`} style={{color:"rgba(255,255,255,.38)",fontSize:".8rem",textDecoration:"none"}}>{lbl}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{fontSize:".68rem",fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#ff2d87",marginBottom:".9rem"}}>Categorías</div>
            <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:".52rem"}}>
              {CATEGORIES.slice(0,5).map(c=>(
                <li key={c.id}><a href="#catalogo" style={{color:"rgba(255,255,255,.38)",fontSize:".8rem",textDecoration:"none"}}>{c.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{fontSize:".68rem",fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#ff2d87",marginBottom:".9rem"}}>Contacto</div>
            <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:".52rem"}}>
              <li><a href={`https://wa.me/${STORE.whatsapp}`} style={{color:"rgba(255,255,255,.38)",fontSize:".8rem",textDecoration:"none"}}>3223815323</a></li>
              <li><a href={STORE.facebook} target="_blank" rel="noopener" style={{color:"rgba(255,255,255,.38)",fontSize:".8rem",textDecoration:"none"}}>Facebook</a></li>
              <li><a href={STORE.instagram} target="_blank" rel="noopener" style={{color:"rgba(255,255,255,.38)",fontSize:".8rem",textDecoration:"none"}}>Instagram</a></li>
              <li><span style={{color:"rgba(255,255,255,.38)",fontSize:".8rem"}}>Medellín, Antioquia</span></li>
            </ul>
          </div>
        </div>
        <div style={{maxWidth:1100,margin:"0 auto",paddingTop:"1.4rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:".7rem"}}>
          <p style={{fontSize:".73rem",color:"rgba(255,255,255,.22)"}}>© 2026 Creaciones Sofi — Todos los derechos reservados.</p>
          <p style={{fontSize:".73rem",color:"rgba(255,255,255,.22)"}}>📍 Medellín, Antioquia, Colombia 🇨🇴</p>
        </div>
      </footer>

      {/* WA FLOTANTE */}
      <a href={waUrl} target="_blank" rel="noopener" style={{position:"fixed",bottom:"1.8rem",right:"1.8rem",zIndex:700,width:52,height:52,background:"linear-gradient(135deg,#25d366,#128c7e)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",textDecoration:"none",boxShadow:"0 4px 18px rgba(37,211,102,.5)"}}>💬</a>

      {/* LIGHTBOX */}
      <div id="lb" style={{display:"none",position:"fixed",inset:0,background:"rgba(0,0,0,.93)",zIndex:5000,alignItems:"center",justifyContent:"center",padding:"1rem"}}>
        <div style={{position:"relative",maxWidth:"min(90vw,700px)"}}>
          <button id="lb-cls" style={{position:"absolute",top:-40,right:0,background:"none",border:"none",color:"rgba(255,255,255,.7)",fontSize:"1.9rem",cursor:"pointer",lineHeight:1}}>✕</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="lb-img" src="" alt="" style={{width:"100%",maxHeight:"88vh",objectFit:"contain",borderRadius:14,display:"block"}} />
          <div id="lb-cap" style={{textAlign:"center",color:"rgba(255,255,255,.55)",fontSize:".78rem",marginTop:".65rem"}}></div>
        </div>
      </div>

      {/* TOAST */}
      <div id="toast" style={{position:"fixed",bottom:"4.8rem",left:"50%",transform:"translateX(-50%) translateY(10px)",zIndex:6000,background:"#1a1020",color:"#fff",padding:".58rem 1.25rem",borderRadius:"50px",fontSize:".79rem",fontWeight:600,opacity:0,transition:"all .28s",pointerEvents:"none",border:"1.5px solid rgba(255,45,135,.28)",whiteSpace:"nowrap"}}></div>

      {/* CLIENT JS */}
      <script dangerouslySetInnerHTML={{__html:`(function(){
  var cart=[], WA="${`https://wa.me/${STORE.whatsapp}`}";
  window.addEventListener('scroll',function(){document.getElementById('hdr').style.boxShadow=scrollY>30?'0 2px 16px rgba(196,0,106,.09)':'none';});
  document.addEventListener('click',function(e){
    var t=e.target;
    if(t.classList.contains('sz')){
      var pid=t.dataset.pid;
      document.querySelectorAll('.sz[data-pid="'+pid+'"]').forEach(function(b){b.style.background='#fff';b.style.borderColor='#d4bfca';b.style.color='#111';});
      t.style.background='#ff2d87';t.style.borderColor='#ff2d87';t.style.color='#fff';
    }
    if(t.classList.contains('qbtn')){
      var pid=t.dataset.pid,d=parseInt(t.dataset.d);
      var el=document.getElementById('q-'+pid);
      if(el)el.textContent=Math.max(1,Math.min(99,parseInt(el.textContent)+d));
    }
    if(t.classList.contains('btn-add')){
      var pid=t.dataset.pid,name=t.dataset.name,ref=t.dataset.ref,price=parseInt(t.dataset.price),file=t.dataset.file;
      var sz=document.querySelector('.sz[data-pid="'+pid+'"][style*="#ff2d87"]')||document.querySelector('.sz[data-pid="'+pid+'"]');
      var size=sz?sz.textContent.trim():'S';
      var qty=parseInt(document.getElementById('q-'+pid).textContent);
      var hit=cart.find(function(c){return c.pid===pid&&c.size===size;});
      if(hit)hit.qty+=qty;else cart.push({pid:pid,name:name,ref:ref,price:price,file:file,size:size,qty:qty});
      renderCart();toast('\\u2705 '+name+' T.'+size+' \\xd7'+qty);
    }
    if(t.classList.contains('ci-rm')){cart.splice(parseInt(t.dataset.i),1);renderCart();}
    if(t.id==='c-clear'){cart=[];renderCart();}
    if(t.id==='lb'||t.id==='lb-cls'){document.getElementById('lb').style.display='none';document.body.style.overflow='';}
    if(t.closest('#mob-bar')||t.closest('#cart-hdr-btn'))toggleCart();
    var iw=t.closest('.pc-img');
    if(iw){var img=iw.querySelector('img');if(img){document.getElementById('lb-img').src=img.src;document.getElementById('lb-cap').textContent=iw.dataset.name||'';document.getElementById('lb').style.display='flex';document.body.style.overflow='hidden';}}
    var fb=document.querySelectorAll('#fbar button');
    fb.forEach(function(b){
      if(b===t){
        b.style.background='#ff2d87';b.style.borderColor='#ff2d87';b.style.color='#fff';
        var cat=b.dataset.cat;
        var title=document.getElementById('cat-title');
        if(title)title.textContent=cat==='todos'?'Cat\\u00e1logo':cat.replace(/-/g,' ').replace(/\\b\\w/g,function(c){return c.toUpperCase();});
        document.querySelectorAll('.pcard').forEach(function(c){c.style.display=(cat==='todos'||c.dataset.cat===cat)?'':'none';});
      } else {b.style.background='#fff';b.style.borderColor='#d4bfca';b.style.color='#4a3a42';}
    });
  });
  function renderCart(){
    var l=document.getElementById('c-list'),f=document.getElementById('c-foot'),h=document.getElementById('c-hint'),h2=document.getElementById('c-hint2'),bd=document.getElementById('cbadge'),bar=document.getElementById('mob-bar'),cnt=document.getElementById('mob-cnt');
    var total=cart.reduce(function(s,c){return s+(c.price||0)*c.qty;},0),n=cart.reduce(function(s,c){return s+c.qty;},0);
    if(!cart.length){l.innerHTML='';f.style.display='none';h.style.display='block';h2.style.display='block';bd.style.display='none';bar.style.display='none';return;}
    h.style.display='none';h2.style.display='none';f.style.display='block';
    bd.textContent=n;bd.style.display='flex';bar.style.display='flex';cnt.textContent=n+' item'+(n>1?'s':'');
    l.innerHTML=cart.map(function(c,i){return '<div style="display:flex;align-items:center;gap:.5rem;background:#faf7f8;border-radius:14px;padding:.48rem"><img src="'+c.file+'" alt="" style="width:40px;height:40px;border-radius:8px;object-fit:cover;flex-shrink:0"><div style="flex:1;min-width:0"><div style="font-size:.75rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#111">'+c.name+'</div><div style="font-size:.67rem;color:#8a7080">'+c.ref+' T.'+c.size+' \\xd7'+c.qty+' $'+(c.price*c.qty).toLocaleString('es-CO')+'</div></div><button class="ci-rm" data-i="'+i+'" style="background:none;border:none;cursor:pointer;color:#d4bfca;font-size:.82rem;flex-shrink:0">\\u2715</button></div>';}).join('');
    document.getElementById('c-total').textContent='$ '+total.toLocaleString('es-CO');
    var msg='\\u00a1Hola Creaciones Sofi! \\ud83d\\udc97\\n\\nPedido:\\n\\n';
    cart.forEach(function(c,i){msg+=(i+1)+'. '+c.name+' '+c.ref+' T.'+c.size+' \\xd7'+c.qty+' $'+(c.price*c.qty).toLocaleString('es-CO')+'\\n';});
    msg+='\\nTotal: $'+total.toLocaleString('es-CO')+'\\n\\n\\u00a1Gracias!';
    document.getElementById('c-wa').href=WA+'?text='+encodeURIComponent(msg);
  }
  function toggleCart(){var cs=document.getElementById('cart-side');cs.style.transform=cs.style.transform==='translateY(0px)'?'translateY(100%)':'translateY(0px)';}
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){document.getElementById('lb').style.display='none';document.body.style.overflow='';}});
  var tt;function toast(msg){var t=document.getElementById('toast');t.textContent=msg;t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';clearTimeout(tt);tt=setTimeout(function(){t.style.opacity='0';t.style.transform='translateX(-50%) translateY(10px)';},2800);}
  if(window.innerWidth<=900){var cs=document.getElementById('cart-side');cs.style.position='fixed';cs.style.bottom='0';cs.style.left='0';cs.style.right='0';cs.style.zIndex='799';cs.style.borderRadius='22px 22px 0 0';cs.style.maxHeight='65vh';cs.style.overflowY='auto';cs.style.transform='translateY(100%)';cs.style.transition='transform .25s ease';cs.style.top='auto';}
})();`}} />
    </main>
  );
}
