type JerseyIconProps = {
  color: string;
  textColor: string;
  label: string;
  size?: number;
};

const JerseyIcon = ({ color, textColor, label, size = 64 }: JerseyIconProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shirt body */}
      <path
        d="M16 20V56H48V20L56 12L44 4H38C38 4 35 10 32 10C29 10 26 4 26 4H20L8 12L16 20Z"
        fill={color}
        stroke={color === '#FFFFFF' || color === '#F0F0F0' ? '#CBD5E1' : 'rgba(0,0,0,0.15)'}
        strokeWidth="1"
      />
      {/* Collar */}
      <path
        d="M26 4C26 4 29 8 32 8C35 8 38 4 38 4"
        fill="none"
        stroke={color === '#FFFFFF' || color === '#F0F0F0' ? '#CBD5E1' : 'rgba(255,255,255,0.3)'}
        strokeWidth="1.5"
      />
      {/* Label text */}
      <text
        x="32"
        y="40"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize="22"
        fontWeight="bold"
        fontFamily="Inter, sans-serif"
        style={{ userSelect: 'none' }}
        pointerEvents="none"
      >
        {label}
      </text>
    </svg>
  );
};

export default JerseyIcon;
