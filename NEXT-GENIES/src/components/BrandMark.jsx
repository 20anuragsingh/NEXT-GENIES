function BrandMark({ className = "" }) {
  return (
    <span className={`brand-mark ${className}`} aria-hidden="true">
      <img src="/ng-logo-transparent.png" alt="" />
    </span>
  );
}

export default BrandMark;
