export const portalSlugPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizePortalSlug(value:string){const slug=value.trim().toLowerCase();if(!portalSlugPattern.test(slug)||slug.length>48)throw new Error("Invalid slug");return slug}

export function normalizeGoogleDestination(value:string|undefined){const destination=value?.trim();if(!destination)return undefined;const parsed=new URL(destination);if(parsed.protocol!=="https:")throw new Error("Google destination must use HTTPS");const googleHost=/(^|\.)google\.[a-z.]+$/.test(parsed.hostname),shortHost=parsed.hostname==="g.page"||parsed.hostname==="maps.app.goo.gl";if(!googleHost&&!shortHost)throw new Error("Use a Google review or Maps URL");return destination}
