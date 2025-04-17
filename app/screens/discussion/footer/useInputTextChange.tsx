import { useMemo, useState, useEffect, useContext } from "react";
import debounce from "lodash/debounce";

import {
  DiscussionContext,
  DiscussionServicesContext,
} from "@/definitions/contexts";
import { setDraft } from "@/screens/discussion/discussion.utils";

const IS_TYPING_TIMER = 1500;
const SAVE_DRAFT_TIMER = 250;

const useInputTextChange = () => {
  // state & context
  // -------------------------------------------------------------------
  const { peerId } = useContext(DiscussionContext);
  const { services } = useContext(DiscussionServicesContext);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const debounceValue = useMemo(
    () => debounce(() => setIsTyping(false), IS_TYPING_TIMER),
    []
  );

  const debouncedSetDraft = useMemo(
    () => debounce(setDraft, SAVE_DRAFT_TIMER),
    []
  );

  // handlers
  // -------------------------------------------------------------------
  const handleTextChanged = (text: string | null) => {
    if (!peerId) {
      return;
    }

    debounceValue();

    if (text) {
      debouncedSetDraft(peerId, text);

      if (!isTyping) {
        setIsTyping(true);
      }
    } else {
      setDraft(peerId, "");

      if (isTyping) {
        setIsTyping(false);
      }
    }
  };

  useEffect(() => {
    services?.typing.send(isTyping);

    return () => {
      services?.typing.send(false);
    };
  }, [isTyping, services]);

  // cleanup
  useEffect(() => {
    return () => {
      debounceValue.cancel();
      debouncedSetDraft.cancel();
    };
  }, [debounceValue, debouncedSetDraft]);

  return {
    handleTextChanged,
  };
};

export default useInputTextChange;
