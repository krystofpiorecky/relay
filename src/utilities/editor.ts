export const defineTheme = (monaco: any) => {
  monaco.editor.defineTheme("relay-theme", {
    base: "vs-dark", // or "vs"
    inherit: true,
    rules: [
      { token: "string.key.json", foreground: "d9d9d9" },
      { token: "string.value.json", foreground: "ff917a" },
      { token: "number", foreground: "917AFF" },
      { token: "keyword.json", foreground: "ff6188" },
      { token: "constant.language.json", foreground: "ab9df2" },
      { token: "delimiter.bracket.json", foreground: "ff0000" },
      { token: "delimiter.bracket.json", foreground: "939293" },
      { token: "delimiter.colon.json", foreground: "939293" },
      { token: "delimiter.comma.json", foreground: "939293" },
    ],
    colors: {
      "editor.background": "#00000000",
      "editor.foreground": "#fcfcfa",
      "editorLineNumber.foreground": "#4B5263",
      "editorCursor.foreground": "#fcfcfa",
      "editor.selectionBackground": "#ff917a22",
      "editor.lineHighlightBackground": "#1c1f2b",
      "editorBracketHighlight.foreground1": "#939293",
      "editorBracketHighlight.foreground2": "#939293",
      "editorBracketHighlight.foreground3": "#939293",
      "editorBracketHighlight.foreground4": "#939293",
      "editorBracketHighlight.foreground5": "#939293",
      "editorBracketHighlight.foreground6": "#939293",
    },
  });
};

export const editorOptions = {
  minimap: { enabled: false },
  bracketPairColorization: { enabled: false },
  tabSize: 2,
  scrollBeyondLastLine: false
};
