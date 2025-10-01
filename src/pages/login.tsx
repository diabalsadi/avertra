import DynamicForm from "@/components/DynamicForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-8 w-full max-w-md max-h-[85vh] overflow-y-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h1>
        <DynamicForm />
      </div>
    </div>
  );
};
export default LoginPage;
