import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Project from "./pages/Project/Project";
import Login from "./pages/Login/Login";
import Landing from "./pages/Landing/Landing";
import { useGetUser } from "./hooks";
import { Link } from "react-router-dom";
import Projects from "./pages/Project/Projects";
import { useState } from "react";
import EditProject from "./pages/Project/Edit-Project";
import Viewer from "./pages/Viewer";
import Intro from "./pages/Viewer/Intro";
import Nav from "./nav";
import ForgetPassword from "./pages/Login/ForgetPassword";
import ResetPassword from "./pages/Login/ResetPassword";

export default function App() {
  // eslint-disable-next-line
  const [{ user, isLoading, isError }, dispatch] = useGetUser();
  const [project, setProject] = useState();

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="viewer/:tourid/*" element={<Viewer />}></Route> */}
          <Route
            path="/new-projects"
            element={
              user ? (
                <Nav>
                  <Project
                    project={project}
                    setProject={setProject}
                    user={user}
                    dispatch={dispatch}
                  />
                </Nav>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          ></Route>
          <Route
            path="/projects"
            element={
              user ? (
                <Nav>
                  <Projects
                    user={user}
                    project={project}
                    setProject={setProject}
                    dispatch={dispatch}
                  />
                </Nav>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          ></Route>
          <Route
            path="/edit/:id"
            element={
              user ? (
                <Nav>
                  <EditProject
                    user={user}
                    project={project}
                    setProject={setProject}
                    dispatch={dispatch}
                  />
                </Nav>
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
          <Route
            exact
            path="/"
            element={
              <Nav>
                <Landing />
              </Nav>
            }
          ></Route>

          <Route
            path="/forgot-password"
            element={
              <ForgetPassword />
            }
          ></Route>

          <Route
            path="/reset-password"
            element={
              <ResetPassword />
            }
          ></Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}
