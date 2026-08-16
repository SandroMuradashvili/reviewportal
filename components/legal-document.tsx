"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Locale } from "@/lib/i18n";
import type { LegalDoc } from "@/lib/legal";

export function LegalDocument({documentType,locale,fallback}:{documentType:"privacy"|"terms"|"acceptable-use";locale:Locale;fallback:LegalDoc}){const stored=useQuery(api.legalDocuments.document,{documentType,locale}),doc=stored?{title:stored.title,intro:stored.intro,sections:stored.sections.map(section=>[section.heading,section.body] as [string,string])}:fallback;return <><h1>{doc.title}</h1><p>{doc.intro}</p>{doc.sections.map(([heading,body])=><section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</>}
