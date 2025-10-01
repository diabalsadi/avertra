const BlogsPage = () => {
  return (
    <div>
      <h1>Blogs</h1>
    </div>
  );
};

export const getServerSideProps = async ({}) => {
  return {
    props: {
      blogs: [],
    },
  };
};

export default BlogsPage;
