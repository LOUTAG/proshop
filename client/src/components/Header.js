import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { MdOutlineAccountCircle, MdOutlineShoppingCart } from "react-icons/md";
import { userLogout } from "../redux/slices/usersSlice";
import Searchbox from "./Searchbox";
import { AiOutlineSearch } from "react-icons/ai";

const Header = () => {
  const user = useSelector((store) => store.users.userAuth);
  const dispatch = useDispatch();
  const [pannelActive, setPannelActive] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const onBodyClick = (event) => {
      if (!ref.current.contains(event.target)) {
        setPannelActive(false);
      }
    };
    if (pannelActive) document.body.addEventListener("click", onBodyClick);

    //clean up function
    return () => {
      document.body.removeEventListener("click", onBodyClick);
    };
  }, [pannelActive]);

  return (
    <header className="flex justify-between items-center bg-slate-600 text-white text-lg py-4 px-2 h-[3.125rem]">
      <div className="flex justify-start items-center">
        <Link to="/" className="uppercase font-semibold self-center pr-4">
          proshop
        </Link>
        <AiOutlineSearch size={22} className="block sm:hidden font-bold" />
        <div className="hidden sm:block"><Searchbox /></div>
      </div>
      <nav>
        <ul className="list-none flex flex-wrap items-center capitalize font-semibold">
          {/* Account */}
          {user ? (
            <li className="relative">
              <div
                ref={ref}
                className="cursor-pointer"
                onClick={() => setPannelActive(!pannelActive)}
              >
                {user.firstName}
              </div>
              <div
                className={`${
                  !pannelActive && "hidden"
                } absolute z-10 origin-top-right right-0 bg-white rounded-md mt-2 shadow-lg text-black`}
              >
                <ul className="list-none w-48 py-1">
                  <li className="block hover:bg-black hover:text-white">
                    <Link className="px-4 py-2 block" to="/my-account">
                      My Account
                    </Link>
                  </li>
                  <li className="block hover:bg-black hover:text-white">
                    <button
                      onClick={() => dispatch(userLogout())}
                      className="px-4 py-2 block"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          ) : (
            <li>
              <Link to="/login" className="px-4 flex items-center">
                <MdOutlineAccountCircle className="inline-block mr-1" />
                Login
              </Link>
            </li>
          )}
          {/* Cart */}
          <li>
            <Link to="/cart" className="px-4 flex items-center">
              <MdOutlineShoppingCart className="inline-block mr-1" />
              Cart
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
