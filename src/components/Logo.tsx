import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function Logo({
  href = "/",
  className = "",
  width = 180,
  height = 50,
  priority = false
}: LogoProps) {
  const logoImage = (
    <Image
      src="/flowuplaod.png"
      alt="Flowpload Logo"
      width={width}
      height={height}
      priority={priority}
      className={`object-contain ${className}`}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-block hover:opacity-80 transition-opacity">
        {logoImage}
      </Link>
    );
  }

  return logoImage;
}
