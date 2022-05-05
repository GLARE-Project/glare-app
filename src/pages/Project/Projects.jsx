import { useState, useEffect } from "react";
import api from "../../api/api";
import { FetchState, useGetProjects } from "../../hooks";
import { Server } from "../../utils/config";
import Alert from "../Alert/Alert";
import { Link } from "react-router-dom";
const { Query } = require("appwrite");

const Projects = ({ user }) => {
  console.log(user);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getStuff = async () => {
      let response = await api.listDocumentsQuery(Server.collectionID, [
        Query.equal("user", user.$id),
      ]);

      setProjects(response.documents);
    };
    getStuff();
  }, []);

  return (
    <div className="grid grid-cols-2 w-[90vw] mx-auto mt-10 md:grid-cols-4 gap-4">
      {projects?.map((project) => (
        <div className="border rounded-lg">
          <img className="rounded-lg" src={project.homepage_image} />
          <div className="p-4">
            <h3 className="font-bold">{project.project_name}</h3>
            <div className="mt-6 flex justify-between">
              <Link
                className="py-2 px-4 font-semibold text-md rounded-lg shadow-md bg-white text-gray-900 border border-gray-900 hover:border-transparent hover:text-white hover:bg-gray-900 focus:outline-none"
                to={"/edit/" + project.$id}
              >
                Edit Project
              </Link>
              <Link
                className="py-2 px-4 font-semibold text-md rounded-lg shadow-md bg-white text-gray-900 border border-gray-900 hover:border-transparent hover:text-white hover:bg-gray-900 focus:outline-none"
                to=""
              >
                View
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Projects;
