import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Project from "./pages/Project/Project";
import Login from "./pages/Login/Login";
import Landing from "./pages/Landing/Landing";
import { useGetUser } from "./hooks";
import { Link } from "react-router-dom";
import Projects from "./pages/Project/Projects";
import { useState } from "react";
import EditProject from "./pages/Project/Edit-Project";

export default function App() {
  // eslint-disable-next-line
  const [{ user, isLoading, isError }, dispatch] = useGetUser();
  const [project, setProject] = useState();

  return (
    <>
      <BrowserRouter>
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
        <Routes>
          <Route
            path="/new-projects"
            element={
              user ? (
                <Project
                  project={project}
                  setProject={setProject}
                  user={user}
                  dispatch={dispatch}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          ></Route>
          <Route
            path="/projects"
            element={
              user ? (
                <Projects
                  user={user}
                  project={project}
                  setProject={setProject}
                  dispatch={dispatch}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          ></Route>
          <Route
            path="/edit/:id"
            element={
              user ? (
                <EditProject
                  user={user}
                  project={project}
                  setProject={setProject}
                  dispatch={dispatch}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          ></Route>
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/projects" replace />
              ) : (
                <Login dispatch={dispatch} />
              )
            }
          ></Route>
          <Route exact path="/" element={<Landing />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
