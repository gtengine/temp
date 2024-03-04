import { useEffect, useState } from "react";
/*********************************************************************************** */
import { apis, kindOfApi } from "@/constants/api-list";
import { modes } from "@/constants/test-modes";
import { ListboxDataTypes } from "@/types/listbox";

export function useTest() {
  // API 언어 선택
  const [language, setLanguage] = useState<string>(kindOfApi[0].title);
  // API 기능 선택
  const [api, setApi] = useState<ListboxDataTypes>(apis[0]);
  // 시험 모드 선택
  const [mode, setMode] = useState<string>(modes[0].title);
  // 시험 모드 옵션 선택
  const [modeOption, setModeOption] = useState<ListboxDataTypes>(
    modes[0].dataSet[0]
  );

  // 시험 측정 모드가 변경시 초기값 주입
  useEffect(() => {
    if (mode === modes[0].title) {
      setModeOption(modes[0].dataSet[0]);
    } else if (mode === modes[1].title) {
      setModeOption(modes[1].dataSet[0]);
    } else if (mode === modes[2].title) {
      setModeOption(modes[2].dataSet[0]);
    }
  }, [mode]);

  return {
    language,
    setLanguage,
    api,
    setApi,
    mode,
    setMode,
    modeOption,
    setModeOption,
  };
}
