type LogoProps = {
  className?: string;
};

// The app logo, swapped for /logo-dark.png when it's inside the dark theme.
// `[.dark_&]` means "when an ancestor has the .dark class" (set by UserLayout),
// so this follows the theme with plain CSS and needs no isDark prop.
export default function Logo({ className = "" }: LogoProps) {
  return (
    <>
      <img src="/logo.png" alt="" className={`${className} [.dark_&]:hidden`} />
      <img
        src="/logo-dark.png"
        alt=""
        className={`${className} hidden [.dark_&]:block`}
      />
    </>
  );
}
