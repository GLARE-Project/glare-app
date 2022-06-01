import { useNavigate } from "react-router-dom";

const Landing = () => {
  const history = useNavigate();

  const handleClick = () => {
    history("/new-projects");
  };

  return (
    <>
      <section className="container flex h-screen mx-auto">
        <div className="flex flex-col justify-center p-6 mx-auto text-center">
          <p className="my-8 text-xl font-medium md:text-2xl lg:text-3xl">
            Glare
          </p>
          <h1 className="text-4xl font-bold md:text-6xl lg:text-8xl">
            AR/VR Tour Builder
          </h1>

          <button
            onClick={handleClick}
            className="px-10 py-3 mx-auto mt-4 text-lg font-semibold text-gray-900 bg-white border border-gray-900 rounded-lg shadow-md lg:py-5 lg:px-24 md:text-2xl hover:border-transparent hover:text-white hover:bg-gray-900 focus:outline-none"
          >
            Get Started
          </button>
        </div>
      </section>
    </>
  );
};

export default Landing;
