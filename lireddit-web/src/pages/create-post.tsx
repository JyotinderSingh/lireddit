import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

const CreatePost: React.FC<{}> = () => {
  const router = useRouter();

  useIsAuth();

  const [createPost] = useCreatePostMutation();
  return (
    <Layout variant="regular">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          // we are not doing error handling here, you could add that on your own
          // console.log(values);
          const { errors } = await createPost({
            variables: { input: values },
            update: (cache) => {
              // we evict an entire query called posts
              // we can also use fieldName: "posts"
              cache.evict({ fieldName: "posts:{}" });
            },
          });
          if (!errors) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="Title of the Post"
              label="Title"
            />
            <Box mt={4}>
              <InputField
                name="text"
                placeholder="Content of your Post"
                label="Body"
                textarea
              />
            </Box>

            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              colorScheme="blue"
              color="white"
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
