import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { registerUserAction } from "../redux/slices/usersSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

//components
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";

const Register = () => {
  const store = useSelector((store) => store);
  const { loading, registered, appErr, serverErr } = store.users;
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [inputError, setInputError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (registered) {
      toast.success(registered);
      return navigate("/login");
    }
  }, [registered]);

  useEffect(() => {
    if (appErr || serverErr) {
      toast.error(appErr);
      console.log(serverErr);
    }
  });

  //helpers
  const onFormSumit = (event) => {
    event.preventDefault();
    const emailRegex = /^[a-z0-9.-]+@+[a-z-]+[.]+[a-z]{2,6}$/;
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+=.<>()_~]).{8,32}$/;
    const nameRegex = /^[a-zA-Z.-]{2,20}$/;

    if (!nameRegex.test(inputValue.firstName))
      return setInputError("firstName");
    if (!nameRegex.test(inputValue.lastName)) return setInputError("lastName");
    if (!emailRegex.test(inputValue.email)) return setInputError("email");
    if (!passwordRegex.test(inputValue.password))
      return setInputError("password");
    setInputError(null);
    const payload = {
      firstName: inputValue.firstName,
      lastName: inputValue.lastName,
      email: inputValue.email,
      password: inputValue.password,
    };
    dispatch(registerUserAction(payload));
  };

  return (
    <>
      {loading && <Spinner />}
      <Layout>
        <div className="bg-slate-200 min-h-[calc(100vh-6.25rem)] px-4 py-8 flex justify-center">
          <div className="w-[400px] m-auto">
            <div className="flex text-center flex-wrap bg-slate-300 rounded shadow">
              <div className="w-1/2 uppercase bg-white rounded-t py-2 tracking-tight font-semibold shadow-[4px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Create an Account
              </div>
              <Link
                to="/login"
                className="w-1/2 uppercase py-2 tracking-tight font-semibold rounded-tl opacity-90 shadow-[inset_0_-4px_5px_-2px_rgba(0,0,0,0.1)]"
              >
                Sign In
              </Link>
              <form
                className="flex flex-col w-full p-4 bg-white rounded-b items-start"
                onSubmit={(event) => onFormSumit(event)}
              >
                <label htmlFor="firstName" className="pb-1 tracking-wide">
                  First Name :{" "}
                </label>
                <input
                  name="firstName"
                  type="string"
                  className="border border-slate-300 w-full rounded px-2 py-1"
                  onChange={(event) =>
                    setInputValue({
                      ...inputValue,
                      firstName: event.target.value,
                    })
                  }
                />
                {inputError === "firstName" && (
                  <div className="text-xs text-red-500 italic">
                    FirstName is missing
                  </div>
                )}
                <label htmlFor="lastName" className="pb-1 mt-2 tracking-wide">
                  Last Name :{" "}
                </label>
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
                {inputError === "lastName" && (
                  <div className="text-xs text-red-500 italic">
                    Lastname is missing
                  </div>
                )}
                <label htmlFor="email" className="pb-1 mt-2 tracking-wide">
                  E-mail address :{" "}
                </label>
                <input
                  name="email"
                  type="email"
                  className="border border-slate-300 w-full rounded px-2 py-1"
                  value={inputValue.email}
                  onChange={(event) =>
                    setInputValue({ ...inputValue, email: event.target.value })
                  }
                />
                {inputError === "email" && (
                  <div className="text-xs text-red-500 italic">
                    Email is missing
                  </div>
                )}
                <label htmlFor="password" className="pb-1 mt-2 tracking-wide">
                  Password :{" "}
                </label>
                <input
                  name="password"
                  type="password"
                  className="border border-slate-300 w-full rounded px-2 py-1"
                  value={inputValue.password}
                  onChange={(event) =>
                    setInputValue({
                      ...inputValue,
                      password: event.target.value,
                    })
                  }
                />
                {inputError === "password" && (
                  <div className="text-xs text-red-500 italic">
                    password is missing
                  </div>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 mt-4 bg-[#FFD814] w-full rounded uppercase"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
export default Register;
