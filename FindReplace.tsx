import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { createCommand, LexicalCommand, LexicalEditor, COMMAND_PRIORITY_EDITOR, $nodesOfType, TextNode } from 'lexical';
import { Input } from '@kit/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@kit/ui/dialog';
import { Button } from '@kit/ui/button';
import { Replace } from 'lucide-react';

interface Payload {
  from: string;
  to: string;
}

const FIND_REPLACE_COMMAND: LexicalCommand<Payload> = createCommand('FIND_REPLACE_COMMAND');

const listener = ({ from, to }: Payload, editor: LexicalEditor) => {
  editor.update(() => {
    const textNodes = $nodesOfType(TextNode);

    for (const node of textNodes) {
      const text = node.getTextContent();
      node.setTextContent(text.split(from).join(to)); 
    }
  });
  return true;
};

export default function FindReplacePlugin() {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [count, setCount] = useState(0); 

  useEffect(() => {
    return editor.registerCommand(FIND_REPLACE_COMMAND, listener, COMMAND_PRIORITY_EDITOR);
  }, [editor]);

  const countOccurrences = (text: string) => {
    if (!text) {
      return 0;
    }
    let totalCount = 0;
    editor.update(() => {
      const textNodes = $nodesOfType(TextNode);

      textNodes.forEach((node) => {
        const content = node.getTextContent();
        totalCount += content.split(text).length - 1; 
      });
    });
    return totalCount;
  };
  useEffect(() => {
   if(!isOpen) {
    setFindText('');
    setReplaceText('');
    setCount(0);
   }
  },[isOpen])

  useEffect(() => {
    const occurrenceCount = countOccurrences(findText);
    setCount(occurrenceCount);
  }, [findText, editor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editor.dispatchCommand(FIND_REPLACE_COMMAND, { from: findText, to: replaceText });
    setIsOpen(false);
  };

  return (
    <div>
      <Button variant='outline' onClick={() => setIsOpen(true)}><Replace/></Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find and Replace</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <Input
                placeholder="Find"
                onChange={(e) => setFindText(e.target.value)}
                value={findText}
                required
              />
              {findText && (
                <p className="text-sm text-gray-500 mt-1">
                  Found {count} {count === 1 ? 'occurrence' : 'occurrences'}
                </p>
              )}
            </div>
            <div className="mb-4">
              <Input
                placeholder="Replace with"
                onChange={(e) => setReplaceText(e.target.value)}
                value={replaceText}
                disabled={!count}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="mr-2">Replace</Button>
              <Button type="button" onClick={() => setIsOpen(false)}>Close</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
