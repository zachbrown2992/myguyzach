import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Head from 'next/head';

const STARTERS = [
  { label: 'What has he built from scratch?', prompt: 'What has Zach built from scratch?' },
  { label: 'Wait, did he actually build this?', prompt: 'Did Zach actually build this himself? How does it work?' },
  { label: 'Paste a job posting. Get his 30/60/90.', prompt: null },
];

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleStarter = (s) => {
    if (!s.prompt) {
      inputRef.current?.focus();
      inputRef.current?.setAttribute('placeholder', 'Paste the job description here and hit send...');
      return;
    }
    sendMessage(s.prompt);
  };

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setStarted(true);

    const userMsg = { role: 'user', content: msg };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      const reply = data.reply || 'Something went wrong. Please try again.';
      setMessages([...updated, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([...updated, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Head>
        <title>My Guy Zach</title>
        <meta name="description" content="You've got a role to fill. Ask me anything." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={styles.page}>
        <div style={styles.container}>

          <div style={styles.header}>
            <div style={styles.avatar}>ZB</div>
            <div>
              <h1 style={styles.name}>Hi there, Zach sent me.</h1>
              <p style={styles.tagline}>
                You've got a role to fill. Ask me anything. Let's find out if he's your guy.
              </p>
            </div>
          </div>

          <div style={styles.chatBox}>
            <div style={styles.messages}>
              {!started && (
                <div style={styles.starters}>
                  {STARTERS.map((s) => (
                    <button
                      key={s.label}
                      style={styles.chip}
                      onClick={() => handleStarter(s)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.row,
                    justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={m.role === 'user' ? styles.bubbleUser : styles.bubbleAI}>
                    {m.role === 'user' ? m.content : <div className="prose"><ReactMarkdown>{m.content}</ReactMarkdown></div>}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ ...styles.row, justifyContent: 'flex-start' }}>
                  <div style={{ ...styles.bubbleAI, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={styles.dot1} />
                    <span style={styles.dot2} />
                    <span style={styles.dot3} />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div style={styles.inputRow}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything. We'll see if Zach has solved that problem before."
                style={styles.input}
                rows={1}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{
                  ...styles.sendBtn,
                  opacity: loading || !input.trim() ? 0.4 : 1,
                  cursor: loading || !input.trim() ? 'default' : 'pointer',
                }}
              >
                Send
              </button>
            </div>
          </div>

          <p style={styles.footer}>Built by Zach Brown &nbsp;·&nbsp; Powered by Claude</p>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#FAFAF8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
  },
  container: {
    width: '100%',
    maxWidth: 860,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: '#E8EFF8',
    color: '#2D5BE3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 600,
    flexShrink: 0,
    letterSpacing: '0.03em',
  },
  name: {
    fontSize: 26,
    fontWeight: 600,
    color: '#111',
    lineHeight: 1.2,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#777',
    lineHeight: 1.5,
  },
  chatBox: {
    background: '#fff',
    border: '1px solid #E8E4E0',
    borderRadius: 14,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  messages: {
    minHeight: 420,
    maxHeight: '60vh',
    overflowY: 'auto',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  starters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: '0.5rem',
  },
  chip: {
    fontSize: 13,
    padding: '7px 14px',
    borderRadius: 999,
    border: '1px solid #E0DEDA',
    background: '#F7F5F2',
    color: '#444',
    cursor: 'pointer',
    lineHeight: 1.4,
    transition: 'background 0.15s',
  },
  row: {
    display: 'flex',
    marginBottom: '0.75rem',
  },
  bubbleUser: {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: '12px 12px 2px 12px',
    background: '#2D5BE3',
    color: '#fff',
    fontSize: 14,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
  },
  bubbleAI: {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: '12px 12px 12px 2px',
    background: '#F4F2EF',
    color: '#111',
    fontSize: 14,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
  },
  dot1: { width: 6, height: 6, borderRadius: '50%', background: '#aaa', display: 'inline-block', animation: 'blink 1s infinite' },
  dot2: { width: 6, height: 6, borderRadius: '50%', background: '#aaa', display: 'inline-block', animation: 'blink 1s infinite 0.2s' },
  dot3: { width: 6, height: 6, borderRadius: '50%', background: '#aaa', display: 'inline-block', animation: 'blink 1s infinite 0.4s' },
  inputRow: {
    display: 'flex',
    gap: 8,
    padding: '0.85rem 1rem',
    borderTop: '1px solid #E8E4E0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: '9px 13px',
    border: '1px solid #E0DEDA',
    borderRadius: 8,
    background: '#FAFAF8',
    color: '#111',
    lineHeight: 1.5,
    resize: 'none',
    overflow: 'hidden',
    minHeight: 38,
    maxHeight: 160,
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
  },
  sendBtn: {
    padding: '9px 20px',
    fontSize: 13,
    fontWeight: 500,
    border: '1px solid #E0DEDA',
    borderRadius: 8,
    background: '#fff',
    color: '#111',
    flexShrink: 0,
    transition: 'background 0.15s',
    marginBottom: 1,
  },
  footer: {
    fontSize: 11,
    color: '#bbb',
    textAlign: 'center',
  },
};
