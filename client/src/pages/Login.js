import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAction } from "../redux/slices/usersSlice";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import setupInterceptors from "../utils/setupInterceptors";

//import store
import store from "../redux/store";


//components
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";

const Login = () => {
  const [inputValue, setInputValue] = useState({ email: "", password: "" });
  const [inputError, setInputError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const { loading, userAuth, appErr, serverErr } = users;

  useEffect(() => {
    if ((appErr, serverErr)) {
      console.log(serverErr);
      toast.error(appErr);
    }
  }, [appErr, serverErr]);
  useEffect(() => {
    if (userAuth) {
      setupInterceptors(store);
      toast.success(`Hello ${userAuth.firstName}`);
      navigate("/");
    }
  }, [userAuth]);

  //helpers
  const onFormSubmit = (event) => {
    event.preventDefault();
    const emailRegex = /^[a-z0-9.-]+@+[a-z-]+[.]+[a-z]{2,6}$/;
    if (!emailRegex.test(inputValue.email)) return setInputError("email");
    if (inputValue.password === "") return setInputError("password");
    setInputError("");
    const payload = {
      email: inputValue.email,
      password: inputValue.password,
    };
    dispatch(loginUserAction(payload));
  };
  return (
    <>
      {loading && <Spinner />}
      <Layout>
        <div className="bg-slate-200 min-h-[calc(100vh-6.25rem)] px-4 py-8 flex justify-center">
          <div className="w-[400px] m-auto">
            <div className="flex text-center flex-wrap bg-slate-300 rounded shadow">
              <Link to="/register" className="w-1/2 uppercase py-2 tracking-tight font-semibold rounded-tl opacity-90 shadow-[inset_0_-4px_5px_-2px_rgba(0,0,0,0.1)]">
                Create an account
              </Link>
              <div className="w-1/2 uppercase bg-white rounded-t py-2 tracking-tight font-semibold shadow-[-4px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Sign In
              </div>
              <form
                className="flex flex-col w-full p-4 bg-white rounded-b items-start"
                onSubmit={(event) => onFormSubmit(event)}
              >
                <label htmlFor="email" className="pb-1 tracking-wide">E-mail address : </label>
                <input
                  className="border border-slate-300 w-full rounded px-2 py-1"
                  type="email"
                  name="email"
                  value={inputValue.email}
                  onChange={(event) =>
                    setInputValue({ ...inputValue, email: event.target.value })
                  }
                />
                {inputError === "email" && (
                  <div className="text-red-500 text-sm italic">
                    Provide a correct email adress
                  </div>
                )}
                <label htmlFor="password" className="pb-1 mt-2 tracking-wide">Password : </label>
                <input
                  className="border border-slate-300 w-full rounded px-2 py-1"
                  type="password"
                  name="password"
                  value={inputValue.password}
                  onChange={(event) =>
                    setInputValue({
                      ...inputValue,
                      password: event.target.value,
                    })
                  }
                />
                {inputError === "password" && (
                  <div className="text-red-500 text-sm italic">
                    Provide a password
                  </div>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 mt-4 bg-[#FFD814] w-full rounded uppercase "
                >
                  login
                </button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
export default Login;
