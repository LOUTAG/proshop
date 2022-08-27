import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const ref = useRef();

  useEffect(()=>{
    ref.current.style.height= "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  },[description]);

  const resetForm=()=>{
    setTitle('');
    setImage('');
    setPrice('');
    setDescription('');
  }

  const onFormSubmit = async(event) => {
    event.preventDefault();
    if(title==="" || image==="" || price==='' || description==='') return toast.warn('Some field are missing');
    const url = "/api/products/add";
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", image);
    const config = {
        headers:{
            "Content-Type": "multipart/form-data"
        }
    }
    try{
        const response = await axios.post(url, formData, config);
        console.log(response.data);
        toast.success('Product has been added');
        resetForm();
    }catch(error){
        toast.error('Something went wrong');
        throw error;
    }
  };

  return (
    <Layout>
      <div className="bg-slate-200 min-h-[calc(100vh-6.25rem)] px-4 py-8 flex justify-center">
        <div className="w-[400px] m-auto">
          <div className="flex text-center flex-wrap bg-slate-300 rounded shadow p-4">
            <form
            className="w-full"
              onSubmit={(event) => onFormSubmit(event)}
              encType="multipart/form-data"
            >
              <div className="pb-4">
                <label className="block" htmlFor="title">
                  Title
                </label>
                <input id="title" type="text" value={title} onChange={(event)=>setTitle(event.target.value)} />
              </div>
              <div className="pb-4">
                <label className="block" htmlFor="image">
                  Image
                </label>
                <input id="image" type="file" onChange={(event)=>setImage(event.target.files[0])} />
              </div>
              <div className="pb-4">
                <label className="block" htmlFor="price">
                  Price
                </label>
                <input id="price" type="number" value={price} onChange={(event)=>setPrice(event.target.value)} />
              </div>
              <div className="pb-4">
                <label className="block" htmlFor="description">
                  Description
                </label>
                <textarea
                  ref={ref}
                  id="description"
                  className="bg-primary overflow-auto resize-none w-full focus:outline-none rounded-2xl py-2 px-3 placeholder:text-gray-500"
                  value={description}
                  onChange={(event)=>setDescription(event.target.value)}
                ></textarea>
              </div>
              <button type="submit">Add Product</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default AddProduct;
