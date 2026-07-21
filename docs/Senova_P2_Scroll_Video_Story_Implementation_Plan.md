# SENOVA P2 — KẾ HOẠCH TÍCH HỢP SCROLL-VIDEO STORY LUXURY

> **Dự án:** Calmora / Senova  
> **Route:** `/story`  
> **Frontend:** React 19 + TypeScript + Vite + Framer Motion  
> **Mức ưu tiên:** P2 — triển khai sau P0 và P1 Luxury UI/UX  
> **Phiên bản:** 1.0  
> **Ngày cập nhật:** 22/07/2026  
> **Trạng thái:** Implementation baseline  
> **Thẩm mỹ:** Quiet Vietnamese Luxury — điện ảnh, tiết chế, bản địa, ưu tiên chất liệu thật và nhịp kể chuyện

---

## 1. Quyết định kiến trúc

Trang `/story` chuyển từ mô hình hoa sen WebGL/Three.js sang **nhiều section video ngắn được điều khiển bằng tiến trình cuộn**.

- Cuộn xuống: `currentTime` tăng.
- Cuộn lên: `currentTime` giảm.
- Không dùng video reverse riêng.
- Không dùng `playbackRate` âm.
- Không phát video theo thời gian thực.
- Không nhúng chữ hoặc audio vào video.
- Nội dung văn hóa là HTML overlay độc lập.
- Chỉ tải scene hiện tại và scene lân cận.
- Giữ poster/static fallback cho reduced motion, mạng yếu và lỗi giải mã.

| Hạng mục | Quyết định |
|---|---|
| Scroll | Framer Motion hiện có |
| Video sync | `HTMLVideoElement.currentTime` + `requestAnimationFrame` |
| Section visibility | `useScroll`, `useMotionValueEvent`, `IntersectionObserver` |
| Transition | Match-cut ưu tiên; hold frame; crossfade ngắn |
| Video | MP4 H.264, muted, playsinline |
| 3D | Loại khỏi runtime của `/story` |
| Dependency mới | Không thêm GSAP trong baseline |

### Lý do

Section video giảm chi phí quản lý hàng trăm frame, tái sử dụng được cho social media/pitching/booth, hỗ trợ cuộn xuôi–ngược và giảm gánh nặng WebGL trên mobile. Chất lượng luxury phụ thuộc vào storyboard, ánh sáng, grading, nhịp đọc và chuyển cảnh, không phụ thuộc vào việc asset phải là 3D.

---

## 2. Baseline hiện tại và phạm vi migration

Trang hiện tại dùng:

- `src/features/story/page/index.tsx`;
- `StoryLotusCanvas`;
- một `scrollYProgress` chung;
- bốn giai đoạn `Ủ mầm — Vươn lên — Nở — Trao hạt`;
- fallback ảnh khi `prefers-reduced-motion`;
- bố cục text trái/canvas sticky phải.

### Giữ lại

- Route `/story`.
- `content.storyPage` và hệ content hiện tại.
- Framer Motion.
- Reduced-motion fallback.
- Progress indicator.
- Design tokens và typography.

### Thay thế

- `StoryLotusCanvas` → `StoryVideoRail`.
- Một progress 3D → progress theo scene.
- Split-screen → full-viewport cinematic stage.
- Bốn giai đoạn → tám scene có tuyến văn hóa rõ ràng.
- Tách vòng đời tự nhiên khỏi đổi mới Petal Pack.

Không xóa `StoryLotusCanvas` nếu component này còn được route khác sử dụng.

---

## 3. Mục tiêu trải nghiệm

Tuyến nội dung bắt buộc:

```text
Sen khởi sinh
→ sen vươn lên và nở
→ sen hiện diện trong đời sống Việt
→ con người lưu giữ hương sen trong trà
→ Senova tái thiết kế cách tiếp cận
→ Petal Pack biến câu chuyện thành hành động
```

### UX

- Trong 5 giây đầu, người dùng hiểu đây là câu chuyện về sen và Senova.
- Mỗi scene chỉ truyền một ý chính.
- Cuộn ngược xem lại được chuyển động theo chiều ngược.
- Mobile không phải desktop bị thu nhỏ.
- Nội dung vẫn đầy đủ khi video không tải.
- `/story` giải thích thương hiệu; `/ritual` hướng dẫn sử dụng chi tiết.

