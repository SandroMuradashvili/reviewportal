import { describe,expect,it } from "vitest";
import { normalizeGoogleDestination,normalizePortalSlug } from "./portal-validation";

describe("normalizePortalSlug",()=>{
  it("normalizes safe slugs",()=>expect(normalizePortalSlug("  My-Business ")).toBe("my-business"));
  it.each(["has spaces","../admin","UPPER_case","-leading"])("rejects unsafe slug %s",value=>expect(()=>normalizePortalSlug(value)).toThrow("Invalid slug"));
});

describe("normalizeGoogleDestination",()=>{
  it.each(["https://g.page/r/example/review","https://maps.app.goo.gl/example","https://www.google.com/maps/place/example"])("accepts supported Google URL %s",value=>expect(normalizeGoogleDestination(value)).toBe(value));
  it.each(["http://google.com/maps","https://evil.example/review","javascript:alert(1)"])("rejects unsafe destination %s",value=>expect(()=>normalizeGoogleDestination(value)).toThrow());
  it("allows an unconfigured destination",()=>expect(normalizeGoogleDestination(undefined)).toBeUndefined());
});
