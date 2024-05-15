import { useState, useEffect } from "react";
import api from "../../api/api";
import { FetchState, useGetProjects } from "../../hooks";
import { Server } from "../../utils/config";
import Alert from "../Alert/Alert";
import {useParams, Link, useNavigate } from "react-router-dom";
import Nav from "../../nav";
const { Query } = require("appwrite");



const Projects = ({ user }) => {
  
 // console.log(user);
  const [projects, setProjects] = useState([]);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  // console.log("projectssss-----",projects);
   
  // const [projectId, setProjectId] = useState([]);
  
  //  useEffect(() => {
  //   {projects?.map((project) => (
  //   // console.log("project------",project);
  //   setProjectId(project.$id)
    
  // ))}
  //   })

  //  console.log("projectId-----",projectId);

  //  function createTourLink(){
  //    var url= 'http://glare.cs.kent.edu:3000/viewer/'+projectId;
  //    console.log("url--------",url);

  //  }
  //  createTourLink();

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
    <>
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
                <button
                  className="py-2 px-4 font-semibold text-md rounded-lg shadow-md bg-white text-gray-900 border border-gray-900 hover:border-transparent hover:text-white hover:bg-gray-900 focus:outline-none"
                  onClick={() => {
                    navigate("/viewer/" + project.$id);
                  }}
                >
                  View
                </button>
                
              </div>
              <p className="mt-6">
                {" "}
                {" "}
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + '/viewer/' + project.$id);
                    setCopied(true); // Set copied to true when the button is clicked
                  }}
                  className={copied ? 'copiedButtonStyle' : 'originalButtonStyle'} // Apply different styles based on copied state
                >
                  {copied ? 'Link Copied!' : 'Click here to copy the tour link!'}
                </button>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Projects;
