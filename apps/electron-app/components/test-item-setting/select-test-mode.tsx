import { modes } from "@/constants/test-modes";
import ListboxSet from "../listbox";
import { Dispatch, SetStateAction } from "react";
import { ListboxDataTypes } from "@/types/listbox";

export default function SelectMode({
  mode,
  setMode,
  setModeOption,
}: {
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
  setModeOption: Dispatch<SetStateAction<ListboxDataTypes>>;
}) {
  return (
    <fieldset className="space-y-2">
      {/* 라디오 버튼 셋 */}
      {modes.map((item) => (
        <div
          key={item.title}
          className="flex w-full items-center justify-between h-8 text-sm"
        >
          <div className="flex items-center w-24">
            <input
              id={item.title}
              name="set-mode"
              type="radio"
              defaultChecked={item.title === modes[0].title}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              onChange={() => setMode(item.title)}
            />
            <label
              htmlFor={item.title}
              className="ml-3 block leading-6 text-gray-900 min-w-max"
            >
              {`${item.title} 측정`}
            </label>
          </div>
          {/* 각 항목 리스트 박스 */}
          {item.title !== "무한" && (
            <div className="w-28">
              <ListboxSet
                dataSet={item.dataSet}
                mode={mode}
                setModeOption={setModeOption}
              />
            </div>
          )}
        </div>
      ))}
    </fieldset>
  );
}
