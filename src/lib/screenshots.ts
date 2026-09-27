import insightsSmall from "@/assets/screenshots/insights-1200.webp?url";
import insightsLarge from "@/assets/screenshots/insights-2400.webp?url";
import librarySmall from "@/assets/screenshots/library-1200.webp?url";
import libraryLarge from "@/assets/screenshots/library-2400.webp?url";
import photoDetailSmall from "@/assets/screenshots/photo-detail-1200.webp?url";
import photoDetailLarge from "@/assets/screenshots/photo-detail-2400.webp?url";
import shareSmall from "@/assets/screenshots/share-1200.webp?url";
import shareLarge from "@/assets/screenshots/share-2400.webp?url";
import { type ScreenshotId, screenshots } from "@/lib/copy";

/*
 * Resized ahead of time rather than through Astro's image service: the
 * Cloudflare adapter's default service is the Images binding, which this
 * project does not have. `?url` still gives each file a hashed name.
 *
 * Exported from the full-resolution macOS captures (3024px), not from copies
 * sent through chat, which arrive capped at 2000px: 2400 is what the 1200px
 * slot needs on a 2x screen, so nothing is ever stretched.
 */
const files: Record<ScreenshotId, { large: string; small: string }> = {
  insights: { large: insightsLarge, small: insightsSmall },
  library: { large: libraryLarge, small: librarySmall },
  "photo-detail": { large: photoDetailLarge, small: photoDetailSmall },
  share: { large: shareLarge, small: shareSmall },
};

/** Every screenshot shares one size. */
export const screenshotSize = { height: 1506, width: 2400 };

export type ScreenshotSlide = {
  alt: string;
  id: ScreenshotId;
  src: string;
  srcSet: string;
};

export const screenshotSlides: ScreenshotSlide[] = screenshots.slides.map((slide) => ({
  ...slide,
  src: files[slide.id].large,
  srcSet: `${files[slide.id].small} 1200w, ${files[slide.id].large} 2400w`,
}));
