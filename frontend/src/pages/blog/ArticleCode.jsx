import React from 'react';

export default function ArticleCode({ language, children }) {
  return (
    <div className="code-box">
      <div className="code-header">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{language}</span>
      </div>
      <pre
        className="code-body"
        style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}
        tabIndex={0}
        aria-label={language + ' code example'}
      >
        {children}
      </pre>
    </div>
  );
}
