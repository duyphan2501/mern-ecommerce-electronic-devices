import { Button } from "@mui/material";
import { FiImage } from "react-icons/fi";
import { slideTypes } from "../../data/slideRepository";

const EmptyImage = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400">
    <FiImage size={34} />
    <span className="text-sm font-medium">Add an image to preview</span>
  </div>
);

const SlidePreview = ({ slide, compact = false }) => {
  const isFeature = slide.type === "feature";
  const isSide = slide.type === "side";

  return (
    <div>
      {!compact && (
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800">Live preview</p>
            <p className="text-sm text-slate-500">
              {slideTypes[slide.type]?.description}
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {slideTypes[slide.type]?.label}
          </span>
        </div>
      )}

      <div
        className={`relative overflow-hidden bg-slate-100 ${
          isSide
            ? "mx-auto aspect-[4/3] max-w-[360px] rounded-xl"
            : isFeature
              ? "aspect-[16/9] rounded-xl"
              : "aspect-[12/5] rounded-xl"
        }`}
      >
        {slide.image ? (
          <img
            src={slide.image}
            alt={slide.name || "Slide preview"}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <EmptyImage />
        )}

        {isFeature && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/30 to-transparent" />
            <div
              className={`absolute inset-y-0 left-0 flex w-[62%] flex-col justify-center text-white ${
                compact ? "space-y-1 p-3" : "space-y-3 p-8"
              }`}
            >
              <p
                className={`font-semibold uppercase tracking-[0.18em] text-cyan-200 ${
                  compact ? "text-[8px]" : "text-xs"
                }`}
              >
                {slide.title || "Campaign title"}
              </p>
              <h3
                className={`font-bold leading-tight ${
                  compact ? "line-clamp-2 text-sm" : "text-3xl"
                }`}
              >
                {slide.content || "Your promotion headline"}
              </h3>
              {!compact && (
                <>
                  <p className="text-sm text-slate-100">
                    {slide.footer || "Supporting campaign message"}
                  </p>
                  <div>
                    <Button
                      variant="contained"
                      size="small"
                      className="!normal-case"
                    >
                      {slide.linkContent || "Learn more"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {!isFeature && slide.name && !compact && (
          <div className="absolute bottom-3 left-3 rounded-lg bg-slate-950/70 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            {slide.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlidePreview;

