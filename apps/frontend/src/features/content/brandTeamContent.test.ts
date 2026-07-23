import { describe, expect, it } from "vitest";
import { aboutContent } from "@features/about/data/aboutContent";
import { teamContent, teamMembers } from "@features/team/data/teamContent";
import { luxuryLayoutCopy } from "./luxuryCopy";

const retiredNames = [
  "Lê Tiêu Tấn Đạt",
  "Đào Nguyệt Ánh",
  "Nguyễn Hoàng Thiên Phú",
  "Bảo Nguyệt Anh",
];

const unsupportedClaims = [
  "công ty Calmora",
  "đã kiểm chứng",
  "chuẩn quốc tế",
  "an toàn tuyệt đối",
];

describe("brand and team public content", () => {
  it("contains exactly the three confirmed team members", () => {
    expect(teamMembers.map((member) => member.name)).toEqual([
      "Nguyễn Minh Trúc",
      "Trần Quốc Khánh",
      "Nguyễn Ngọc Thảo Vy",
    ]);
  });

  it("does not publish retired names or unsupported claims", () => {
    const publicContent = JSON.stringify({ aboutContent, teamContent, teamMembers });

    retiredNames.forEach((name) => expect(publicContent).not.toContain(name));
    unsupportedClaims.forEach((claim) => expect(publicContent.toLocaleLowerCase("vi")).not.toContain(claim.toLocaleLowerCase("vi")));
  });

  it("exposes the brand in desktop navigation and the team in mobile and footer navigation", () => {
    for (const language of ["vi", "en"] as const) {
      const layout = luxuryLayoutCopy[language];
      expect(layout.navigation.some((item) => item.href === "/about")).toBe(true);
      expect(layout.navigation.some((item) => item.href === "/team")).toBe(false);
      expect(layout.mobileNavigation.some((item) => item.href === "/team")).toBe(true);
      expect(layout.footerGroups.some((group) => group.links.some((item) => item.href === "/team"))).toBe(true);
    }
  });
});
