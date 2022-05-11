import { ReplyIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(-1)}
      className="bg-white-900 shadow-lg rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-200 p-4 cursor-pointer absolute bottom-10 left-10"
    >
      <ReplyIcon className="w-10 " />
    </div>
  );
};

export default BackButton;
