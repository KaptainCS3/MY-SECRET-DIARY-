import Nav from "../components/Nav";
import AuthUser from "../components/AuthUser";
import Footer from "../components/Footer";
const Home = () => {
  return (
    <div className="w-full">
      <Nav headerText="My Private Diary" />
      <div className="flex items-center flex-col px-6">
        <h1 className="text-black font-bold text-2xl my-5">
          Welcome to private diary
        </h1>
        <p className="text-center text-lg">
          Create private entries, log your activities update records and publish
          what you want the public to see
        </p>
        <button className="uppercase underline mt-16 outline-none mb-4">
          get started
        </button>
        {<AuthUser />}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
