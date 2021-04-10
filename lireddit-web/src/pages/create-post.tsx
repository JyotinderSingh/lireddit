import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = () => {
  const router = useRouter();

  useIsAuth();

  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="regular">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          // we are not doing error handling here, you could add that on your own
          // console.log(values);
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
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

export default withUrqlClient(createUrqlClient)(CreatePost);
