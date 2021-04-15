import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Link, Stack, Box, Heading, Text, Flex } from "@chakra-ui/react";
import NextLink from "next/link";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 5,
    },
  });
  return (
    <Layout variant="regular">
      <Flex align="center">
        <Text fontSize="4xl" fontWeight="semibold" color="gray.600">
          <span style={{ color: "teal" }}>li</span>Reddit
        </Text>
        <NextLink href="/create-post">
          <Link
            ml="auto"
            borderWidth="1px"
            borderRadius="xl"
            padding="0.8rem"
            style={{ textDecoration: "none" }}
            color="white"
            fontWeight="semibold"
            bg="teal.400"
            _hover={{
              bg: "teal.300",
            }}
          >
            Create Post
          </Link>
        </NextLink>
      </Flex>
      <br />
      {!data ? (
        <div>loading..</div>
      ) : (
        <Stack spacing={8}>
          {data.posts.map((p) => (
            <Box
              key={p.id}
              p={5}
              shadow="lg"
              borderWidth="1px"
              borderRadius="xl"
            >
              <Heading fontSize="xl">{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
