import { Link } from "react-router-dom";

const Nav = ({ children }) => {
  return (
    <>
      <div className="flex justify-between items-center rounded-lg w-[90vw] mx-auto shadow-lg mt-4 border p-4">
        <Link className="font-bold text-2xl" to="/">
          GLARE
        </Link>
        <div>
          <Link
            className="text-gray-600 font-semibold hover:text-blue-400 pr-6"
            to="/projects"
          >
            My Projects
          </Link>
          <Link
            to="/new-projects"
            className="mx-auto mt-4 py-3 px-6 font-semibold text-md rounded-lg shadow-md bg-white text-gray-900 border border-gray-900 hover:border-transparent hover:text-white hover:bg-gray-900 focus:outline-none"
          >
            New Project
          </Link>
        </div>
      </div>
      {children}
    </>
  );
};

export default Nav;
