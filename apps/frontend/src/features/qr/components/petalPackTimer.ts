type WaitMilestone = {
  at: number;
  text: string;
};

const WAIT_MILESTONES: WaitMilestone[] = [
  { at: 150, text: "Quan sát cánh sen dần mở trong nước." },
  { at: 90, text: "Màu trà bắt đầu ổn định." },
  { at: 30, text: "Chuẩn bị thưởng tách trà đầu tiên." },
  { at: 0, text: "Hương sen đã mở." },
];

export function getWaitMilestone(remaining: number) {
  if (remaining > 150) return "Nước vừa chạm búp sen. Chậm lại một nhịp.";
  if (remaining > 90) return WAIT_MILESTONES[0].text;
  if (remaining > 30) return WAIT_MILESTONES[1].text;
  if (remaining > 0) return WAIT_MILESTONES[2].text;
  return WAIT_MILESTONES[3].text;
}
