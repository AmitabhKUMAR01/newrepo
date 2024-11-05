import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { SPEECH_TO_TEXT_COMMAND } from '../plugins/SpeechToTextPlugin/SpeechToTextPlugin';
import { useState } from 'react';
import { Button } from '@kit/ui/button';
import { Mic } from 'lucide-react';

export default function SpeechToggleButton() {
  const [editor] = useLexicalComposerContext();
  const [isMicOn, setIsMicOn] = useState<boolean>(false);
  const toggleSpeechRecognition = () => {
    setIsMicOn(prev => {
      const newMicStatus = !prev;
      editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, newMicStatus);
      return newMicStatus; 
    });
  };
  return (
    <Button
      onClick={toggleSpeechRecognition}
      variant='outline'
      className={`${isMicOn && 'bg-red-300 hover:bg-red-200 text-black'}`}
    >
      <Mic className={`w-6 h-6 `} />
    </Button>
  );
}
