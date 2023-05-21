import * as React from 'react';
import './style.css';

import { getEncoding } from 'js-tiktoken';

const tiktoken = getEncoding('cl100k_base');

function numberToColor(number) {
  const goldenRatioConjugate = 0.618033988749895;

  // Constants for a linear congruential generator (LCG)
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);

  // Generate a pseudorandom number using the LCG.
  const pseudorandom = (a * number + c) % m;

  // Compute a hue value using the golden angle.
  const hue = ((pseudorandom * goldenRatioConjugate) % 1) * 360;

  // Allow saturation to vary between 60% and 100%.
  const s = 60 + (pseudorandom % 41);

  // Allow lightness to vary between 70% and 90%.
  const l = 70 + (pseudorandom % 21);

  return `hsl(${hue}, ${s}%, ${l}%)`;
}

function mapTextToSubstringsAndTokens(text: string): Array<[string, number]> {
  const tokens = tiktoken.encode(text);
  return tokens.map((token) => [tiktoken.decode([token]), token]);
}

const TextWithColors = ({ tokensAndSubstrings }) => {
  return (
    <pre className="tokens-visualized" style={{ whiteSpace: 'pre-wrap' }}>
      {tokensAndSubstrings.map(([substring, token], index) => (
        <span
          key={index}
          title={token.toString()}
          className="token-span"
          style={{
            backgroundColor: numberToColor(token),
          }}
        >
          {substring}
        </span>
      ))}
    </pre>
  );
};

export default function App() {
  const [txt, setTxt] = React.useState('');
  const toks = mapTextToSubstringsAndTokens(txt);
  return (
    <div className="page">
      <h1 className="title">GPT4 Tokenizer Visualizer</h1>
      <p className="description">
        Like{' '}
        <a href="https://platform.openai.com/tokenizer">
          https://platform.openai.com/tokenizer
        </a>{' '}
        but for GPT4
      </p>
      <textarea
        className="text-input"
        value={txt}
        onChange={(e) => setTxt(e.target.value)}
      />
      <div className="stats">
        <span>
          <b>Chars:</b> {txt.length}
        </span>
        <span>
          <b>Words:</b> {txt.split(' ').length}
        </span>
        <span>
          <b>Tokens:</b> {toks.length}
        </span>
      </div>
      <TextWithColors tokensAndSubstrings={toks} />
      <pre className="tokens-raw">
        {JSON.stringify(
          toks.map(([, t]) => t),
          null,
          2
        ).replaceAll('\n', ' ')}
      </pre>
    </div>
  );
}