### Luxury

Luxury đến từ:

- grading nhất quán;
- khoảng trống thị giác;
- typography ít nhưng rõ;
- chất liệu nước, cánh sen, trà, giấy và gốm;
- chuyển động chậm, chính xác;
- khoảng dừng để đọc;
- không dùng particle, flare vàng, card bóng hoặc parallax dày đặc.

### Ngoài phạm vi

- mô hình 3D mới;
- xoay/zoom camera tự do;
- âm thanh tua theo scroll;
- CMS video hoàn chỉnh;
- blockchain, commerce hoặc QR flow đầy đủ.

---

## 4. Kiến trúc câu chuyện: 8 scene

| ID | Chương | Vai trò | Duration | Scroll |
|---|---|---|---:|---:|
| `origin` | Khởi sinh | Hạt sen dưới lớp nước và bùn | 4–5s | 140–160vh |
| `rise` | Vươn lên | Thân sen đi qua mặt nước | 5–6s | 170–190vh |
| `bud` | Thành nụ | Lá mở, nụ hình thành | 4–5s | 150–170vh |
| `bloom` | Nở | Cao trào và điểm mở văn hóa | 7–9s | 240–280vh |
| `culture` | Ký ức Việt | Ao sen, mùa sen, chén trà | 4–5s loop | 200–240vh |
| `craft` | Lưu hương | Con người, nguyên liệu, kỹ nghệ trà | 6–7s | 190–220vh |
| `senova` | Hình thức mới | Petal Pack là đổi mới trải nghiệm | 7–8s | 220–250vh |
| `ritual` | Tiếp nối | Tách nhẹ, thưởng hương, pha nguyên búp | 7–9s | 230–270vh |

Ranh giới nội dung bắt buộc:

```text
Kỹ nghệ và giá trị trà sen đã tồn tại
≠
Petal Pack là nghi thức cổ
```

Petal Pack phải được ghi rõ là **thiết kế trải nghiệm mới của Senova**.

---

## 5. Storyboard và copy baseline

### 5.1. `origin` — Khởi sinh

- **Title:** `Một hành trình bắt đầu từ nơi ánh sáng chưa chạm tới.`
- **Body:** `Dưới lớp nước và bùn sâu, hạt sen giữ lại khả năng của một mùa mới.`
- **Visual:** Hạt sen, nước tối, chuyển động bùn/ánh sáng rất nhẹ.
- **Transition:** Camera tiến lên, khớp hướng với `rise`.

### 5.2. `rise` — Vươn lên

- **Title:** `Sen đi qua mặt nước để tìm một hình hài mới.`
- **Body:** `Từ chất liệu cũ, một cấu trúc mới dần xuất hiện — không tách khỏi cội nguồn, nhưng hướng về hiện tại.`
- **Lưu ý:** Đây là diễn giải thương hiệu, không phải định nghĩa duy nhất về biểu tượng sen Việt.

### 5.3. `bud` — Thành nụ

- **Title:** `Một mùa sen được nhận ra trước khi hoa nở.`
- **Body:** `Trong ao làng, hồ nước và những ngày hạ, hình ảnh sen trở thành một phần quen thuộc của cảnh quan và ký ức.`

### 5.4. `bloom` — Nở

Copy theo cue:

| Progress | Nội dung |
|---|---|
| 0–35% | `Một đóa sen mở ra theo nhịp riêng.` |
| 35–70% | `Hình dáng trở thành biểu tượng khi con người trao cho nó ký ức và ý nghĩa.` |
| 70–100% | `Sen còn đi vào đời sống qua không gian, mùa vụ, quà tặng và chén trà.` |

Yêu cầu:

- góc máy cố định;
- không có chữ trong video;
- không dùng cánh hoa bay/flare vàng;
- giữ frame cuối 25–40vh để đọc.

### 5.5. `culture` — Đi vào ký ức Việt

Ba lớp copy:

- `Ao sen — Một không gian quen thuộc.`
- `Mùa sen — Một nhịp điệu của tự nhiên và đời sống.`
- `Chén trà — Một khoảng thời gian dành cho cảm nhận và kết nối.`

Kết:

`Câu chuyện văn hóa không nằm ở một biểu tượng đứng yên. Nó tiếp tục khi hình ảnh, hương và hành động gặp nhau trong đời sống.`

