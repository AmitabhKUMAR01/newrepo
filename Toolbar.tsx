import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import styles from "./Toolbar.module.css";
import { ToolbarHeadings } from "./ToolbarHeadings";
import { ToolbarInline } from "./ToolbarInline";
import { ToolbarCommands } from "./ToolbarCommands";
import { ToolbarAlignment } from "./ToolbarAlignment";
import { ToolbarBlock } from "./ToolbarBlock";
import { ToolbarMedia } from "./ToolbarMedia";
import { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ToolbarInsert } from "./ToolbarInsert";
import { ToolbarFontFamily } from "./ToolbarFontfamily";
import { ToolbarFontSize } from "./ToolbarFontsize";
import FindAndReplace from "./FindReplace";
import SpeechToggleButton from "./SpeechToText";


export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <div className={styles.toolbarContainer}>
        <div className="h-[60px] flex items-center justify-start px-4 gap-2 p-1.5 min-w-max border-b border-border/80 bg-background">
          <ToolbarCommands />
          <FindAndReplace/>
          <SpeechToggleButton/>
          <ToolbarFontFamily/>
          <ToolbarFontSize/>
          <ToolbarHeadings editor={editor} />

          <span className="w-[1px] py-2 mx-2 bg-border" />

          <ToolbarInline />

          <span className="w-[1px] py-2 mx-2 bg-border" />

          <ToolbarBlock />

          <span className="w-[1px] py-2 mx-2 bg-border" />

          <ToolbarAlignment />

          <span className="w-[1px] py-2 mx-2 bg-border" />

          <ToolbarInsert />
        </div>
        {/* <motion.div className={styles.progressBar} style={{ scaleX }} /> */}
      </div>
    </>
  );
}
