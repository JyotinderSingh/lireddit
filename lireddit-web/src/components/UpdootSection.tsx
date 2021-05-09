import { ApolloCache } from "@apollo/client";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { gql } from "urql";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";

interface UpdootSectionProps {
  // post: PostsQuery["posts"]["posts"][0];
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    let newPoints = data.points;
    let newValue = null;
    if (data.voteStatus) {
      if (data.voteStatus === 1 && value === 1) {
        newValue = null;
        newPoints -= 1;
      } else if (data.voteStatus === 1 && value === -1) {
        newValue = -1;
        newPoints -= 2;
      } else if (data.voteStatus === -1 && value === -1) {
        newValue = null;
        newPoints += 1;
      } else if (data.voteStatus === -1 && value === 1) {
        newValue = 1;
        newPoints += 2;
      }
    } else {
      newPoints += value;
      newValue = value;
    }

    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { id: postId, points: newPoints, voteStatus: newValue },
    });
  }
};

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" mr={5}>
      <IconButton
        onClick={async () => {
          // if (post.voteStatus === 1) {
          //   return;
          // }
          setLoadingState("updoot-loading");
          await vote({
            variables: {
              postId: post.id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "updoot-loading"}
        aria-label="updoot"
        icon={<ChevronUpIcon boxSize="24px" />}
        mb={2}
        size="sm"
        bgColor={post.voteStatus === 1 ? "teal.200" : "gray.200"}
        _hover={{
          bgColor: "teal.300",
        }}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          // if (post.voteStatus === -1) {
          //   return;
          // }
          setLoadingState("downdoot-loading");
          await vote({
            variables: {
              postId: post.id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downdoot-loading"}
        aria-label="downdoot"
        icon={<ChevronDownIcon boxSize="24px" />}
        mt={2}
        size="sm"
        bgColor={post.voteStatus === -1 ? "red.200" : "gray.200"}
        _hover={{
          bgColor: "red.300",
        }}
      />
    </Flex>
  );
};
