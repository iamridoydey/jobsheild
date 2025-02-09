const CompanyName = ({
  setCompanyName,
}: {
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setCompanyName(e.target.value);
  }
  return (
    <div className="flex flex-col">
      <label htmlFor="fraud_company_name" className="font-bold">
        Company Name
      </label>
      <input
        type="text"
        placeholder="Enter Company / Agency Name"
        id="fraud_company_name"
        className="outline-none focus:outline-blue-500 p-2 rounded-sm bg-gray-200"
        onChange={(e)=> handleOnChange(e)}
      />
    </div>
  );
};

export default CompanyName;
