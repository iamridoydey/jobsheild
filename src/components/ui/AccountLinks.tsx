import { isValidUrl } from "@/lib/ValidUrl";
import React from "react";
import { URL } from "@/lib/interfaces"; // Import the URL interface

const AccountLinks = ({
  urls,
  setUrls,
}: {
  urls: URL[];
  setUrls: React.Dispatch<React.SetStateAction<URL[]>>;
}) => {
  const addField = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setUrls([...urls, { key: "", value: "" }]);
  };

  const removeField = (index: number) => {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newFields = [...urls];
    newFields[index].key = event.target.value;
    setUrls(newFields);
  };

  const handleUrlChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFields = [...urls];
    newFields[index].value = event.target.value;
    setUrls(newFields);
  };

  const allUrlsValid = urls.every((field) => isValidUrl(field.value));

  return (
    <div className="account_links_wrapper py-4">
      <h4 className="account_links_title font-bold">Contact Links</h4>
      <div className="flex flex-col">
        {urls.map((field, index) => (
          <div
            key={index}
            className="mb-3 flex flex-col lg:flex-row gap-2 items-center"
          >
            <div className="w-full lg:w-auto flex-grow">
              <select
                value={field.key}
                onChange={(e) => handleSelectChange(index, e)}
                className="w-full p-2 border rounded outline-none focus:outline-blue-500 bg-gray-100 text-black"
              >
                <option value="">Account</option>
                <option value="website">Website</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
            <div className="w-full lg:w-auto flex-grow flex gap-2">
              <input
                type="text"
                placeholder="Account URL"
                value={field.value}
                onChange={(e) => handleUrlChange(index, e)}
                className="w-full p-2 border rounded outline-none focus:outline-blue-500 bg-gray-100 text-black"
              />

              {urls.length > 1 && (
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

export default AccountLinks;
