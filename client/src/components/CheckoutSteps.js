import React from "react";
import { Link } from "react-router-dom";
const CheckoutSteps = ({step1, step2, step3, step4}) => {
  return (
    <div className="w-full">
      <div className="h-8 my-4 relative max-w mx-8 sm:mx-16">
        {/* Line */}
        <div className={`absolute inset-x-0 top-1/4 bottom-1/4 ${step4 ? 'stepFour' : step3 ? 'stepThree' : step2 ? 'stepTwo' : 'stepOne'}`}></div>

        {/* Login */}
        <Link to="/login" className={`${!step1 ? 'pointer-events-none bg-slate-300 after:text-slate-400' : 'bg-[#f9be8f]'} h-8 w-8 rounded-full absolute inset-y-0 left-0 -translate-x-1/2 after:content-['Login'] after:absolute after:top-[100%] after:left-0 after:translate-x-[calc(1rem-50%)]`} />

        {/* Shipping */}
        <Link to="/shipping" className={`${!step2 ? 'pointer-events-none bg-slate-300 after:text-slate-400' : 'bg-[#f29798]'} h-8 w-8 rounded-full absolute inset-y-0 left-1/3 -translate-x-1/2 after:content-['Shipping'] after:absolute after:top-[100%] after:left-0 after:translate-x-[calc(1rem-50%)]`} />
        
        {/* Payment */}
        <Link to="/payment" className={`${!step3 ? 'pointer-events-none bg-slate-300 after:text-slate-400' : 'bg-[#eb70a0]'} h-8 w-8 rounded-full absolute inset-y-0 left-2/3 -translate-x-1/2 after:content-['Payment'] after:absolute after:top-[100%] after:left-0 after:translate-x-[calc(1rem-50%)]`} />
        
        {/* Place Order */}
        <Link to="/placeorder" className={`${!step4 ? 'pointer-events-none bg-slate-300 after:text-slate-400' : 'bg-[#e348a9]'} h-8 w-8 rounded-full absolute inset-y-0 left-full -translate-x-1/2 after:content-['Order'] after:absolute after:top-[100%] after:left-0 after:translate-x-[calc(1rem-50%)]`} />
      </div>
    </div>
  );
};
export default CheckoutSteps;