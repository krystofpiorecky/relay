import { Editor } from "@monaco-editor/react";
import "./Cache.scss";
import { defineTheme, editorOptions } from "@utilities/editor";

export const Cache = () => {
  return <div className="cache">
    <nav>

    </nav>
    <div className="editor">
      <header>
        <div className="method-badge">GET</div>
        <div className="path">/api/stash/categories/</div>
      </header>
      <Editor
        defaultLanguage="json"
        defaultValue={`{
    "hello": "world",
    "lskdfj": {
        "x": 123
    }
}
`}
        onChange={(value) => console.log(value)}
        beforeMount={defineTheme}
        theme="relay-theme"
        options={editorOptions}
      />
    </div>
  </div>
}