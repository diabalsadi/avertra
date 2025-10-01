import Head from "next/head";

const Home = () => {
  return (
    <>
      <Head>
        <title>Avertra - Welcome</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-8 w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Welcome to Avertra Blog
            </h1>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
