import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userProfileAction, updateUserProfileAction } from "../redux/slices/usersSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import Error from "../components/Error";

const MyAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((store) => store.users);
  const { loading, error, userAuth, success } = users;
  //use error to add if something went wrong;
    const [inputValue, setInputValue]=useState({firstName: userAuth.firstName, lastName: userAuth.lastName, email: userAuth.email, password: ''});
  const [editProfile, setEditProfile] = useState(false);
  const [firstRender, setFirstRender]=useState(true);
  useEffect(() => {
    dispatch(userProfileAction());
  }, []);

  useEffect(() => {
    if (!userAuth) {
      toast.warn("Your session has expired, please login");
      navigate("/login");
    }
  }, [userAuth]);

  useEffect(()=>{
    if(success && !firstRender){
        toast.success('Profile has been updated with success');
    }
  },[success])
  
  useEffect(()=>{
    setFirstRender(false);
  },[]);

  const onFormSubmit=(event)=>{
    event.preventDefault();
    const emailRegex = /^[a-z0-9.-]+@+[a-z-]+[.]+[a-z]{2,6}$/;
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+=.<>()_~]).{8,32}$/;
    const nameRegex = /^[a-zA-Z.-]{2,20}$/;
    const payload={}
    if(inputValue.firstName!==userAuth.firstName){
        if(!nameRegex.test(inputValue.firstName)) return toast.error('First Name is not valid');
        payload.firstName = inputValue.firstName;
    }
    if(inputValue.lastName!==userAuth.lastName){
        if(!nameRegex.test(inputValue.lastName)) return toast.error('Last Name is not valid');
        payload.lastName = inputValue.lastName;
    }

    if(inputValue.email!==userAuth.email){
        if(!emailRegex.test(inputValue.email)) return toast.error('Email is not valid');
        payload.email = inputValue.email;
    }
    if(inputValue.password!==''){
        if(!passwordRegex.test(inputValue.password)) return toast.error('Password is not valid');
        payload.password = inputValue.password;
    }
    console.log(Object.keys(payload).length)
    if(Object.keys(payload).length>0){
        dispatch(updateUserProfileAction(payload));
        setEditProfile(false);
    }
  }

  const renderProfile = () => {
    if (editProfile) {
      return(
        <form className="sm:w-[400px] bg-white p-4 w-full rounded shadow" onSubmit={(event)=>onFormSubmit(event)}>
          <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
            <label htmlFor="firstName">First Name :</label>
            <input
                  name="firstName"
                  type="string"
                  className="border border-slate-300 w-full rounded px-2 py-1"
                  value={inputValue.firstName}
                  onChange={(event) =>
                    setInputValue({
                      ...inputValue,
                      firstName: event.target.value,
                    })
                  }
                />
            <label htmlFor="lastName">Last Name :</label>
            <input
                  name="lastName"
                  type="string"
                  className="border border-slate-300 w-full rounded px-2 py-1"
                  value={inputValue.lastName}
                  onChange={(event) =>
                    setInputValue({
                      ...inputValue,
                      lastName: event.target.value,
                    })
                  }
                />
            <label htmlFor="email">E-mail :</label>
            <input
                  name="email"
                  type="email"
                  className="border border-slate-300 w-full rounded px-2 py-1"
                  value={inputValue.email}
                  onChange={(event) =>
                    setInputValue({ ...inputValue, email: event.target.value })
                  }
                />
            <label htmlFor="password">Password :</label>
            <input
                  name="password"
                  type="password"
                  className="border border-slate-300 w-full rounded px-2 py-1"
                  placeholder="********"
                  value={inputValue.password}
                  onChange={(event) =>
                    setInputValue({
                      ...inputValue,
                      password: event.target.value,
                    })
                  }
                />
          </div>
          <button
          type="submit"
            className="bg-[#FFD814] rounded w-full sm:max-w-[200px] py-2 px-4 mx-auto my-4 font-semibold text-lg capitalize block"
          >
            Update
          </button>
        </form>
      );
    } else {
      return (
        <div className="sm:w-[400px] bg-white p-4 w-full rounded shadow">
          <div className="grid grid-cols-[1fr_2fr] gap-4 items-end">
            <div>First Name :</div>
            <div>{userAuth?.firstName}</div>
            <div>Last Name :</div>
            <div>{userAuth?.lastName}</div>
            <div>E-mail :</div>
            <div className="break-words">{userAuth?.email}</div>
            <div>Password :</div>
            <div>********</div>
          </div>
          <button
            className="bg-black text-white rounded w-full sm:max-w-[200px] py-2 px-4 mx-auto my-4 font-semibold text-lg capitalize block"
            onClick={() => setEditProfile(true)}
          >
            Edit
          </button>
        </div>
      );
    }
  };

  return (
      loading ? <Spinner /> : error ? <Layout><Error  message={error}/></Layout> : <Layout>
        <div className="bg-slate-200 min-h-[calc(100vh-6.25rem)] px-4 py-8 flex justify-center">
          <div className="m-auto">
            <h1 className="text-2xl text-center pb-4">My Account</h1>
            {renderProfile()}
          </div>
        </div>
      </Layout> 
  );
};
export default MyAccount;
