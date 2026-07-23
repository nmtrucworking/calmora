import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, Volume2, VolumeX } from "lucide-react";
import { Link } from "@app/router/RouterContext";
import { trackEvent } from "@shared/analytics/analytics";
import type { SenovaProduct } from "@features/products/data/products";
import { LotusBrewTimer } from "./LotusBrewTimer";
import { TraceabilitySheet } from "./TraceabilitySheet";
import styles from "./PetalPackExperience.module.css";
import { useLanguage } from "@app/providers/LanguageContext";
import { getLocalizedProduct } from "@features/content/i18n";

const ASSET_ROOT = "/assets/UX/petal-pack";
const SCENE_IMAGES = ["FM.png", "touch.png", "open.png", "sense.png", "brew.png", "wait.png", "enjoy.png"];
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
  const { language } = useLanguage();
  return (
    <section className={styles.scene} data-scene={index} data-tone={tone} aria-labelledby={`petal-scene-${index}`}>
      <div className={styles.media} role="img" aria-label={imageAlt}>
        {compareImage ? (
          <>
            <img className={styles.compareBefore} src={compareImage} alt="" />
            <img className={styles.compareAfter} src={image} alt="" />
            <div className={styles.compareLabel} aria-hidden="true">
              <span>{language === "vi" ? "Trước" : "Before"}</span><span>{language === "vi" ? "Sau khi tách nhẹ" : "After gently opening"}</span>
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
  const { language } = useLanguage();
  const localizedProduct = getLocalizedProduct(product, language);
  const defaultBatch = localizedProduct.batchLabel?.match(/PP-[A-Z0-9-]+/)?.[0] ?? "PP-2601-A";
  const copy = language === "vi"
    ? {
        batch: "Lô", soundOff: "Tắt âm thanh", soundOn: "Bật âm thanh", story: "Câu chuyện", sound: "Âm thanh", enableSound: "Bật âm", progress: "Tiến trình nghi thức",
        start: "Bắt đầu khoảng trà", heroAlt: "Petal Pack và tách trà sen giữa không gian hồ sen", tagline: "Một búp sen", oneBrew: "Một lần pha",
        held: "Tôi đã cầm búp sen", touchAlt: "Bàn tay giữ nhẹ búp sen ở phần đáy", touchLabel: "Chạm · 01", touchTitle: "Chạm vào hình hài của sen", touchText: "Lấy búp sen khỏi lớp bao. Giữ nhẹ ở phần đáy, không bóp cánh.",
        opened: "Tôi đã tách nhẹ", openAlt: "Hai trạng thái trước và sau khi tách nhẹ cánh ngoài của búp sen", openLabel: "Tách nhẹ · 02", openTitle: "Tách nhẹ để hương sen thức giấc", openText: "Mở nhẹ một khoảng giữa các cánh ngoài.", caution: "Không tháo rời cánh sen và không lấy túi trà ra khỏi búp.",
        senseAlt: "Người thưởng trà đưa búp sen lại gần để cảm nhận hương", senseLabel: "Thưởng hương · 03", senseTitle: "Đưa búp sen lại gần.", senseText: "Chậm một nhịp.", senseNote: "Ghi nhận hương đầu tiên.", aromaAria: "Hương đầu tiên bạn cảm nhận", aromas: ["Thanh", "Dịu", "Rõ", "Chưa cảm nhận"],
        brewAction: "Bắt đầu 3 phút chờ", brewAlt: "Rót nước chậm quanh nguyên búp sen trong ly", brewLabel: "Pha nguyên búp · 04", brewTitle: "Rót chậm quanh búp sen", experimental: "Hướng dẫn thử nghiệm", teaAmount: "Lượng trà", bud: "búp", waterAmount: "Lượng nước", temperature: "Nhiệt độ", brewText: "Đặt nguyên búp vào ly. Giữ dây túi lọc bên ngoài và rót nước chậm quanh búp.",
        enjoyAction: "Thưởng tách trà", waitAlt: "Búp sen dần mở trong tách trà nóng", waitLabel: "Chờ trà · 05", waitTitle: "Để cánh sen nở theo thời gian", narrating: "Câu chuyện Petal Pack đang được kể",
        enjoyAlt: "Khoảnh khắc thưởng tách trà Petal Pack bên khung cửa nhìn ra hồ sen", enjoyLabel: "Thưởng · 06", enjoyTitle: "Hương sen đã mở.", complete: "Khoảng trà bắt đầu.", memorable: "Điều bạn nhớ nhất là gì?", memories: ["Hình dáng búp sen", "Thao tác tách nhẹ", "Hương sen", "Khoảnh khắc chờ", "Vị trà"], preorder: "Đặt trước Petal Pack", trace: "Xem nguồn gốc và lô sản phẩm", feedback: "Gửi phản hồi chi tiết",
      }
    : {
        batch: "Batch", soundOff: "Turn sound off", soundOn: "Turn sound on", story: "Story", sound: "Sound", enableSound: "Sound on", progress: "Ritual progress",
        start: "Begin your tea pause", heroAlt: "Petal Pack and a cup of lotus tea by a lotus pond", tagline: "One lotus bud", oneBrew: "One brew",
        held: "I am holding the lotus bud", touchAlt: "A hand gently holding the base of a lotus bud", touchLabel: "Touch · 01", touchTitle: "Touch the form of the lotus", touchText: "Remove the lotus bud from its wrapping. Hold it gently at the base without squeezing the petals.",
        opened: "I have gently opened it", openAlt: "Before and after gently opening the outer lotus petals", openLabel: "Open gently · 02", openTitle: "Gently open the lotus fragrance", openText: "Create a small opening between the outer petals.", caution: "Do not remove the lotus petals or take the tea bag out of the bud.",
        senseAlt: "Bringing the lotus bud close to sense its aroma", senseLabel: "Sense the aroma · 03", senseTitle: "Bring the lotus bud closer.", senseText: "Slow down for a moment.", senseNote: "Notice the first aroma.", aromaAria: "The first aroma you notice", aromas: ["Fresh", "Soft", "Distinct", "Not yet"],
        brewAction: "Begin the 3-minute wait", brewAlt: "Pouring water slowly around the whole lotus bud", brewLabel: "Brew the whole bud · 04", brewTitle: "Pour slowly around the lotus bud", experimental: "Experimental guidance", teaAmount: "Tea amount", bud: "bud", waterAmount: "Water", temperature: "Temperature", brewText: "Place the whole bud in the cup. Keep the tea-bag string outside and pour water slowly around the bud.",
        enjoyAction: "Enjoy your tea", waitAlt: "The lotus bud gradually opening in hot tea", waitLabel: "Wait · 05", waitTitle: "Let the lotus petals open with time", narrating: "The Petal Pack story is playing",
        enjoyAlt: "Enjoying Petal Pack tea beside a window overlooking a lotus pond", enjoyLabel: "Enjoy · 06", enjoyTitle: "The lotus fragrance has opened.", complete: "Your tea pause begins.", memorable: "What do you remember most?", memories: ["Lotus bud form", "Gently opening the petals", "Lotus aroma", "The waiting moment", "Tea flavour"], preorder: "Preorder Petal Pack", trace: "View origin and product batch", feedback: "Send detailed feedback",
      };
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
            <small>Petal Pack <i aria-hidden="true">·</i> {copy.batch} {displayBatch}</small>
          </span>
        </div>
        <div className={styles.ritualControls}>
          <span className={styles.stepCount} aria-hidden="true">
            {String(sceneIndex + 1).padStart(2, "0")} <i>/</i> 07
          </span>
          {sceneIndex > 0 ? (
            <button type="button" onClick={toggleSound} aria-label={soundEnabled ? copy.soundOff : copy.soundOn}>
              {soundEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
              <span>{isNarrating ? copy.story : soundEnabled ? copy.sound : copy.enableSound}</span>
            </button>
          ) : null}
        </div>
      </div>
      <div
        className={styles.ritualProgress}
        role="progressbar"
        aria-label={copy.progress}
        aria-valuemin={1}
        aria-valuemax={7}
        aria-valuenow={sceneIndex + 1}
      >
        <span style={{ width: `${((sceneIndex + 1) / 7) * 100}%` }} />
      </div>
    </div>
  ), [copy.batch, copy.enableSound, copy.progress, copy.sound, copy.soundOff, copy.soundOn, copy.story, displayBatch, isNarrating, sceneIndex, soundEnabled, toggleSound]);

  let scene: ReactNode;
  if (sceneIndex === 0) {
    scene = (
      <RitualScene
        action={<PrimaryAction onClick={startRitual}>{copy.start}</PrimaryAction>}
        image={`${ASSET_ROOT}/FM.png`}
        imageAlt={copy.heroAlt}
        index={0}
        label="SENOVA"
        title="Petal Pack"
        topBar={topBar}
      >
        <p className={styles.revealTagline}>{copy.tagline} <span>·</span> {copy.oneBrew}</p>
        <p className={styles.batchLine}>{copy.batch} {displayBatch}</p>
      </RitualScene>
    );
  } else if (sceneIndex === 1) {
    scene = (
      <RitualScene
        action={<PrimaryAction onClick={() => completeScene("touch")}>{copy.held}</PrimaryAction>}
        image={`${ASSET_ROOT}/touch.png`}
        imageAlt={copy.touchAlt}
        index={1}
        label={copy.touchLabel}
        title={copy.touchTitle}
        topBar={topBar}
      >
        <p>{copy.touchText}</p>
      </RitualScene>
    );
  } else if (sceneIndex === 2) {
    scene = (
      <RitualScene
        action={<PrimaryAction onClick={() => completeScene("open")}>{copy.opened}</PrimaryAction>}
        compareImage={`${ASSET_ROOT}/touch.png`}
        image={`${ASSET_ROOT}/open.png`}
        imageAlt={copy.openAlt}
        index={2}
        label={copy.openLabel}
        title={copy.openTitle}
        topBar={topBar}
      >
        <p>{copy.openText}</p>
        <p className={styles.caution}>{copy.caution}</p>
      </RitualScene>
    );
  } else if (sceneIndex === 3) {
    scene = (
      <RitualScene
        image={`${ASSET_ROOT}/sense.png`}
        imageAlt={copy.senseAlt}
        index={3}
        label={copy.senseLabel}
        title={copy.senseTitle}
        topBar={topBar}
      >
        <p className={styles.sensoryVerse}>{copy.senseText}<br />{copy.senseNote}</p>
        <div className={styles.aromaChoices} aria-label={copy.aromaAria}>
          {copy.aromas.map((option) => (
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
        action={<PrimaryAction onClick={() => completeScene("brew")}>{copy.brewAction}</PrimaryAction>}
        image={`${ASSET_ROOT}/brew.png`}
        imageAlt={copy.brewAlt}
        index={4}
        label={copy.brewLabel}
        title={copy.brewTitle}
        topBar={topBar}
      >
        <span className={styles.experimentalLabel}>{copy.experimental}</span>
        <dl className={styles.brewSpecs}>
          <div><dt>{copy.teaAmount}</dt><dd>01 <span>{copy.bud}</span></dd></div>
          <div><dt>{copy.waterAmount}</dt><dd>220 <span>ml</span></dd></div>
          <div><dt>{copy.temperature}</dt><dd>≈ 85<span>°C</span></dd></div>
        </dl>
        <p>{copy.brewText}</p>
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
            {copy.enjoyAction}
          </PrimaryAction>
        ) : undefined}
        image={`${ASSET_ROOT}/wait.png`}
        imageAlt={copy.waitAlt}
        index={5}
        label={copy.waitLabel}
        title={copy.waitTitle}
        topBar={topBar}
      >
        <LotusBrewTimer onComplete={() => setWaitComplete(true)} />
        {isNarrating ? <p className={styles.narrationStatus} role="status">{copy.narrating}</p> : null}
      </RitualScene>
    );
  } else {
    const feedbackHref = `/feedback/${product.slug}?batch=${encodeURIComponent(displayBatch)}&source=qr`;
    scene = (
      <RitualScene
        image={`${ASSET_ROOT}/enjoy.png`}
        imageAlt={copy.enjoyAlt}
        index={6}
        label={copy.enjoyLabel}
        title={copy.enjoyTitle}
        topBar={topBar}
        tone="ivory"
      >
        <p className={styles.completionLine}>{copy.complete}</p>
        <fieldset className={styles.memoryChoices}>
          <legend>{copy.memorable}</legend>
          {copy.memories.map((option) => (
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
              {copy.preorder} <ArrowRight aria-hidden="true" />
            </Link>
            <button type="button" onClick={() => setIsTraceOpen(true)}>{copy.trace}</button>
            <Link href={feedbackHref}>{copy.feedback}</Link>
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
