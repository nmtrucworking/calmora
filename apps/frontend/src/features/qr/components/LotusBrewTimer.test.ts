import { describe, expect, it } from "vitest";
import { getWaitMilestone } from "./petalPackTimer";

describe("Petal Pack wait milestones", () => {
  it.each([
    [180, "Nước vừa chạm búp sen. Chậm lại một nhịp."],
    [150, "Quan sát cánh sen dần mở trong nước."],
    [149, "Quan sát cánh sen dần mở trong nước."],
    [90, "Màu trà bắt đầu ổn định."],
    [89, "Màu trà bắt đầu ổn định."],
    [30, "Chuẩn bị thưởng tách trà đầu tiên."],
    [29, "Chuẩn bị thưởng tách trà đầu tiên."],
    [0, "Hương sen đã mở."],
  ])("maps %i seconds to its ritual cue", (remaining, expected) => {
    expect(getWaitMilestone(remaining)).toBe(expected);
  });
});
