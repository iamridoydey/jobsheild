import { isValidUrl } from "@/lib/ValidUrl";
import React from "react";
import { HR } from "@/lib/interfaces"; // Import the HR interface

const HrList = ({
  hrList,
  setHrList,
}: {
  hrList: HR[];
  setHrList: React.Dispatch<React.SetStateAction<HR[]>>;
}) => {
  const addField = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setHrList([...hrList, { name: "", account: "", accountUrl: "" }]);
  };

  const removeField = (index: number) => {
    setHrList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newFields = [...hrList];
    newFields[index].account = event.target.value;
    setHrList(newFields);
  };

  const handleUrlChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFields = [...hrList];
    newFields[index].accountUrl = event.target.value;
    setHrList(newFields);
  };

  const handleNameChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFields = [...hrList];
    newFields[index].name = event.target.value;
    setHrList(newFields);
  };

  const allUrlsValid = hrList.every((field) => isValidUrl(field.accountUrl));

  return (
    <div className="hrlist_wrapper py-4">
      <h4 className="hrlist_title font-bold">HR List</h4>
      <div className="flex flex-col">
        {hrList.map((field, index) => (
          <div
            key={index}
            className="mb-3 flex flex-col lg:flex-row gap-2 items-center"
          >
            <div className="w-full lg:w-auto flex-grow">
              <input
                type="text"
                placeholder="HR Name"
                value={field.name}
                onChange={(e) => handleNameChange(index, e)}
                className="w-full p-2 border rounded outline-none focus:outline-blue-500 bg-gray-200 text-black"
              />
            </div>
            <div className="w-full lg:w-auto flex-grow">
              <select
                value={field.account}
                onChange={(e) => handleSelectChange(index, e)}
                className="w-full p-2 border rounded outline-none focus:outline-blue-500 bg-gray-200 text-black"
              >
                <option value="website">Website</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
            <div className="w-full lg:w-auto flex-grow flex flex-row gap-1">
              <input
                type="text"
                placeholder="URL"
                value={field.accountUrl}
                onChange={(e) => handleUrlChange(index, e)}
                className="w-full p-2 border rounded outline-none focus:outline-blue-500 bg-gray-200 text-black"
              />

              {hrList.length > 1 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeField(index);
                  }}
                  className="bg-gray-500 text-white px-4 rounded hover:bg-gray-700 mt-2 lg:mt-0"
                >
                  -
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          onClick={addField}
          className={`bg-blue-700 text-white py-2 px-4 rounded ${
            !allUrlsValid
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-500"
          }`}
          disabled={!allUrlsValid}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default HrList;
