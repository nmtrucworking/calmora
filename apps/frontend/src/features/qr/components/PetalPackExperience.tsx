import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, Volume2, VolumeX } from "lucide-react";
import { Link } from "@app/router/RouterContext";
import { trackEvent } from "@shared/analytics/analytics";
import type { SenovaProduct } from "@features/products/data/products";
import { LotusBrewTimer } from "./LotusBrewTimer";
import { TraceabilitySheet } from "./TraceabilitySheet";
import styles from "./PetalPackExperience.module.css";

const ASSET_ROOT = "/assets/UX/petal-pack";
const SCENE_IMAGES = ["FM.png", "touch.png", "open.png", "sense.png", "brew.png", "wait.png", "enjoy.png"];
const AROMA_OPTIONS = ["Thanh", "Dịu", "Rõ", "Chưa cảm nhận"];
const MEMORY_OPTIONS = [
  "Hình dáng búp sen",
  "Thao tác tách nhẹ",
  "Hương sen",
  "Khoảnh khắc chờ",
  "Vị trà",
];

type PetalPackExperienceProps = {
  batchCode: string;
  contentVersion: string;
  contentViewed: string;
  product: SenovaProduct;
};

type RitualSceneProps = {
  action?: ReactNode;
  children?: ReactNode;
  compareImage?: string;
  image: string;
  imageAlt: string;
  index: number;
  label: string;
  title: string;
  tone?: "dark" | "ivory";
  topBar: ReactNode;
};

function RitualScene({
  action,
  children,
  compareImage,
  image,
  imageAlt,
  index,
  label,
  title,
  tone = "dark",
  topBar,
}: RitualSceneProps) {
  return (
    <section className={styles.scene} data-scene={index} data-tone={tone} aria-labelledby={`petal-scene-${index}`}>
      <div className={styles.media} role="img" aria-label={imageAlt}>
        {compareImage ? (
          <>
            <img className={styles.compareBefore} src={compareImage} alt="" />
            <img className={styles.compareAfter} src={image} alt="" />
            <div className={styles.compareLabel} aria-hidden="true">
              <span>Trước</span><span>Sau khi tách nhẹ</span>
            </div>
          </>
        ) : (
          <img src={image} alt="" fetchPriority={index === 0 ? "high" : "auto"} />
        )}
      </div>
      <div className={styles.sceneVeil} aria-hidden="true" />
      <div className={styles.sceneTexture} aria-hidden="true" />
      <div className={styles.sceneFrame}>
        {topBar}
        <div className={styles.sceneCopy}>
          <span className={styles.sceneOrdinal} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className={styles.sceneLabel}>{label}</p>
          <h1 id={`petal-scene-${index}`}>{title}</h1>
          {children}
        </div>
        {action ? <div className={styles.sceneAction}>{action}</div> : null}
      </div>
    </section>
  );
}

function PrimaryAction({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button className={styles.primaryAction} type="button" onClick={onClick}>
      <span>{children}</span><ArrowRight aria-hidden="true" />
    </button>
  );
}

