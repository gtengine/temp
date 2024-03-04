/*********************************************************************************** */
import { kindOfApi } from "@/constants/api-list";
import { Dispatch, SetStateAction } from "react";

export default function SelectLanguage({
  setLanguage,
}: {
  setLanguage: Dispatch<SetStateAction<string>>;
}) {
  return (
    <fieldset className="space-y-2">
      {kindOfApi.map((api) => (
        <div key={api.title} className="flex w-full justify-between text-sm">
          <div className="flex items-center w-24">
            <input
              id={api.title}
              name="kind-of-api"
              type="radio"
              defaultChecked={api.title === kindOfApi[0].title}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              onChange={() => setLanguage(api.title)}
            />
            <label
              htmlFor={api.title}
              className="ml-3 block leading-6 text-gray-900"
            >
              {`${api.title} API`}
            </label>
          </div>
          <div className="flex">
            <div className="table-h px-5 py-1">version</div>
            <div className="table-d px-5 py-1">{api.version}</div>
          </div>
        </div>
      ))}
    </fieldset>
  );
}