Scene này ưu tiên đọc; chuyển động nền phải thấp.

### 5.6. `craft` — Hương được lưu giữ

- **Title:** `Khi mùa sen khép lại, hương được con người tìm cách lưu giữ.`
- **Body:** `Trà, gạo sen, thời gian và sự chăm chút tạo nên một cách tiếp nối hương sen trong chén trà.`
- **Visual:** Ưu tiên footage thật: bàn tay, cánh sen, gạo sen, nền trà.

Không tuyên bố:

- quy trình Senova là nguyên bản của một vùng/cung đình nếu chưa có nguồn;
- giữ nguyên toàn bộ dưỡng chất;
- thông số thử nghiệm là tiêu chuẩn thương mại đã xác nhận.

### 5.7. `senova` — Một hình thức mới

- **Eyebrow:** `06 / Senova`
- **Title:** `Từ chất liệu quen thuộc đến một hình thức trải nghiệm mới.`
- **Body:** `Senova Petal Pack không tái dựng một nghi thức cổ. Sản phẩm thiết kế lại cách người dùng tiếp xúc với trà sen qua hình dáng búp, thao tác mở, hương và thời gian pha.`
- **Label:** `Thiết kế trải nghiệm mới của Senova`

### 5.8. `ritual` — Câu chuyện tiếp tục

Copy theo progress:

1. `Tách nhẹ cánh sen`
2. `Thưởng hương`
3. `Pha nguyên búp`
4. `Chạm chuyện Việt`

Kết:

`Một đời sen đi qua nước, nắng và bàn tay con người. Khi được đặt vào chén trà, câu chuyện ấy tiếp tục trong trải nghiệm của bạn.`

CTA:

- `Khám phá nghi thức` → `/ritual`
- `Xem Senova Petal Pack` → `/products/petal-pack`

---

## 6. Layout responsive

### Desktop

- Full-bleed video, `object-fit: cover`.
- Copy trong safe area, tối đa 34rem.
- Gradient scrim nhẹ, không dùng card dày.
- Progress dọc dạng line mảnh.
- Mỗi scene tối đa eyebrow + title + body.
- Chủ thể không nằm trong vùng chữ.

### Mobile

- Dùng 9:16 cho scene bị crop chủ thể.
- Copy đặt tại 58–82% chiều cao.
- Scrim từ dưới lên.
- Title tối đa 3–4 dòng.
- Không decode hai video cùng lúc khi transition.
- Progress chuyển thành số chương/thanh ngang.
- Không dùng backdrop blur diện rộng.

### Reduced motion

- Không scrub hoặc tải video.
- Mỗi scene dùng poster tĩnh.
- Không pin dài.
- Nội dung trình bày editorial theo DOM.
- CTA và câu chuyện vẫn đầy đủ.

---

## 7. Kiến trúc file

```text
apps/frontend/
├── public/story/
│   ├── desktop/*.mp4
│   ├── mobile/*.mp4
│   └── posters/*.webp
└── src/features/story/
    ├── components/
    │   ├── StoryVideoRail.tsx
    │   ├── ScrollVideoScene.tsx
    │   ├── StorySceneCopy.tsx
    │   ├── StoryProgress.tsx
    │   └── StoryFallback.tsx
    ├── data/storyScenes.ts
    ├── hooks/
    │   ├── useVideoScrub.ts
    │   ├── useStoryPreload.ts
    │   └── useStoryPerformanceMode.ts
    ├── page/index.tsx
    ├── story.types.ts
    └── story.css
```

### File bị tác động

| File | Thay đổi |
|---|---|
| `src/features/story/page/index.tsx` | Thay canvas bằng `StoryVideoRail` |
| `src/shared/components/story/StoryLotusCanvas.tsx` | Không dùng tại `/story`; giữ nếu route khác cần |
| `src/features/content/content.json` | Tách copy theo 8 scene |
| `src/features/content/sitePages.ts` | Giữ metadata; cập nhật description nếu cần |
| `src/app/router/registeredRoutes.ts` | Không đổi path |
| `apps/frontend/docs/routes.md` | Mô tả route scroll-video |
| `apps/frontend/docs/components.md` | Component mới |
| `apps/frontend/docs/development.md` | Quy trình thay video/encoding |

