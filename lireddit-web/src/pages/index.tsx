import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { PostQuery, PostsQuery, usePostsQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return (
      <div>
        <div>
          Something went wrong, or the GraphQL query broke. We're not sure, but
          we're looking into it.
        </div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Layout variant="regular">
      <Flex align="center">
        <Text fontSize="4xl" fontWeight="semibold" color="gray.600">
          <span style={{ color: "teal" }}>li</span>Reddit
        </Text>
        {/* <NextLink href="/create-post">
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
        </NextLink> */}
      </Flex>
      <br />
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Flex
                key={p.id}
                p={5}
                shadow="lg"
                borderWidth="1px"
                borderRadius="xl"
                alignItems="center"
              >
                <UpdootSection post={p} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link style={{ textDecoration: "none" }}>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text size="sm" color="teal.600">
                    posted by {p.creator.username}
                  </Text>
                  <Text flex={1} mt={4}>
                    {p.textSnippet}
                  </Text>

                  <EditDeletePostButtons id={p.id} creatorId={p.creator.id} />
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                // updateQuery: (prevValues, { fetchMoreResult }): PostsQuery => {
                //   if (!fetchMoreResult) {
                //     return prevValues as PostsQuery;
                //   }

                //   return {
                //     __typename: "Query",
                //     posts: {
                //       __typename: "PaginatedPosts",
                //       hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                //       posts: [
                //         ...(prevValues as PostsQuery).posts.posts,
                //         ...(fetchMoreResult as PostsQuery).posts.posts,
                //       ],
                //     },
                //   };
                // },
              });
            }}
            isLoading={loading}
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

export default withApollo({ ssr: true })(Index);
