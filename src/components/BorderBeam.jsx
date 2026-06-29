import React from 'react';

/**
 * BorderBeam component
 * Renders a slow-moving, looping light beam animation around the border of its parent container.
 * Requires the parent container to be 'relative' and have a set border-radius (e.g. 'rounded-2xl').
 * 
 * @param {Object} props
 * @param {number} props.size Size of the glowing beam in pixels (default: 150)
 * @param {number} props.duration Rotation speed in seconds (default: 15 for slow loop)
 * @param {number} props.borderWidth Width of the border beam line in pixels (default: 1.5)
 * @param {string} props.colorFrom Hex/RGBA starting color (default: blue theme #3b82f6)
 * @param {string} props.colorTo Hex/RGBA ending color (default: indigo theme #6366f1)
 * @param {number} props.delay Rotation start delay in seconds (default: 0)
 * @param {string} props.className Additional tailwind classes
 */
export const BorderBeam = ({
  size = 150,
  duration = 8,
  borderWidth = 1.5,
  colorFrom = "#3b82f6",
  colorTo = "#6366f1",
  delay = 0,
  className = "",
}) => {
  return (
    <div
      style={{
        "--size": `${size}px`,
        "--duration": `${duration}s`,
        "--border-width": `${borderWidth}px`,
        "--color-from": colorFrom,
        "--color-to": colorTo,
        "--delay": `${delay}s`,
      }}
      className={`pointer-events-none absolute inset-0 rounded-[inherit] [border:var(--border-width)_solid_transparent]

      /* Masking compositing trick: restricts visibility strictly to the border stroke area */
      ![mask-clip:padding-box,border-box] 
      ![-webkit-mask-composite:xor] 
      ![mask-composite:exclude] 
      [mask-image:linear-gradient(#000,#000),linear-gradient(#000,#000)] ${className}`}
    >
      <div
        className="absolute aspect-square w-[var(--size)] [motion-path:rect(0_auto_auto_0_round_16px)] [offset-path:rect(0_auto_auto_0_round_16px)] animate-border-beam"
        style={{
          background: 'linear-gradient(to left, var(--color-from), var(--color-to), transparent)',
          animationDelay: 'var(--delay)',
        }}
      />
    </div>
  );
};

export default BorderBeam;
