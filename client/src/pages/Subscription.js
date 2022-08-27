import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import instance from "../utils/api";

const Subscription = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AZn30bMIoncsb_GaCW7gkrshC2BVk0SRBAQ2jpRcBdeE9tzjlyDPsCRCdkbz51sg2SsUChWlqOsMudE4&vault=true&intent=subscription";
    script.async = true;
    script.onload = () => {
      window.paypal
        .Buttons({
          createSubscription: async(data, actions) => {
            try{
              const payload = {
                plan_id: 'P-56C83908D7993143XML7C2MI'
              };
              const response = await instance.post("/api/subscriptions/create-subscription", payload);
              console.log(response);
              const { id } = response.data;
              return id;
            }catch(error){
              throw error;
            }
            // return actions.subscription.create({
            //   plan_id: "P-56C83908D7993143XML7C2MI",
            // });
          },
          onApprove: async (data, actions) => {
            try {
              const response = await instance.put(
                `/api/subscriptions/${data.subscriptionID}/activate`
              );
              toast.success(response.data);
            } catch (error) {
              toast.error(error);
              throw error;
            }
          },
        })
        .render("#paypal-button-container");
    };
    document.body.appendChild(script);
  }, []);

  return (
    <Layout>
      <div className="bg-slate-200 min-h-[calc(100vh-6.25rem)] px-4 py-8 flex justify-center flex-wrap">
        <div className="max-w-[400px] bg-white p-4 shadow rounded">
          <h1 className="uppercase text-semibold ">Subscription</h1>
          <p>1.99€ per month to get access to all our website</p>
          <div id="paypal-button-container"></div>
        </div>
      </div>
    </Layout>
  );
};
export default Subscription;
