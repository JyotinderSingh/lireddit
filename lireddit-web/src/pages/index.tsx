import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import {
  Link,
  Stack,
  Box,
  Heading,
  Text,
  Flex,
  Button,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return (
      <div>
        Something went wrong, or the GraphQL query broke. We're not sure, but
        we're looking into it.
      </div>
    );
  }

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
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) => (
            <Box
              key={p.id}
              p={5}
              shadow="lg"
              borderWidth="1px"
              borderRadius="xl"
            >
              <Heading fontSize="xl">{p.title}</Heading>
              <Text size="sm" color="teal.600">
                posted by {p.creator.username}
              </Text>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() =>
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }
            isLoading={fetching}
            m="auto"
            my={8}
            colorScheme="blackAlpha"
          >
            Load more
          </Button>
        </Flex>
      ) : (
        <Flex align="center">
          <Box m="auto" my={8}>
            You're all caught up 🎉
          </Box>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