---

## 8. Data contract

```ts
export type StorySceneId =
  | "origin"
  | "rise"
  | "bud"
  | "bloom"
  | "culture"
  | "craft"
  | "senova"
  | "ritual";

export type StoryCopyCue = {
  from: number;
  to: number;
  eyebrow?: string;
  title?: string;
  body?: string;
};

export type StoryScene = {
  id: StorySceneId;
  desktopSrc: string;
  mobileSrc?: string;
  posterSrc: string;
  scrollVh: number;
  estimatedDuration: number;
  objectPositionDesktop?: string;
  objectPositionMobile?: string;
  copyCues: StoryCopyCue[];
  transition: "match-cut" | "crossfade" | "hold";
  preload: "eager" | "nearby" | "lazy";
};
```

Nguyên tắc:

- Không hard-code copy/path trong JSX.
- Cue dùng khoảng `0–1`.
- Duration thực lấy từ metadata.
- `objectPosition` phải QA trên viewport thật.

---

## 9. Trách nhiệm component

### `StoryVideoRail`

- quản lý active scene;
- chỉ mount/tải previous–current–next;
- điều phối transition;
- cung cấp progress tổng;
- bật fallback mode.

### `ScrollVideoScene`

- tạo section theo `scrollVh`;
- tính progress scene;
- gắn progress vào video;
- hiển thị copy cue;
- xử lý poster/error/analytics.

### `useVideoScrub`

- chuyển progress thành target time;
- cập nhật bằng `requestAnimationFrame`;
- giới hạn seek theo threshold;
- không seek trước metadata;
- cleanup đúng khi unmount.

### `useStoryPreload`

- dùng `IntersectionObserver`;
- tải scene kế tiếp khi đến gần;
- không tải toàn bộ 8 video khi mở trang.

### `useStoryPerformanceMode`

```ts
type StoryPerformanceMode = "full" | "reduced" | "static";
```

- `reduced`: reduced motion.
- `static`: save-data, decoder error hoặc fallback có chủ đích.
- `full`: trường hợp còn lại.

Không dùng user-agent để suy đoán model thiết bị.

---

## 10. Hook scrub baseline

```ts
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

type Options = {
  progress: MotionValue<number>;
  seekThreshold?: number;
};

export function useVideoScrub(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  { progress, seekThreshold = 1 / 24 }: Options,
) {
  const targetTime = useRef(0);
  const frame = useRef<number | null>(null);

  const render = () => {
    const video = videoRef.current;
    if (
      video &&
      Number.isFinite(video.duration) &&
      Math.abs(video.currentTime - targetTime.current) >= seekThreshold
    ) {
      video.currentTime = targetTime.current;
    }
    frame.current = null;
  };

  useMotionValueEvent(progress, "change", (value) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;

    targetTime.current = Math.max(
      0,
      Math.min(video.duration, value * video.duration),
    );

    if (frame.current === null) {
      frame.current = requestAnimationFrame(render);
    }
  });

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);
}
```

Ràng buộc:

- Không gọi `play()` cho animation.
- Video luôn `muted`, `playsInline`.
- Seek threshold baseline = 1 frame ở 24fps.
- Không easing `currentTime`; easing chỉ áp dụng copy/opacity.
- Cuộn ngược dùng cùng công thức.

---

## 11. Transition

Thứ tự ưu tiên:

1. Match-cut.
2. Hold frame.
3. Crossfade.

### Match-cut contract

Frame cuối/trước cần gần nhau về:

- hướng chuyển động;
- vị trí chủ thể;
- nhiệt độ màu;
- mức sáng;
- tiêu cự cảm nhận.

### Hold frame

Dùng tại:

- cuối `bloom`;
- giữa `culture`;
- trước CTA cuối.

### Crossfade

- Desktop: 300–500ms cảm nhận.
- Mobile: poster bridge, tránh hai video scrub đồng thời.
- Không crossfade khi grading/độ sáng chưa khớp.

---

## 12. Đặc tả video

### Master

- 4K/2K để còn crop.
- 24fps.
- Camera chậm, không rung.
- Motion blur đủ thấp để frame dừng vẫn rõ.
- Color profile thống nhất.
- Không text/logo/audio.
- Không black frame ngoài chủ đích.

