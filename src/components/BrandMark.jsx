function BrandMark({ className = "" }) {
  return (
    <span className={`brand-mark ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M13.5 2.5 5.4 13h5.4l-.5 8.5L18.6 11h-5.5l.4-8.5Z" />
      </svg>
    </span>
  );
}

export default BrandMark;
