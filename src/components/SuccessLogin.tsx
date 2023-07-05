import { useNavigate } from "react-router-dom"
import { BeatLoader } from "react-spinners"
import { useState } from "react";
const SuccessLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false)
  const redirect = () => {
    setTimeout(() => {
      navigate("/dashboard")
    }, 5000)
    setLoading(true);
  }
  return (
    <article className="success_modal">
      <section className='flex justify-center items-center my-3 sm:mx-4 animate min-h-[100vh]'>
        <div className="bg-[#fff] lg:max-w-[450px] md:max-w-[450px] sm:max-w-[450px] lg:max-h-auto md:max-h-auto sm:max-h-auto w-full flex justify-between flex-col items-center rounded-xl py-10 px-4 text-center shadow-lg">
          <img src="/assets/success.png" alt="" className="w-12 h-12" />
          <h1 className="uppercase mt-3">Login Successful</h1>
          <p className="min-w-0 mb-2 sm:text-[0.75rem] md:text-[0.9rem]">You have successfully signed into your account. You can clos this window and continue using the product</p>
          <button onClick={redirect} className="outline-none border mb-2 px-10 py-2 uppercase rounded-md sm:text-[0.75rem] md:text-[0.9rem] cursor-pointer">
            {loading ? "Redirecting....." : "close window"}
          </button>
            <BeatLoader
              loading={loading}
              color="#63004F"
              speedMultiplier={0.4}
            />
        </div>
      </section>
    </article>
  )
}

export default SuccessLogin