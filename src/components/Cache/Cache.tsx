import { Editor, Monaco, OnMount } from "@monaco-editor/react";
import "./Cache.scss";
import { defineTheme, editorOptions } from "@utilities/editor";
import { useBridgeState } from "@utilities/bridge";
import { Icon } from "@iconify/react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { editor } from "monaco-editor";

type CacheTreeNode = {
  name: string,
  path: string,
  type: "file" | "directory",
  children?: CacheTreeNode[],
};

export const Cache = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [ tree ] = useBridgeState<CacheTreeNode | undefined>("cache:tree", undefined);
  const [ path, setPath ] = useState<string[]>([]);
  const [ content, setContent ] = useBridgeState<string, string>("file:content", "", path.join("/") + ".json");

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const model = monaco.editor.createModel(content, "json");
    editor.setModel(model);
  }, [ content ]);

  const handleFileOpen = async (path: string[]) => {
    setPath(path);
  };

  const handleFileSave = async () => {
    if (!editorRef.current) return;
    const content = editorRef.current?.getValue();
    if (content) setContent(content, true);
  };

  return <div className="cache">
    <nav>
      {tree && <Tree tree={tree} path={[]} onFileOpen={handleFileOpen} />}
    </nav>
    <div className="editor">
      <header>
        <div className="method-badge">GET</div>
        <div className="path">{path.join("/")}</div>
        <button onClick={handleFileSave}>
          <Icon icon="mingcute:save-2-fill" />
          Save
        </button>
      </header>
      <Editor
        defaultLanguage="json"
        onChange={(value) => console.log(value)}
        onMount={handleMount}
        beforeMount={defineTheme}
        theme="relay-theme"
        options={editorOptions}
      />
    </div>
  </div>
};

const Tree = ({ tree, path, onFileOpen }: { tree: CacheTreeNode, path: string[], onFileOpen: (path: string[]) => void }) => {
  const [ expanded, setExpanded ] = useState(true);

  if (tree.type === "file")
    return <div className="tree-file" onClick={() => onFileOpen([...path, tree.name])}>
      {tree.name}
    </div>;

  if (!tree.children)
    return <></>;

  return <div className="tree" style={{ "--depth": path.length } as CSSProperties }>
    {path.length > 0 && <header onClick={() => setExpanded(x => !x)} data-expanded={expanded}>
      <Icon icon="mingcute:down-small-fill" /> {tree.name}
    </header>}
    {expanded && <main>
      {tree.children.map(i =>
        <Tree tree={i} key={i.name} path={[...path, tree.name]} onFileOpen={onFileOpen} />
      )}
    </main>}
  </div>;
};