### Desktop export

- 1920×1080.
- H.264 MP4, `yuv420p`.
- 24fps.
- Keyframe baseline: 12 frame.
- Tắt B-frame trong baseline scrub.
- Fast start.
- 2–4MB/scene; `bloom` tối đa 5MB.

### Mobile export

- 720×1280 hoặc 1080×1920 khi cần.
- 24fps.
- 1–2.5MB/scene.
- Chỉ tạo crop riêng sau khi master 16:9 không đạt safe area.

### FFmpeg desktop

```bash
ffmpeg -i input.mov \
  -vf "fps=24,scale=1920:-2" \
  -an -c:v libx264 -preset slow -crf 21 \
  -pix_fmt yuv420p -g 12 -keyint_min 12 \
  -sc_threshold 0 -bf 0 -movflags +faststart \
  output-desktop.mp4
```

### FFmpeg mobile

```bash
ffmpeg -i input.mov \
  -vf "fps=24,scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" \
  -an -c:v libx264 -preset slow -crf 23 \
  -pix_fmt yuv420p -g 12 -keyint_min 12 \
  -sc_threshold 0 -bf 0 -movflags +faststart \
  output-mobile.mp4
```

CRF/keyframe là baseline; phải benchmark asset thật trước khi khóa.

---

## 13. Lazy loading và hosting

Khi mở trang:

- tải HTML/CSS và poster `origin`;
- preload metadata `origin`;
- không tải scene 2–8.

Khi gần scene:

- current: tải đầy đủ;
- next: preload metadata/file theo mạng;
- previous: giữ cache;
- distant: chỉ poster.

```tsx
<video
  ref={videoRef}
  muted
  playsInline
  preload={isNearby ? "metadata" : "none"}
  poster={scene.posterSrc}
  aria-hidden="true"
/>
```

Hosting phải:

- trả đúng MIME;
- hỗ trợ byte-range;
- cache dài hạn với filename có version/hash;
- không đưa MP4 vào JS bundle;
- lưu asset tại `public/story`.

---

## 14. Performance budget

| Hạng mục | Budget |
|---|---:|
| JS story bổ sung | ≤ 25KB gzip, không tính dependency đã có |
| Poster đầu | ≤ 250KB |
| Scene desktop | ≤ 4MB |
| `bloom` desktop | ≤ 5MB |
| Scene mobile | ≤ 2.5MB |
| Tổng video story | Mục tiêu ≤ 26MB |
| Dữ liệu tải trước scene đầu | Mục tiêu ≤ 3MB |

Runtime:

- chỉ một video scrub active;
- không quá ba video có `src` trên mobile;
- throttle seek bằng rAF;
- không blur diện rộng khi scroll;
- không tải Three.js/R3F trong chunk `/story` sau migration.

---

## 15. Accessibility và fallback

- Copy tồn tại trong DOM, đúng heading order.
- Video là decorative khi thông tin đã có trong copy.
- Không dùng video làm nguồn duy nhất.
- CTA keyboard-accessible.
- Reduced motion có full content.
- Contrast copy/scrim đạt baseline WCAG.
- Không autoplay audio.
- Không khóa scroll/focus.

### Video lỗi

- giữ poster;
- hiển thị copy;
- không spinner vô hạn;
- ghi analytics;
- cho phép tiếp tục scroll.

### Save-data

Khi `navigator.connection?.saveData` khả dụng và bật:

- dùng static mode;
- không tải video ngoài tương tác rõ ràng;
- giữ full copy.

---

## 16. Content governance

Ngôn ngữ bắt buộc:

```text
Tách nhẹ cánh sen
→ Thưởng hương
→ Pha nguyên búp
```

Không dùng:

- `Mở từng lớp cánh sen`;
- `Tháo cánh sen`;
- `Lấy túi trà ra để pha riêng`;
- `Nghi thức cổ truyền Petal Pack`;
- tuyên bố tuyệt đối về lịch sử, sức khỏe hoặc chất lượng chưa kiểm chứng.

Single source of truth đề xuất:

```text
src/features/story/data/storyScenes.ts
```

Bao bì, video caption, website, slide và booth phải dùng cùng thuật ngữ.

---

## 17. Analytics tối thiểu

Event:

