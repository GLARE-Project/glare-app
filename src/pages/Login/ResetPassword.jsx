import { useState } from "react";
import api from "../../api/api";
import { FetchState } from "../../hooks";
import { useNavigate } from "react-router-dom";


const ResetPassword = ({ dispatch }) => {
  const [password, setPassword] = useState();
 
  let navigate = useNavigate();
  
// let navigate = useNavigate();

const resetPassword = async () => {
    console.log("insideee function----")

//let promise = await api.updateRecovery(email, url);

// promise.then(function (response) {
//     console.log(response); // Success
// }, function (error) {
//     console.log(error); // Failure
// });

 };

  return (
    
    <section className="container h-screen mx-auto flex">
      <div className="flex-grow flex flex-col max-w-xl justify-center p-6">
        <h1 className="text-5xl font-bold">Reset Password</h1>
        <form onSubmit={resetPassword}>
          <label className="block mt-6">New Password</label>
          <input
            className="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
            type="text"
            onChange={(e) => setPassword(e.target.value)}
          />
        <label className="block mt-6">Password again</label>
        <input
            className="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
            type="text"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-6">
            <button
              type="submit"
              disabled={!password}
              className="mx-auto mt-4 py-4 px-16 font-semibold rounded-lg shadow-md bg-gray-900 text-white border hover:border-gray-900 hover:text-gray-900 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Password
            </button>
          </div>
      
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;

