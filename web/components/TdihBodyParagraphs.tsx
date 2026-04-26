import { splitTdihBodyIntoParagraphs } from '../lib/tdih';

type Props = {
  body: string;
  /** Tighter “card in browse” vs full article day page */
  variant?: 'card' | 'article';
};

export default function TdihBodyParagraphs({ body, variant = 'card' }: Props) {
  const paras = splitTdihBodyIntoParagraphs(body);
  const isCard = variant === 'card';

  return (
    <>
      {paras.map((text, i) => (
        <p
          key={i}
          style={
            isCard
              ? {
                  margin: i === 0 ? '0.8rem 0 0' : '0.75rem 0 0',
                  color: '#333',
                  lineHeight: 1.7,
                }
              : {
                  margin: i === paras.length - 1 ? '0 0 0' : '0 0 1rem',
                  color: '#222',
                  lineHeight: 1.75,
                }
          }
        >
          {text}
        </p>
      ))}
    </>
  );
}