```text
story_view
story_scene_enter
story_scene_complete
story_reverse_scroll
story_fallback_used
story_video_error
story_cta_ritual_click
story_cta_product_click
```

Không gửi event theo từng frame. Chỉ gửi enter, 50%, complete, CTA, error.

---

## 18. Migration plan

### Giai đoạn 1 — Nội dung và asset contract

- [ ] Chốt 8 scene và copy.
- [ ] Chốt shot list/safe area.
- [ ] Tạo poster.
- [ ] Chốt naming convention.

### Giai đoạn 2 — Technical spike bằng scene `bloom`

- [ ] Tạo `ScrollVideoScene`.
- [ ] Test scrub xuôi/ngược.
- [ ] Benchmark `g=12` và `g=24`.
- [ ] Test Chrome, Edge, Safari iOS.
- [ ] Xác nhận byte-range staging/production.

### Giai đoạn 3 — Rail hoàn chỉnh

- [ ] Scene config.
- [ ] Previous/current/next loading.
- [ ] Copy cues.
- [ ] Progress.
- [ ] Reduced/static fallback.
- [ ] Loại import 3D khỏi `/story`.

### Giai đoạn 4 — Luxury polish

- [ ] Match-cut.
- [ ] Grading.
- [ ] Typography timing.
- [ ] Scrim/header transition.
- [ ] Mobile crop.
- [ ] CTA.

### Giai đoạn 5 — QA/release

- [ ] Accessibility.
- [ ] Performance.
- [ ] Visual regression.
- [ ] Thiết bị thật.
- [ ] Analytics.
- [ ] Docs.
- [ ] Staging approval.

---

## 19. File-level plan

### P2.1 — Types/data

Tạo:

- `story.types.ts`
- `data/storyScenes.ts`

Acceptance: type-safe, không hard-code path/copy, hỗ trợ desktop/mobile.

### P2.2 — Scrub hook

Tạo `hooks/useVideoScrub.ts`.

Acceptance: xuôi/ngược, clamp, metadata guard, cleanup, unit test.

### P2.3 — Scene

Tạo:

- `components/ScrollVideoScene.tsx`
- `components/StorySceneCopy.tsx`

Acceptance: poster, cue, error, responsive position.

### P2.4 — Rail

Tạo:

- `components/StoryVideoRail.tsx`
- `components/StoryProgress.tsx`

Acceptance: một active scene, nearby loading, không flash.

### P2.5 — Fallback

Tạo:

- `components/StoryFallback.tsx`
- `hooks/useStoryPerformanceMode.ts`

Acceptance: reduced motion không tải video, không blank viewport.

### P2.6 — Page migration

Sửa `page/index.tsx`.

Acceptance: không import canvas 3D; route/copy source giữ ổn định.

### P2.7 — Docs

Cập nhật:

- `apps/frontend/docs/routes.md`
- `apps/frontend/docs/components.md`
- `apps/frontend/docs/development.md`

---

## 20. Test matrix

| Nhóm | Case |
|---|---|
| Scroll | chậm/nhanh xuống; chậm/nhanh lên |
| Navigation | direct `/story`; refresh; back/forward |
| Video | metadata chậm; file lỗi; duration invalid |
| Responsive | 360×800; 390×844; 768×1024; 1440×900; 1920×1080 |
| Browser | Chrome; Edge; Firefox; Safari macOS/iOS |
| Motion | normal; reduced |
| Network | Fast 4G; Slow 4G; save-data |
| Accessibility | keyboard; reading order; contrast |
| Performance | initial transfer; memory; dropped frames |
| Content | thuật ngữ Petal Pack; truyền thống/đổi mới |
| Analytics | enter/complete; CTA; error; fallback |

---

## 21. Acceptance criteria

### Trải nghiệm

- [ ] Cuộn xuôi/ngược điều khiển đúng chiều video.
- [ ] Không phát ngoài scroll.
- [ ] Copy không nằm trong video.
- [ ] Không blank khi video chưa sẵn sàng.
- [ ] `bloom` là cao trào nhưng còn đủ thời gian đọc.
- [ ] `senova` ghi rõ Petal Pack là thiết kế mới.
- [ ] Scene cuối đúng flow: tách nhẹ — thưởng hương — pha nguyên búp.

### Luxury

