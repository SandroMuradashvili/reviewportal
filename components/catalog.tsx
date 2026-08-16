"use client";

import Image from "next/image";
import { Check, PackageOpen, ShoppingBag } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { plans as defaultPlans,products as defaultProducts,whatsapp } from "@/lib/data";
import { copy,type Locale } from "@/lib/i18n";

export function ProductCatalog({locale,compact=false}:{locale:Locale;compact?:boolean}){
  const stored=useQuery(api.catalog.products),items=stored?.length?stored:defaultProducts;
  return <div className={`product-grid ${compact?"catalog-compact":""}`}>{items.map(item=>{
    const kind=item.kind??"individual",image="imageUrl" in item?item.imageUrl:item.image,detail="description" in item?item.description:item.detail,price=item.priceGel??(Number(String("priceDisplay" in item?item.priceDisplay:"").replace(/\D/g,""))||0),compare=item.compareAtPriceGel,stock="_id" in item?item.stockQuantity:item.stock;
    return <article className={`card product ${kind==="set"?"product-set":""}`} key={"_id" in item?item._id:item.slug}>
      <div className="product-image-wrap"><Image src={image} alt={item.name[locale]} width={700} height={525} unoptimized={image.startsWith("http")}/><span className="product-kind">{kind==="set"?<PackageOpen size={14}/>:<ShoppingBag size={14}/>} {kind==="set"?setLabel[locale]:productLabel[locale]}</span></div>
      <div className="product-body">{kind==="individual"&&stock!==undefined?<span className="stock">{stockLabel[locale]} · {stock}</span>:null}<h3>{item.name[locale]}</h3><p>{detail[locale]}</p><div className="catalog-price"><strong>₾{price}</strong>{compare?<del>₾{compare}</del>:null}</div><a className="button" target="_blank" rel="noreferrer" href={whatsapp(`Hello ReviewPortal, I'm interested in ${item.name.en}.`)}>{copy[locale].whatsapp}</a></div>
    </article>})}</div>;
}

export function PlanCatalog({locale}:{locale:Locale}){
  const stored=useQuery(api.catalog.packages),items=stored?.length?stored:defaultPlans;
  return <div className="plans">{items.map((item,index)=>{const description=item.description?.[locale]??"",features:readonly string[]="featuresLocalized" in item&&item.featuresLocalized?item.featuresLocalized[locale]:Array.isArray(item.features)?item.features:item.features[locale],price=item.priceGel??0,compare=item.compareAtPriceGel,name=item.name[locale];return <article className={`card plan ${index===0?"featured":""}`} key={"_id" in item?item._id:item.slug}><h3>{name}</h3><div className="catalog-price plan-price"><strong>{price>0?`₾${price}`:customLabel[locale]}</strong>{compare?<del>₾{compare}</del>:null}{price>0?<small>{monthLabel[locale]}</small>:null}</div><p>{description}</p><ul className="checks">{features.map(feature=><li key={feature}><Check size={16}/> {feature}</li>)}</ul><a className={`button ${index===0?"light":""}`} href={whatsapp(`Hello ReviewPortal, I'd like to activate the ${item.name.en} package.`)} target="_blank" rel="noreferrer">{activateLabel[locale]}</a></article>})}</div>;
}

const stockLabel={ka:"მარაგშია",en:"In stock",ru:"В наличии"},setLabel={ka:"ნაკრები",en:"Set",ru:"Набор"},productLabel={ka:"ცალკეული პროდუქტი",en:"Individual",ru:"Отдельный товар"},monthLabel={ka:" / თვე",en:" / month",ru:" / месяц"},customLabel={ka:"შეთანხმებით",en:"Custom",ru:"По запросу"},activateLabel={ka:"დაგვიკავშირდი",en:"Ask to activate",ru:"Подключить"};
