type Props = {
  content: string;
  variant?: 'default' | 'pullquote' | 'header';
};

export default function FieldNoteQuote({ content, variant = 'default' }: Props) {
  if (!content) return null;

  const baseStyle: React.CSSProperties = {
    margin: '1.5rem 0',
    fontStyle: 'italic',
    lineHeight: 1.7,
  };

  if (variant === 'pullquote') {
    return (
      <blockquote
        className="field-note field-note--pullquote"
        style={{
          ...baseStyle,
          padding: '1.5rem 2rem',
          borderLeft: '4px solid #d8973c',
          background: '#fdf9f3',
          borderRadius: '0 8px 8px 0',
          fontSize: '1.15rem',
          color: '#3b3020',
          fontFamily: "var(--font-secondary, 'Lora', Georgia, serif)",
        }}
      >
        <p style={{ margin: 0 }}>{content}</p>
      </blockquote>
    );
  }

  if (variant === 'header') {
    return (
      <div
        className="field-note field-note--header"
        style={{
          ...baseStyle,
          padding: '1rem 0',
          fontSize: '1.1rem',
          color: '#5a4a36',
          borderBottom: '2px solid #e8dcc8',
          fontFamily: "var(--font-secondary, 'Lora', Georgia, serif)",
        }}
      >
        <p style={{ margin: 0 }}>{content}</p>
      </div>
    );
  }

  return (
    <blockquote
      className="field-note"
      style={{
        ...baseStyle,
        padding: '1rem 1.25rem',
        borderLeft: '3px solid #3b6978',
        background: '#f5f8fa',
        borderRadius: '0 6px 6px 0',
        fontSize: '0.95rem',
        color: '#333',
      }}
    >
      <p style={{ margin: 0 }}>{content}</p>
    </blockquote>
  );
}
