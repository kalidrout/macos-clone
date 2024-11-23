import React, { useEffect, useRef } from 'react';

interface AppSandboxProps {
  code: string;
}

export const AppSandbox: React.FC<AppSandboxProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const sandboxContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta http-equiv="Content-Security-Policy" 
              content="default-src 'self' 'unsafe-inline' https:; 
                      img-src 'self' https: data:;
                      style-src 'self' 'unsafe-inline' https:;
                      script-src 'self' 'unsafe-inline';">
            <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { 
                background: transparent;
                margin: 0;
                padding: 1rem;
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/javascript">
              const root = ReactDOM.createRoot(document.getElementById('root'));
              try {
                const AppComponent = (() => {
                  ${code}
                })();
                root.render(React.createElement(AppComponent));
              } catch (error) {
                root.render(React.createElement('div', {
                  style: { color: 'red' }
                }, 'Error loading app: ' + error.message));
              }
            </script>
          </body>
        </html>
      `;

      const blob = new Blob([sandboxContent], { type: 'text/html' });
      iframeRef.current.src = URL.createObjectURL(blob);

      return () => {
        URL.revokeObjectURL(iframeRef.current?.src || '');
      };
    }
  }, [code]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-none"
      sandbox="allow-scripts allow-same-origin"
      title="App Sandbox"
    />
  );
}; 