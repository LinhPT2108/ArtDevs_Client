interface CubeSpanProps {
  index: number;
}

export const CubeSpan: React.FC<CubeSpanProps> = ({ index }) => {
  const spanStyle: React.CSSProperties = {
    ["--i" as any]: index,
  };

  return <span style={spanStyle} className="cube-span"></span>;
};
