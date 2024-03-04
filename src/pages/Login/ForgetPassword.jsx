import { useState } from "react";
import api from "../../api/api";
import { FetchState } from "../../hooks";
import { useNavigate } from "react-router-dom";


const ForgetPassword = ({ dispatch }) => {
  const [email, setEmail] = useState();
 
  let navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     dispatch({ type: FetchState.FETCH_INIT });
//     try {
//       await api.createSession(email, password);
//       const data = await api.getAccount();
//     //  console.log("data-------------",data.password);
//       dispatch({ type: FetchState.FETCH_SUCCESS, payload: data });
//     } catch (e) {
//       dispatch({ type: FetchState.FETCH_FAILURE });
//     }
//   };
  
//console.log("email-------------", email);

//console.log("password---------------------",password);
let url= 'http://glare.cs.kent.edu:8080/v1'
// let navigate = useNavigate();

const forgotPasswordLink = async () => {
    console.log("insideee function----")

// let promise = await api.createRecovery(email, url);

// promise.then(function (response) {
//     console.log(response); // Success
    navigate('/reset-password');
// }, function (error) {
//     console.log(error); // Failure
// });

 };
//   const forgotPasswordLink = async () => {
//     dispatch({ type: FetchState.FETCH_INIT });
//     console.log("insideee function----")
//     try {
//     await api.createRecovery(email, url);
//       dispatch({ type: FetchState.FETCH_SUCCESS, payload: 'Success' });
//       alert("A recovery link sent to you email address. Please check you email!")
//     } catch (error) {
//       dispatch({ type: FetchState.FETCH_FAILURE });
//     }
//   };


  return (
    
    <section className="container h-screen mx-auto flex">
      <div className="flex-grow flex flex-col max-w-xl justify-center p-6">
        <h1 className="text-5xl font-bold">Forgot Password</h1>
        <form onSubmit={forgotPasswordLink}>
          <label className="block mt-6"> Email</label>
          <input
            className="w-full p-4 placeholder-gray-400 text-gray-700 bg-white text-lg border-0 border-b-2 border-gray-400 focus:ring-0 focus:border-gray-900"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="mt-6">
            <button
              type="submit"
              disabled={!email}
              className="mx-auto mt-4 py-4 px-16 font-semibold rounded-lg shadow-md bg-gray-900 text-white border hover:border-gray-900 hover:text-gray-900 hover:bg-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Forgot Password
            </button>
          </div>
      
        </form>
      </div>
    </section>
  );
};

export default ForgetPassword;

