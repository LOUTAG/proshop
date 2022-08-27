import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Searchbox = () => {
  const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

  const onFormSubmit=(event)=>{
    event.preventDefault();
    if(keyword !==""){
        navigate(`/search/${keyword}`);
        setKeyword("");
    }
  }
  return (
    <form onSubmit={(event)=>onFormSubmit(event)}>
      <input
        type="text"
        className="p-2 rounded shadow text-black"
        value={keyword}
        placeholder="Search product"
        onChange={(event) => setKeyword(event.target.value)}
      />
    </form>
  );
};
export default Searchbox;
