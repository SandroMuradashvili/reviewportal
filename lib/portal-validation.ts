export const portalSlugPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizePortalSlug(value:string){const slug=value.trim().toLowerCase();if(!portalSlugPattern.test(slug)||slug.length>48)throw new Error("Invalid slug");return slug}

const transliteration:Record<string,string>={ა:"a",ბ:"b",გ:"g",დ:"d",ე:"e",ვ:"v",ზ:"z",თ:"t",ი:"i",კ:"k",ლ:"l",მ:"m",ნ:"n",ო:"o",პ:"p",ჟ:"zh",რ:"r",ს:"s",ტ:"t",უ:"u",ფ:"p",ქ:"k",ღ:"gh",ყ:"q",შ:"sh",ჩ:"ch",ც:"ts",ძ:"dz",წ:"ts",ჭ:"ch",ხ:"kh",ჯ:"j",ჰ:"h",а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"i",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"sh",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"};
export function slugFromBusinessName(value:string){return value.normalize("NFKD").toLowerCase().split("").map(character=>transliteration[character]??character).join("").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48).replace(/-$/g,"")}

export function normalizeGoogleDestination(value:string|undefined){const destination=value?.trim();if(!destination)return undefined;let parsed:URL;try{parsed=new URL(destination)}catch{throw new Error("Enter a complete URL beginning with https://")}if(parsed.protocol!=="https:")throw new Error("Destination URL must use HTTPS");return destination}
