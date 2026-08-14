"use client";
import { Star } from "lucide-react";
import { useState } from "react";
export function StarDemo({size=34}:{size?:number}) { const [rating,setRating]=useState(0); return <div className="stars" role="radiogroup" aria-label="Rating">{[1,2,3,4,5].map(n=><button key={n} className={`star ${n<=rating?"active":""}`} onClick={()=>setRating(n)} role="radio" aria-checked={rating===n} aria-label={`${n} out of 5`}><Star size={size} fill={n<=rating?"currentColor":"none"}/></button>)}</div> }
