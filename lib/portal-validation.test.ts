import { describe,expect,it } from "vitest";
import { normalizeGoogleDestination,normalizePortalSlug,slugFromBusinessName } from "./portal-validation";

describe("normalizePortalSlug",()=>{
  it("normalizes safe slugs",()=>expect(normalizePortalSlug("  My-Business ")).toBe("my-business"));
  it.each(["has spaces","../admin","UPPER_case","-leading"])("rejects unsafe slug %s",value=>expect(()=>normalizePortalSlug(value)).toThrow("Invalid slug"));
});

describe("slugFromBusinessName",()=>{
  it("creates an editable Latin slug from Georgian",()=>expect(slugFromBusinessName("ღვინო და კომპანია")).toBe("ghvino-da-kompania"));
  it("creates an editable Latin slug from Russian",()=>expect(slugFromBusinessName("Ресторан Тбилиси")).toBe("restoran-tbilisi"));
});

describe("normalizeGoogleDestination",()=>{
  it.each(["https://g.page/r/example/review","https://share.google/example","https://youtube.com/watch?v=example","https://business.example/reviews"])("accepts an HTTPS destination %s",value=>expect(normalizeGoogleDestination(value)).toBe(value));
  it.each(["http://google.com/maps","not a url","javascript:alert(1)"])("rejects unsafe destination %s",value=>expect(()=>normalizeGoogleDestination(value)).toThrow());
  it("allows an unconfigured destination",()=>expect(normalizeGoogleDestination(undefined)).toBeUndefined());
});
