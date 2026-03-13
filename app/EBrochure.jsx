"use client";

import { useState, useEffect, useRef } from "react";

const SLIDES = [
  { id: 1, image: "/photos/slide1.jpeg",  },
  { id: 2, image: "/photos/slide2.jpeg", },
  { id: 3, image: "/photos/slide7.jpeg",  },
  { id: 4, image: "/photos/slide4.jpeg", },
  { id: 5, image: "/photos/slide5.jpeg", },
  { id: 6, image: "/photos/slide3.jpeg", },
  { id: 7, image: "/photos/slide6.jpeg",},
  { id: 8, image: "/photos/slide8.jpeg",},
];

const TOTAL = SLIDES.length;

export default function EBrochure() {
  const [current, setCurrent] = useState(0);
  const [fading,  setFading]  = useState(false);

  // refs so keyboard/touch handlers always read latest values
  const currentRef = useRef(0);
  const lockRef    = useRef(false);
  const t1         = useRef(null);
  const t2         = useRef(null);
  const touchX     = useRef(null);

  // keep ref in sync
  currentRef.current = current;

  function goTo(idx) {
    if (lockRef.current) return;
    lockRef.current = true;
    setFading(true);
    clearTimeout(t1.current);
    clearTimeout(t2.current);
    t1.current = setTimeout(() => {
      setCurrent(idx);
      setFading(false);
      t2.current = setTimeout(() => { lockRef.current = false; }, 320);
    }, 260);
  }

  function next() { goTo((currentRef.current + 1) % TOTAL); }
  function prev() { goTo((currentRef.current - 1 + TOTAL) % TOTAL); }

  // touch
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchX.current = null;
  };

  // keyboard
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", handle);
    return () => {
      window.removeEventListener("keydown", handle);
      clearTimeout(t1.current);
      clearTimeout(t2.current);
    };
  }, []); // empty deps — always reads from refs, never stale

  const slide = SLIDES[current];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Barlow:wght@300;400;500;600&display=swap');
        html,body{margin:0;padding:0;overflow:hidden;background:#111;height:100%;}
        *,*::before,*::after{box-sizing:border-box;}

        .wrap{
          position:fixed;inset:0;
          display:flex;align-items:center;justify-content:center;
          background:#111;
        }
        .book{
          position:relative;
          width: min(calc((100vh - 40px) * 210/297), calc(100vw - 40px));
          height:min(calc(100vh - 40px), calc((100vw - 40px) * 297/210));
          background:#1a1a1a;
          box-shadow:0 24px 80px rgba(0,0,0,0.85);
          overflow:hidden;
          flex-shrink:0;
        }
        .bg{
          position:absolute;inset:0;
          transition:opacity 0.26s ease;
          z-index:1;
        }
        .bg img{width:100%;height:100%;object-fit:cover;object-position:center;display:block;}
        .bg::after{
          content:'';position:absolute;inset:0;
          background:linear-gradient(155deg,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0.10) 65%,rgba(0,0,0,0.02) 100%);
        }
        .fi{opacity:1;} .fo{opacity:0;}

        .topbar{
          position:absolute;top:0;left:0;right:0;
          padding:4% 6%;z-index:20;
          display:flex;justify-content:space-between;align-items:center;
        }
        .logo{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(11px,2.2vh,18px);font-weight:300;
          color:#fff;letter-spacing:0.22em;text-transform:uppercase;
        }
        .counter{font-size:clamp(9px,1.6vh,12px);letter-spacing:0.18em;color:rgba(255,255,255,0.5);}
        .counter b{color:#fff;font-weight:600;}

        .content{
          position:absolute;bottom:0;left:0;right:0;
          padding:0 6% 16%;z-index:20;
          transition:opacity 0.26s ease,transform 0.26s ease;
        }
        .ci{opacity:1;transform:translateY(0);}
        .co{opacity:0;transform:translateY(10px);}

        .tag{
          display:block;font-size:clamp(7px,1.2vh,10px);font-weight:600;
          letter-spacing:0.3em;color:#e8c97a;text-transform:uppercase;margin-bottom:2.5%;
        }
        .headline{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(20px,5vh,46px);font-weight:300;
          color:#fff;line-height:1.08;white-space:pre-line;margin-bottom:2.5%;
        }
        .subtitle{
          font-size:clamp(9px,1.5vh,13px);font-weight:300;
          color:rgba(255,255,255,0.68);line-height:1.7;margin-bottom:4%;
        }
        .cta{
          display:inline-flex;align-items:center;gap:8px;
          padding:clamp(6px,1.1vh,10px) clamp(12px,2vh,22px);
          border:1px solid rgba(255,255,255,0.38);background:transparent;color:#fff;
          font-family:'Barlow',sans-serif;font-size:clamp(7px,1.1vh,10px);
          font-weight:500;letter-spacing:0.2em;text-transform:uppercase;
          cursor:pointer;transition:background 0.2s,border-color 0.2s;
        }
        .cta:hover{background:rgba(232,201,122,0.15);border-color:#e8c97a;}
        .cta svg{transition:transform 0.2s;flex-shrink:0;}
        .cta:hover svg{transform:translateX(3px);}

        .nav{
          position:absolute;bottom:4%;left:0;right:0;
          padding:0 6%;z-index:20;
          display:flex;align-items:center;justify-content:space-between;
        }
        .dots{display:flex;gap:5px;align-items:center;}
        .dot{
          height:4px;width:4px;border-radius:2px;
          background:rgba(255,255,255,0.28);
          border:none;cursor:pointer;
          transition:width 0.3s,background 0.3s;
        }
        .dot.on{background:#e8c97a;width:16px;}

        .arrows{display:flex;gap:6px;}
        .arr{
          width:clamp(26px,4vh,38px);height:clamp(26px,4vh,38px);
          border:1px solid rgba(255,255,255,0.28);
          background:rgba(0,0,0,0.45);
          color:#fff;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:border-color 0.2s,background 0.2s;
          flex-shrink:0;
        }
        .arr:hover{border-color:#e8c97a;background:rgba(232,201,122,0.15);}

        .bar{
          position:absolute;bottom:0;left:0;height:2px;
          background:#e8c97a;z-index:20;
          transition:width 0.4s ease;
        }
      `}</style>

      <div className="wrap">
        <div className="book" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

          <div className={`bg ${fading ? "fo" : "fi"}`}>
            <img src={slide.image} alt={`Slide ${current + 1}`} />
          </div>


          <div className="nav">
            <div className="dots">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`dot${i === current ? " on" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <div className="arrows">
              <button className="arr" onClick={prev} aria-label="Prev">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              <button className="arr" onClick={next} aria-label="Next">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="bar" style={{ width: `${((current + 1) / TOTAL) * 100}%` }} />
        </div>
      </div>
    </>
  );
}