- [ ] Grading nhất quán.
- [ ] Không particle/flare dư thừa.
- [ ] Không flash khi transition.
- [ ] Mỗi scene có một tiêu điểm.
- [ ] Mobile giữ chủ thể và khoảng thở.

### Kỹ thuật

- [ ] `/story` không tải Three.js/R3F.
- [ ] Không quá 3 video có `src` trên mobile.
- [ ] Poster đầu ≤ 250KB.
- [ ] MIME/byte-range đúng.
- [ ] Error không chặn nội dung.
- [ ] Reduced motion không tải video.
- [ ] Build/lint/test qua.
- [ ] Không thêm dependency nếu chưa có ADR.

### Nội dung

- [ ] Không gọi Petal Pack là nghi thức cổ.
- [ ] Không dùng claim văn hóa thiếu nguồn như sự thật tuyệt đối.
- [ ] Không hướng dẫn tháo cánh.
- [ ] Website/video/bao bì/booth thống nhất thuật ngữ.

---

## 22. Definition of Done

P2 hoàn thành khi:

1. 8 scene có asset được duyệt.
2. Story rail hoạt động desktop/mobile.
3. Tua ngược không cần asset reverse.
4. Reduced motion có bản editorial đầy đủ.
5. `/story` không còn runtime 3D.
6. Initial load trong budget.
7. Không lỗi nghiêm trọng trên Safari iOS.
8. Nội dung văn hóa được GVHD rà soát.
9. CTA dẫn đúng `/ritual` và `/products/petal-pack`.
10. Frontend docs được cập nhật.
11. Staging được duyệt.
12. Analytics hoạt động đúng ngưỡng.

---

## 23. Asset checklist

```text
story-origin-master.mov
story-rise-master.mov
story-bud-master.mov
story-bloom-master.mov
story-culture-master.mov
story-craft-master.mov
story-senova-master.mov
story-ritual-master.mov
```

Mỗi scene cần:

- [ ] master;
- [ ] desktop MP4;
- [ ] mobile MP4 khi cần;
- [ ] poster WebP;
- [ ] frame đầu/cuối;
- [ ] safe area;
- [ ] object-position;
- [ ] duration/dung lượng;
- [ ] nguồn/bản quyền;
- [ ] trạng thái phê duyệt.

---

## 24. Rủi ro và kiểm soát

| Rủi ro | Kiểm soát |
|---|---|
| Seek giật | Keyframe ngắn, video ngắn, threshold, benchmark |
| Asset rời rạc | Shot list, grading, match-frame contract |
| Mobile crop sai | Safe area, crop riêng scene trọng yếu |
| Tải nhiều | Nearby loading, poster, static mode |
| Hai decoder | Một active; mobile poster bridge |
| Diễn giải văn hóa quá mức | Claim states + GVHD review |
| Video lỗi | Poster + DOM copy |
| Three.js vẫn vào bundle | Kiểm tra route chunk/bundle analyzer |

---

## 25. Quyết định chốt

- Dùng section video scrub theo scroll.
- Dùng Framer Motion hiện có.
- Không thêm GSAP trong baseline.
- Dùng 8 scene, không dùng một video dài.
- Không dùng image sequence toàn trang.
- Không tạo video reverse.
- Không embed text/audio.
- Không để `/story` phụ thuộc runtime 3D.
- Dùng poster/static fallback.
- Ưu tiên match-cut hơn crossfade.
- Ưu tiên footage thật từ `craft` trở đi.
- Petal Pack là đổi mới trải nghiệm, không phải truyền thống nguyên bản.

Các mục chỉ chốt sau technical spike:

- keyframe `g=12` hay `g=24`;
- scene cần crop mobile riêng;
- có cần WebM;
- threshold static mode;
- duration/scroll cuối sau test đọc.

---

## 26. Thứ tự triển khai

```text
1. Chốt storyboard và copy
2. Sản xuất riêng scene bloom
3. Tích hợp useVideoScrub
4. Benchmark desktop/mobile
5. Chốt encoding
6. Sản xuất 7 scene còn lại
7. Tích hợp StoryVideoRail
8. Luxury polish
9. Accessibility + performance QA
10. Staging review
11. Production release
```

Không sản xuất toàn bộ 8 video trước khi scene `bloom` chứng minh cơ chế scrub ổn định trên thiết bị mục tiêu.
