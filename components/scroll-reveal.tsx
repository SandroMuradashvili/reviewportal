"use client";

import { useEffect,useRef,useState } from "react";

export function ScrollReveal({children,className="",delay=0}:{children:React.ReactNode;className?:string;delay?:number}){
  const ref=useRef<HTMLDivElement>(null),[visible,setVisible]=useState(false);
  useEffect(()=>{const node=ref.current;if(!node)return;const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.16,rootMargin:"-4% 0px -8%"});observer.observe(node);return()=>observer.disconnect()},[]);
  return <div ref={ref} className={`scroll-reveal ${visible?"is-visible":""} ${className}`} style={{"--reveal-delay":`${delay}ms`} as React.CSSProperties}>{children}</div>
}
