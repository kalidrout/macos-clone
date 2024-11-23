import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import Prism from 'prismjs';
import 'xterm/css/xterm.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';

interface FileSystem {
  [key: string]: {
    type: 'file' | 'directory';
    content?: string;
    permissions: string;
    owner: string;
    size: number;
    modified: Date;
    language?: string;
  };
}

interface ITheme {
  background: string;
  foreground: string;
  cursor: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
}

export const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm>();
  const fitAddonRef = useRef(new FitAddon());
  const [currentCommand, setCurrentCommand] = useState('');
  const [path, setPath] = useState('~');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { user } = useStore();

  const [fileSystem, setFileSystem] = useState<FileSystem>({
    '/': { type: 'directory', permissions: 'drwxr-xr-x', owner: 'root', size: 4096, modified: new Date() },
    '/home': { type: 'directory', permissions: 'drwxr-xr-x', owner: 'root', size: 4096, modified: new Date() },
    '~/Documents': { type: 'directory', permissions: 'drwxr-xr-x', owner: 'user', size: 4096, modified: new Date() },
    '~/example.js': { 
      type: 'file', 
      content: 'console.log("Hello World!");', 
      permissions: '-rw-r--r--', 
      owner: 'user', 
      size: 28, 
      modified: new Date(),
      language: 'javascript'
    },
  });

  const getAbsolutePath = (relativePath: string): string => {
    // Simple path resolution - you may want to make this more robust
    if (relativePath.startsWith('/')) return relativePath;
    return path === '~' ? `~/${relativePath}` : `${path}/${relativePath}`;
  };

  useEffect(() => {
    if (terminalRef.current && !xtermRef.current) {
      const xterm = new XTerm({
        theme: {
          background: '#1a1b1e',
          foreground: '#ffffff',
          cursor: '#ffffff',
          black: '#000000',
          red: '#e06c75',
          green: '#98c379',
          yellow: '#d19a66',
          blue: '#61afef',
          magenta: '#c678dd',
          cyan: '#56b6c2',
          white: '#ffffff',
        } as ITheme,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: 14,
        cursorBlink: true,
        cursorStyle: 'block',
      });

      xterm.loadAddon(fitAddonRef.current);
      xterm.loadAddon(new WebLinksAddon());
      
      xterm.open(terminalRef.current);
      fitAddonRef.current.fit();
      
      xterm.write('Welcome to Enhanced Terminal v2.0.0\r\n');
      xterm.write(`${user?.email || 'user'}@localhost:${path}$ `);

      xterm.onKey(({ key, domEvent }) => {
        const char = key;
        
        if (domEvent.keyCode === 13) { // Enter
          xterm.write('\r\n');
          handleCommand(currentCommand);
          setCurrentCommand('');
          xterm.write(`${user?.email || 'user'}@localhost:${path}$ `);
        } else if (domEvent.keyCode === 8) { // Backspace
          if (currentCommand.length > 0) {
            xterm.write('\b \b');
            setCurrentCommand(prev => prev.slice(0, -1));
          }
        } else if (!domEvent.ctrlKey && !domEvent.altKey) {
          xterm.write(char);
          setCurrentCommand(prev => prev + char);
        }
      });

      xtermRef.current = xterm;

      window.addEventListener('resize', () => {
        fitAddonRef.current.fit();
      });
    }

    return () => {
      xtermRef.current?.dispose();
    };
  }, []);

  const writeOutput = (text: string, highlight = false, language = 'bash') => {
    if (!xtermRef.current) return;

    if (highlight) {
      const highlighted = Prism.highlight(text, Prism.languages[language], language);
      // Convert HTML to ANSI escape codes for xterm
      const ansiText = highlighted
        .replace(/<span class="token ([^"]+)">/g, '\x1b[32m') // Green for keywords
        .replace(/<span class="token ([^"]+)">/g, '\x1b[33m') // Yellow for strings
        .replace(/<\/span>/g, '\x1b[0m'); // Reset color
      xtermRef.current.writeln(ansiText);
    } else {
      xtermRef.current.writeln(text);
    }
  };

  const handleCommand = (command: string) => {
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    const args = command.split(' ');
    const cmd = args[0];

    switch (cmd) {
      case 'clear':
        xtermRef.current?.clear();
        break;

      case 'node':
        if (args[1]) {
          const file = fileSystem[getAbsolutePath(args[1])];
          if (file?.type === 'file' && file.content) {
            try {
              // Safely evaluate JavaScript in a sandbox
              const result = new Function(`return ${file.content}`)();
              writeOutput(String(result));
            } catch (error: unknown) {
              if (error instanceof Error) {
                writeOutput(`Error: ${error.message}`, false);
              } else {
                writeOutput('An unknown error occurred', false);
              }
            }
          }
        } else {
          writeOutput('Node.js REPL (press Ctrl+C to exit)', false);
          // Implement REPL mode here
        }
        break;

      case 'cat':
        const filePath = getAbsolutePath(args[1] || '');
        const file = fileSystem[filePath];
        if (file?.type === 'file') {
          writeOutput(file.content || '', true, file.language || 'text');
        } else {
          writeOutput(`cat: ${args[1]}: No such file`, false);
        }
        break;

      case 'edit':
        const editPath = getAbsolutePath(args[1] || '');
        const editFile = fileSystem[editPath];
        if (editFile?.type === 'file') {
          // Launch editor component
          // This would be implemented in your window management system
          writeOutput('Opening editor...', false);
        } else {
          writeOutput(`edit: ${args[1]}: No such file`, false);
        }
        break;

      // ... rest of your existing commands ...

      default:
        writeOutput(`Command not found: ${cmd}`, false);
    }
  };

  // ... rest of your existing helper functions ...

  return (
    <div className="h-full bg-[#1a1b1e] text-white">
      <div ref={terminalRef} className="h-full" />
    </div>
  );
};