export function PetalPackExperience({
  batchCode,
  contentVersion,
  contentViewed,
  product,
}: PetalPackExperienceProps) {
  const defaultBatch = product.batchLabel?.match(/PP-[A-Z0-9-]+/)?.[0] ?? "PP-2601-A";
  const displayBatch = batchCode.trim().toUpperCase() || defaultBatch;
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);
  const storyAudioRef = useRef<HTMLAudioElement>(null);
  const aromaAdvanceRef = useRef<number | undefined>(undefined);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [aroma, setAroma] = useState("");
  const [memory, setMemory] = useState("");
  const [waitComplete, setWaitComplete] = useState(false);
  const [isTraceOpen, setIsTraceOpen] = useState(false);
  const nextScene = useCallback(() => setSceneIndex((current) => Math.min(current + 1, 6)), []);

  useEffect(() => {
    const background = backgroundAudioRef.current;
    const story = storyAudioRef.current;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overflow = "hidden";

    SCENE_IMAGES.forEach((filename) => {
      const image = new Image();
      image.src = `${ASSET_ROOT}/${filename}`;
    });
    return () => {
      if (aromaAdvanceRef.current) window.clearTimeout(aromaAdvanceRef.current);
      background?.pause();
      story?.pause();
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    const background = backgroundAudioRef.current;
    const story = storyAudioRef.current;
    if (!background || !story) return;

    if (sceneIndex !== 5) {
      story.pause();
      background.volume = 0.34;
      return;
    }

    if (!soundEnabled) return;
    background.volume = 0.1;
    story.currentTime = 0;
    story.volume = 0.82;
    void story.play().then(() => setIsNarrating(true)).catch(() => setIsNarrating(false));

    const restoreMusic = () => {
      setIsNarrating(false);
      background.volume = 0.34;
    };
    story.addEventListener("ended", restoreMusic);
    return () => {
      story.removeEventListener("ended", restoreMusic);
      story.pause();
      restoreMusic();
    };
  }, [sceneIndex, soundEnabled]);

  const startRitual = useCallback(() => {
    const background = backgroundAudioRef.current;
    if (background) {
      background.volume = 0.34;
      void background.play().then(() => setSoundEnabled(true)).catch(() => setSoundEnabled(false));
    }
    trackEvent({ eventName: "ritual_start", productSlug: product.slug, batchCode: displayBatch, contentVersion, contentViewed });
    nextScene();
  }, [contentVersion, contentViewed, displayBatch, nextScene, product.slug]);

  const completeScene = useCallback((status: string) => {
    trackEvent({
      eventName: "ritual_step_complete",
      productSlug: product.slug,
      batchCode: displayBatch,
      contentVersion,
      contentViewed,
      status,
    });
    nextScene();
  }, [contentVersion, contentViewed, displayBatch, nextScene, product.slug]);

  const toggleSound = useCallback(() => {
    const background = backgroundAudioRef.current;
    const story = storyAudioRef.current;
    if (!background || !story) return;
    if (soundEnabled) {
      background.pause();
      story.pause();
      setIsNarrating(false);
      setSoundEnabled(false);
      return;
    }
    background.volume = sceneIndex === 5 ? 0.1 : 0.34;
    void background.play().then(() => setSoundEnabled(true)).catch(() => setSoundEnabled(false));
  }, [sceneIndex, soundEnabled]);

  const selectAroma = useCallback((value: string) => {
    setAroma(value);
    trackEvent({
      eventName: "ritual_sensory_note",
      productSlug: product.slug,
      batchCode: displayBatch,
      contentVersion,
      contentViewed,
      status: value,
    });
    aromaAdvanceRef.current = window.setTimeout(nextScene, 650);
  }, [contentVersion, contentViewed, displayBatch, nextScene, product.slug]);

  const topBar = useMemo(() => (
    <div className={styles.ritualHeader}>
      <div className={styles.identityBar}>
        <div className={styles.ritualIdentity}>
          <span className={styles.ritualIdentityCopy}>
            <strong>SENOVA RITUAL</strong>
            <small>Petal Pack <i aria-hidden="true">·</i> Lô {displayBatch}</small>
          </span>
        </div>
        <div className={styles.ritualControls}>
          <span className={styles.stepCount} aria-hidden="true">
            {String(sceneIndex + 1).padStart(2, "0")} <i>/</i> 07
          </span>
          {sceneIndex > 0 ? (
            <button type="button" onClick={toggleSound} aria-label={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}>
              {soundEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
              <span>{isNarrating ? "Câu chuyện" : soundEnabled ? "Âm thanh" : "Bật âm"}</span>
            </button>
          ) : null}
        </div>
      </div>
      <div
        className={styles.ritualProgress}
        role="progressbar"
        aria-label="Tiến trình nghi thức"
        aria-valuemin={1}
        aria-valuemax={7}
        aria-valuenow={sceneIndex + 1}
      >
        <span style={{ width: `${((sceneIndex + 1) / 7) * 100}%` }} />
      </div>
    </div>
  ), [displayBatch, isNarrating, sceneIndex, soundEnabled, toggleSound]);

  let scene: ReactNode;
  if (sceneIndex === 0) {
    scene = (
      <RitualScene
        action={<PrimaryAction onClick={startRitual}>Bắt đầu khoảng trà</PrimaryAction>}
        image={`${ASSET_ROOT}/FM.png`}
        imageAlt="Petal Pack và tách trà sen giữa không gian hồ sen"
        index={0}
        label="SENOVA"
        title="Petal Pack"
        topBar={topBar}
      >
        <p className={styles.revealTagline}>Một búp sen <span>·</span> Một lần pha</p>
        <p className={styles.batchLine}>Lô {displayBatch}</p>
      </RitualScene>
    );
  } else if (sceneIndex === 1) {
    scene = (
      <RitualScene
        action={<PrimaryAction onClick={() => completeScene("touch")}>Tôi đã cầm búp sen</PrimaryAction>}
        image={`${ASSET_ROOT}/touch.png`}
        imageAlt="Bàn tay giữ nhẹ búp sen ở phần đáy"
        index={1}
        label="Chạm · 01"
        title="Chạm vào hình hài của sen"
        topBar={topBar}
      >
        <p>Lấy búp sen khỏi lớp bao. Giữ nhẹ ở phần đáy, không bóp cánh.</p>
      </RitualScene>
    );
  } else if (sceneIndex === 2) {
    scene = (
      <RitualScene
        action={<PrimaryAction onClick={() => completeScene("open")}>Tôi đã tách nhẹ</PrimaryAction>}
        compareImage={`${ASSET_ROOT}/touch.png`}
        image={`${ASSET_ROOT}/open.png`}
        imageAlt="Hai trạng thái trước và sau khi tách nhẹ cánh ngoài của búp sen"
        index={2}
        label="Tách nhẹ · 02"
        title="Tách nhẹ để hương sen thức giấc"
        topBar={topBar}
      >
        <p>Mở nhẹ một khoảng giữa các cánh ngoài.</p>
        <p className={styles.caution}>Không tháo rời cánh sen và không lấy túi trà ra khỏi búp.</p>
      </RitualScene>
    );
  } else if (sceneIndex === 3) {
    scene = (
      <RitualScene
        image={`${ASSET_ROOT}/sense.png`}
        imageAlt="Người thưởng trà đưa búp sen lại gần để cảm nhận hương"
        index={3}
        label="Thưởng hương · 03"
        title="Đưa búp sen lại gần."
        topBar={topBar}
      >
        <p className={styles.sensoryVerse}>Chậm một nhịp.<br />Ghi nhận hương đầu tiên.</p>
        <div className={styles.aromaChoices} aria-label="Hương đầu tiên bạn cảm nhận">
          {AROMA_OPTIONS.map((option) => (
            <button
              className={aroma === option ? styles.choiceSelected : ""}
              disabled={Boolean(aroma)}
              key={option}
              type="button"
              onClick={() => selectAroma(option)}
            >
              {aroma === option ? <Check aria-hidden="true" /> : null}{option}
            </button>
          ))}
        </div>
      </RitualScene>
    );
  } else if (sceneIndex === 4) {
    scene = (
      <RitualScene
        action={<PrimaryAction onClick={() => completeScene("brew")}>Bắt đầu 3 phút chờ</PrimaryAction>}
        image={`${ASSET_ROOT}/brew.png`}
        imageAlt="Rót nước chậm quanh nguyên búp sen trong ly"
        index={4}
        label="Pha nguyên búp · 04"
        title="Rót chậm quanh búp sen"
        topBar={topBar}
      >
        <span className={styles.experimentalLabel}>Hướng dẫn thử nghiệm</span>
        <dl className={styles.brewSpecs}>
          <div><dt>Lượng trà</dt><dd>01 <span>búp</span></dd></div>
          <div><dt>Lượng nước</dt><dd>220 <span>ml</span></dd></div>
          <div><dt>Nhiệt độ</dt><dd>≈ 85<span>°C</span></dd></div>
        </dl>
        <p>Đặt nguyên búp vào ly. Giữ dây túi lọc bên ngoài và rót nước chậm quanh búp.</p>
      </RitualScene>
    );
  } else if (sceneIndex === 5) {
    scene = (
      <RitualScene
        action={waitComplete ? (
          <PrimaryAction onClick={() => {
            completeScene("wait");
            trackEvent({ eventName: "ritual_complete", productSlug: product.slug, batchCode: displayBatch, contentVersion, contentViewed });
          }}>
            Thưởng tách trà
          </PrimaryAction>
        ) : undefined}
        image={`${ASSET_ROOT}/wait.png`}
        imageAlt="Búp sen dần mở trong tách trà nóng"
        index={5}
        label="Chờ trà · 05"
        title="Để cánh sen nở theo thời gian"
        topBar={topBar}
      >
        <LotusBrewTimer onComplete={() => setWaitComplete(true)} />
        {isNarrating ? <p className={styles.narrationStatus} role="status">Câu chuyện Petal Pack đang được kể</p> : null}
      </RitualScene>
    );
  } else {
    const feedbackHref = `/feedback/${product.slug}?batch=${encodeURIComponent(displayBatch)}&source=qr`;
    scene = (
      <RitualScene
        image={`${ASSET_ROOT}/enjoy.png`}
        imageAlt="Khoảnh khắc thưởng tách trà Petal Pack bên khung cửa nhìn ra hồ sen"
        index={6}
        label="Thưởng · 06"
        title="Hương sen đã mở."
        topBar={topBar}
        tone="ivory"
      >
        <p className={styles.completionLine}>Khoảng trà bắt đầu.</p>
        <fieldset className={styles.memoryChoices}>
          <legend>Điều bạn nhớ nhất là gì?</legend>
          {MEMORY_OPTIONS.map((option) => (
            <label className={memory === option ? styles.memorySelected : ""} key={option}>
              <input
                type="radio"
                name="petal-memory"
                value={option}
                checked={memory === option}
                onChange={() => {
                  setMemory(option);
                  trackEvent({ eventName: "ritual_reflection", productSlug: product.slug, batchCode: displayBatch, contentVersion, contentViewed, status: option });
                }}
              />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
        {memory ? (
          <div className={styles.completionActions}>
            <Link
              className={styles.primaryLink}
              href={`/order-request?product=${product.slug}&quantity=1&intent=personal&source=qr`}
              onClick={() => trackEvent({ eventName: "order_request_click", productSlug: product.slug, batchCode: displayBatch, contentVersion, contentViewed, source: "qr" })}
            >
              Đặt trước Petal Pack <ArrowRight aria-hidden="true" />
            </Link>
            <button type="button" onClick={() => setIsTraceOpen(true)}>Xem nguồn gốc và lô sản phẩm</button>
            <Link href={feedbackHref}>Gửi phản hồi chi tiết</Link>
          </div>
        ) : null}
      </RitualScene>
    );
  }

  return (
    <article className={styles.experience}>
      <audio ref={backgroundAudioRef} src="/media/The_Vessel_s_Quietude.mp3" loop preload="auto" />
      <audio ref={storyAudioRef} src="/media/petal-pack.mp3" preload="auto" />
      {scene}
      <TraceabilitySheet batchCode={displayBatch} isOpen={isTraceOpen} onClose={() => setIsTraceOpen(false)} />
    </article>
  );
}
