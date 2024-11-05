"use client";

import "./styles.css"

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { AutoLinkPlugin, createLinkMatcherWithRegExp } from "@lexical/react/LexicalAutoLinkPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { LineBreakNode } from 'lexical';
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import {
  FloatingComposer,
  liveblocksConfig,
  LiveblocksPlugin,
  useEditorStatus,
  FloatingThreads,
} from "@liveblocks/react-lexical";
import { useThreads } from "@liveblocks/react/suspense";
import { useIsMobile } from "./use-is-mobile";
import Loading from "../../loading";
import Toolbar from "../Toolbar/Toolbar";
import EditorTheme from "./theme";
import { EditingPlugin } from "../plugins/ai-editing-plugin";
import { ToolbarPlugin } from "../plugins/toolbar-plugin";
import TableOfContentsPlugin from "../plugins/TableOfContentsPlugin";
import TableActionMenuPlugin from "../plugins/TableActionMenuPlugin";
import TableHoverActionsPlugin from "../plugins/TableHoverActionsPlugin";
import TableCellResizerPlugin from "../plugins/TableCellResizerPlugin";
import FigmaPlugin from "../plugins/FigmaPlugin";
import { FigmaNode } from "../nodes/FigmaNode";
import AutoEmbedPlugin from "../plugins/AutoEmbedPlugin";
import { useState } from "react";
import InsertNode from "../nodes/InsertNode";
import DeleteNode from "../nodes/DeleteNode";
import TrackChangesPlugin from "../plugins/TrackChangesPlugin/TrackChangesPlugin";
import { If } from "@kit/ui/if";
import editorStyles from "./editor.module.css";
import SpeechToTextPlugin from "../plugins/SpeechToTextPlugin/SpeechToTextPlugin";


const URL_REGEX =
   /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const EMAIL_REGEX =
   /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

const MATCHERS = [
   createLinkMatcherWithRegExp(URL_REGEX, (text) => {
      return text;
   }),
   createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => {
      return `mailto:${text}`;
   }),
];

const urlRegExp = new RegExp(
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
);
export function validateUrl(url: string): boolean {
  return url === 'https://' || urlRegExp.test(url);
}

export default function Editor() {
  const status = useEditorStatus();

  const [isInSuggestionMode, setIsInSuggestionMode] = useState(false);

  return (
    <>
      {status === "not-loaded" || status === "loading" ? (
        <Loading />
      ) : (
        <>
          <Toolbar />
          <div className="relative flex flex-row">
            {/* <TableOfContentsPlugin /> */}
            {/* Editable */}
            <div className={editorStyles.editorContainer}>
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="outline-none flex-1 transition-all" />
                }
                ErrorBoundary={LexicalErrorBoundary}
              />

              <AutoLinkPlugin matchers={MATCHERS}/>
              <CheckListPlugin />
              <ClickableLinkPlugin />
              <HistoryPlugin />
              <LinkPlugin validateUrl={validateUrl}/>
              <ListPlugin />
              <MarkdownShortcutPlugin />
              <EditingPlugin />
              <ToolbarPlugin />
              <TabIndentationPlugin />
              <If condition={isInSuggestionMode}>
                <TrackChangesPlugin />
              </If>
              <TablePlugin
                hasCellMerge={true}
                hasCellBackgroundColor={true}
              />
              <TableHoverActionsPlugin />
              <TableActionMenuPlugin />
              <TableCellResizerPlugin />
              <FigmaPlugin />
              <AutoEmbedPlugin />
                <SpeechToTextPlugin/>
              <FloatingComposer className="w-[350px]" />

              <div className="xl:[&:not(:has(.lb-lexical-anchored-threads))]:pr-[200px] [&:not(:has(.lb-lexical-anchored-threads))]:pr-[50px]">
                <Threads />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function Threads() {
  const { threads } = useThreads();
  const isMobile = useIsMobile();

  return isMobile ? ( <FloatingThreads threads={threads} /> ) : null;
}
