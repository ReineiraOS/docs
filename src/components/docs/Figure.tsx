interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  bordered?: boolean;
  maxWidth?: string;
}

export default function Figure({
  src,
  alt,
  caption,
  bordered = true,
  maxWidth,
}: FigureProps) {
  return (
    <figure className="my-8" style={maxWidth ? { maxWidth } : undefined}>
      <div
        className={`rounded-lg overflow-hidden ${
          bordered ? "border border-docs-border-default shadow-sm" : ""
        }`}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto block"
          loading="lazy"
        />
      </div>

      {caption && (
        <figcaption className="mt-2.5 text-[13px] text-docs-text-faint text-center leading-snug">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
