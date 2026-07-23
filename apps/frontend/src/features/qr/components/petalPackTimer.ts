type WaitMilestone = {
  at: number;
  text: string;
};

import type { Language } from "@app/providers/LanguageContext";

const WAIT_MILESTONES: WaitMilestone[] = [
  { at: 150, text: "Quan sát cánh sen dần mở trong nước." },
  { at: 90, text: "Màu trà bắt đầu ổn định." },
  { at: 30, text: "Chuẩn bị thưởng tách trà đầu tiên." },
  { at: 0, text: "Hương sen đã mở." },
];

export function getWaitMilestone(remaining: number) {
  return getLocalizedWaitMilestone(remaining, "vi");
}

export function getLocalizedWaitMilestone(remaining: number, language: Language) {
  if (language === "en") {
    if (remaining > 150) return "The water has just touched the lotus bud. Slow down for a moment.";
    if (remaining > 90) return "Watch the lotus petals gradually open in the water.";
    if (remaining > 30) return "The tea's colour is beginning to settle.";
    if (remaining > 0) return "Prepare to enjoy the first cup.";
    return "The lotus fragrance has opened.";
  }
  if (remaining > 150) return "Nước vừa chạm búp sen. Chậm lại một nhịp.";
  if (remaining > 90) return WAIT_MILESTONES[0].text;
  if (remaining > 30) return WAIT_MILESTONES[1].text;
  if (remaining > 0) return WAIT_MILESTONES[2].text;
  return WAIT_MILESTONES[3].text;
}
